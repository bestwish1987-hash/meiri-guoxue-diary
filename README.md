# 每日國學日記 · Daily Guoxue Diary

本機優先、離線可用的「每日國學」**電子書 + 手帳日記** app。每天依星期推一篇中國古典文學（樂府詩、漢賦、唐詩、宋詞、元曲、詩經、古文觀止），可閱讀、劃線批註、手寫、畫畫寫日記，**不重複、可永久累積**。

> 個人專案。原文以 [zh.wikisource.org](https://zh.wikisource.org) 等逐字查證，**不憑記憶杜撰**。

## 執行
- 直接用瀏覽器開 `index.html`（雙擊即可，離線可用）。
- 或開本機伺服器（PWA / Service Worker 需 http）：
  ```
  python -m http.server 8731
  # 瀏覽器開 http://localhost:8731
  ```

## 功能
- **每日一篇**：依星期輪類別；從使用者「開始週」起逐週推進，**讀完整章才循環 → 不重複**。
- **電子書**：目錄/章節、閱讀進度、字級 A−/A+、鍵盤 ← → 翻頁、書籤 ☆、翻頁動畫。
- **劃線批註 ✎**：選原文 → 螢光劃線 + 在該句寫批註（依篇保存）。
- **詩上手寫 ✍**：在原文上用筆自由書寫（依篇）。
- **隨筆自由畫布**：今日心得是一片自由畫布（莫蘭迪五色筆 / 橡皮 / 復原 / 清除），也可一鍵切換打字（依日期）。
- **匯出 / 備份**：Markdown（嵌手繪）＋ JSON（含畫布）＋ 還原。
- **每晚 20:45**：Windows 排程自動開啟。

## 資料（皆存於瀏覽器 localStorage，本機）
| key | 內容 |
|---|---|
| `gx_start` | 使用者開始週（決定不重複序列） |
| `diary:YYYY-MM-DD` | 當日打字心得 |
| `gx_canvas:YYYY-MM-DD` | 當日隨筆畫布（PNG dataURL） |
| `gx_diarymode` | 隨筆模式 draw / type |
| `gx_read` / `gx_marks` | 已讀 / 書籤（篇 id） |
| `gx_anno` | 劃線批註（依篇，char offset） |
| `gx_ink` | 詩上手寫（依篇，PNG） |
| `gx_font` | 字級 |

> 資料各裝置自存。換裝置請用 JSON 備份 / 還原。

## 篇目
目前 **40 篇**（樂府6 / 漢賦4 / 唐詩7 / 宋詞7 / 元曲4 / 詩經7 / 古文5）。
目標 **366 篇**（全年每天不重複）。擴充方式見 [ROADMAP.md](ROADMAP.md)。

## Roadmap（回家繼續做）
1. **變成 app**：PWA 已起手（`manifest.webmanifest` + `sw.js`）；待 PNG icon、GitHub Pages、安裝。
2. **Hobonichi 風版面**：手帳格線 + 時間軸 + 角落日期 + 底部金句 + 迷你月曆。
3. **擴充到 366 篇不重複**。

詳見 [ROADMAP.md](ROADMAP.md)。

---
🤖 與 [Claude Code](https://claude.com/claude-code) 共同開發。
