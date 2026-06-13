# Roadmap

## 1. 變成 app
- [x] 單檔離線 HTML
- [x] PWA：`manifest.webmanifest` + `sw.js`（app shell 離線快取）+ `index.html` 已註冊 Service Worker
- [ ] PNG icon（192 / 512 / maskable）；目前先用 `icon.svg`
- [ ] 部署 GitHub Pages（Settings → Pages → Branch: main / root）→ 取得 https 網址
- [ ] 瀏覽器「安裝應用程式」→ 釘到桌面 / 手機主畫面（standalone）
- [ ] （進階）改 [Tauri](https://tauri.app) 打包成真正的桌面 `.exe`

## 2. Hobonichi 風版面（參考 ほぼ日手帳 一日一頁）✅ 已完成（Session 2）
頂部「📖 經典 / 🗓 手帳」切換鈕（`gx_view`），`body.hobonichi` 切換主題，手帳頁為自成一頁的 `#hoboPage`。
- [x] **點陣紙背景**：`radial-gradient` 18px 點陣，莫蘭迪 `#f4f0e7`。
- [x] **左側時間軸**：06/09/12/15/18/21/00/03（flex `space-between` 隨頁高分布）。
- [x] **角落日期區塊**：大日 + `JUN` + `SAT · 週六` + 一年第幾天 + 月相 emoji（`moonInfo`，🌑🌒🌓🌔🌕🌖🌗🌘＋朔/上弦/望…）。
- [x] **底部今日金句**：當日「佳句」(`item.best`)，頁底滿版，呼應 hobonichi 每日一句。
- [x] **右側迷你月曆**：今天高亮（`cur`/`today`）、有內容的日子有金點（`.dot`）、點選跳日；**月份側邊 tab**（1–12，現月高亮，未來月 disabled）。
- [x] **手寫／打字雙模式**（`gx_hobomode`，預設手寫）：✍ 手寫＝`#hbPad` 覆蓋書寫區，五色莫蘭迪筆＋細中粗/橡皮/復原/清除，存 **`gx_hobo:YYYY-MM-DD`**（長詩如木蘭詩 422 字頁面自動長高、canvas 等高不裁切）；⌨ 打字＝`#hbEntry` textarea，**共用 `diary:` 鍵**（與經典「今日心得·隨筆」打字同一份文字，切視圖互通）。
- [x] **整合**：`gx_hobo`（手寫）已併入連續天數、回顧時間軸（🗓 縮圖）、匯出 MD / JSON 備份 / 還原；打字走 `diary:` 故所有日記功能自動涵蓋。
- 驗證：`node --check` 通過、無頭瀏覽器逐項實測（手寫/打字切換、textarea 存讀、跨日跨視圖文字互通、月曆/月tab導覽、長詩等高、切換持久化）全程零 console 錯誤。
- 待精修（可選）：月相改 SVG 灰階（現用 emoji，Windows Segoe 線稿尚可）；節氣/農曆；sw.js 快取版本號（上 Pages 後更新才不會被舊快取卡住，file:// 不受影響）。

## 3. 擴充到 366 篇不重複
- 現況 **40** → 目標 **366**（每類約 52，全年每天不同）。
- 方法：用 `WebFetch` 抓 [zh.wikisource.org](https://zh.wikisource.org) / [ctext.org](https://ctext.org) **逐字查證原文**（禁止憑記憶杜撰），再補 注釋 / 白話 / 賞析 / 作者背景 / 佳句 / 今日一問 六欄。
- **建議重構**：把 `index.html` 內的 `CORPUS` 抽成 `data/corpus.json`（app 改 `fetch`；需 http / Pages），方便分批擴充與校對、降低單檔體積。
- 不重複引擎已支援無限加篇（讀完整章才循環，`pieceFor` 以 `gx_start` 週為起點逐週推進）。
- 可選：排程代理每週自動補 N 篇（查證後）。

## 其他點子
- 月相 / 節氣 / 農曆顯示。
- 主題切換（莫蘭迪 / 宣紙 / 夜間）。
- 朗讀語速 / 語音選擇。
- 雲端同步（目前資料各裝置自存，靠 JSON 備份搬移）。
