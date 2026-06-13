# 開發日誌 · DEVLOG

## 2026-06-13 — Session 2：Hobonichi 手帳一日一頁版面

### 做了什麼
1. **版面切換**：header 加「📖 經典 / 🗓 手帳」切換鈕，存 `gx_view`；`body.hobonichi` 控制顯示，手帳頁 `#hoboPage` 與既有電子書卡片互斥。導覽改走 `refresh()`（依模式呼叫 `render()` 或 `renderHobo()`）。
2. **點陣紙手帳頁**（`.hobo-sheet`）：18px radial-gradient 點陣、莫蘭迪 `#f4f0e7`、左側金漸層書脊。
3. **日期區塊**：大日 + `EN_MON` + `EN_WD · 週幾` + `dayOfYear` 一年第幾天 + 月相（`moonInfo`：以 2000-01-06 朔為基準推 8 相 emoji + 朔/上弦/望…）。
4. **左側時間軸**：06/09/12/15/18/21/00/03，flex `space-between` 隨頁高自動分布。
5. **迷你月曆**（`buildHboCal`）：今天高亮、有內容的日子有金點、點日跳轉；**月份側邊 tab**（`buildHboTab`，1–12、現月亮、未來月 disabled）。
6. **手寫／打字雙模式**（`gx_hobomode`，預設手寫；`setHoboMode`）：✍ 手寫 `#hbPad` 覆蓋書寫區，沿用 diary canvas 的 pointer 模式，存 **`gx_hobo:YYYY-MM-DD`**（獨立鍵，不與 `gx_canvas` 互相縮放失真）；⌨ 打字 `#hbEntry` textarea **共用 `diary:` 鍵**（與經典隨筆打字同一份，切視圖互通；故 streak/回顧/匯出免再整合）。切換鈕在 `.hobo-bar`（手寫時顯示筆色工具列、打字時隱藏）。**坑**：`#hbEntry` CSS 預設 `display:none`，setHoboMode 切打字要設 `display:block` 不能設 `""`（會 fallback 回 none）。
7. **底部今日金句**：當日 `item.best` 滿版頁底，呼應 hobonichi 每日一句。
8. **整合**：`gx_hobo` 併入連續天數（`hasContent`）、`allDiaryDates`、回顧（🗓 縮圖）、匯出 MD / JSON 備份 / 還原。

### 驗證方式
- `node --check`（抽出 inline JS）通過。
- 無頭瀏覽器 `preview_eval` 逐項實測：grid 量測（720 / 46+1fr / canvas==zone）、真 pointer 事件畫一筆→存檔+連續天數+月曆金點、月曆/月tab/上下日導覽、**84 天掃描 canvas 高永遠 == zone（含木蘭詩 422 字→頁高 1292、零 mismatch）**、經典⇄手帳切換持久化——全程零 console 錯誤。
- 註：本環境 `preview_screenshot` 逾時（擷圖管線問題，非頁面問題；eval 正常、console 乾淨），改以幾何/功能量測 + show_widget 還原預覽驗收。

### 現狀
- 40 篇不變；新增手帳版面。repo 待 commit（v2）。

---

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
`gx_start`｜`diary:YYYY-MM-DD`(打字)｜`gx_canvas:YYYY-MM-DD`(隨筆畫布)｜`gx_hobo:YYYY-MM-DD`(手帳頁手寫，Session 2)｜`gx_diarymode`｜`gx_hobomode`(手帳手寫/打字，Session 2)｜`gx_view`(經典/手帳，Session 2)｜`gx_read`/`gx_marks`(篇id)｜`gx_anno`(劃線批註,依篇)｜`gx_ink`(詩上手寫,依篇)｜`gx_font`

### 原則
- **原文一律查證、禁憑記憶杜撰**（用字、作者、出處錯了就失去意義）。
- 資料各裝置自存，換機靠 JSON 備份/還原。
