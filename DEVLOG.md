# 開發日誌 · DEVLOG

## 2026-06-13 — Session 1：從 0 到 v1（電子書 + 手帳日記 app）

### 做了什麼（時序）
1. **需求起點**：使用者想做能提升國學素養的東西。原本想做一個 Claude Code *skill*，討論後改為**直接做一個「每日國學」單檔本機 app**（不放進 D:\知識庫）。
2. **核心決策**：日記型 app、每天推一篇、七類按星期輪、要作者背景、漸進式呈現、要像電子書、要能手寫/塗畫。「詩歌」確認為《詩經》→ 七類串成先秦到歷代的文學史。
3. **`index.html` 單檔成形**：七類 × 篇目；依星期決定類別；原文 / 注釋 / 白話 / 賞析 / 作者 / 今日一問；漸進式摺疊；日記存 localStorage、連續天數、回顧時間軸、匯出 MD/JSON + 還原。
4. **篇目 14 → 27**（高信度經典）。
5. **不重複引擎**：改為以使用者「開始週」`gx_start` 為起點逐週推進，**讀完整章才循環**（非 modulo）。
6. **電子書介面**：目錄 / 章節 / 閱讀進度 / 字級 A−A+ / 書籤 / 鍵盤 ← → 翻頁 / 翻頁動畫 / 藏書閣自由翻閱。
7. **劃線批註（圈點眉批）**：選原文 → 螢光劃線 + 在該句寫批註；依篇 `gx_anno`（char offset，用 Range.toString() 算）。
8. **詩上手寫**：原文上覆蓋 canvas，用筆自由書寫；依篇 `gx_ink`。
9. **莫蘭迪配色**：整體換低飽和灰調（霧粉 `--seal:#a07a6f`、霧金 `--gold:#a99a78`）。
10. **上 Wikisource 逐字查證**，補厚漢賦 + 各類，**27 → 40**（漢賦 2→4：歸田賦升前二章 + 鵩鳥賦 + 刺世疾邪賦系詩；另補木蘭詩、登幽州臺歌、念奴嬌、四塊玉、擊鼓、岳陽樓記、醉翁亭記等）。
11. **隨筆 → 自由畫布**：今日心得改為「✍畫布 / ⌨打字」雙模式；畫布依日期 `gx_canvas`（PNG，莫蘭迪五色筆）；連續天數「有字或有畫」皆算；回顧 / 匯出 MD（嵌圖）/ JSON 備份 / 還原全含手繪。修掉 `sizeDiary` 抓到 0px 寬的時機 bug。
12. **打包上 GitHub**：新增 README / ROADMAP / PWA（manifest + sw + icon）/ .gitignore；`git init` + commit（v1）；建 private repo 並 push。

### 驗證方式
- 每個階段 `node --check`（JS 語法）+ 無頭瀏覽器 `preview_eval` 實測（不重複序列、劃線、手寫、畫布像素、存讀），全程**零 console 錯誤**。

### 現狀
- **40 篇**：樂府6 / 漢賦4 / 唐詩7 / 宋詞7 / 元曲4 / 詩經7 / 古文5。
- repo：`bestwish1987-hash/meiri-guoxue-diary`（private, `main`, v1 = 4544363）。

### 下一步（詳見 ROADMAP.md）
1. **變成 app**：PWA 已起手 → PNG icon → GitHub Pages → 安裝；進階 Tauri 打包 .exe。
2. **Hobonichi 手帳版面**：格線背景 + 左側時間軸(6/9/12/15/18/21/0/3) + 角落日期月相 + 底部金句 + 迷你月曆。
3. **擴到 366 篇不重複**：Wikisource/ctext 逐字查證（禁杜撰）；建議把 `CORPUS` 抽成 `data/corpus.json` 方便分批擴充。

### localStorage keys
`gx_start`｜`diary:YYYY-MM-DD`(打字)｜`gx_canvas:YYYY-MM-DD`(隨筆畫布)｜`gx_diarymode`｜`gx_read`/`gx_marks`(篇id)｜`gx_anno`(劃線批註,依篇)｜`gx_ink`(詩上手寫,依篇)｜`gx_font`

### 原則
- **原文一律查證、禁憑記憶杜撰**（用字、作者、出處錯了就失去意義）。
- 資料各裝置自存，換機靠 JSON 備份/還原。
