# Roadmap

## 1. 變成 app
- [x] 單檔離線 HTML
- [x] PWA：`manifest.webmanifest` + `sw.js`（app shell 離線快取）+ `index.html` 已註冊 Service Worker
- [ ] PNG icon（192 / 512 / maskable）；目前先用 `icon.svg`
- [ ] 部署 GitHub Pages（Settings → Pages → Branch: main / root）→ 取得 https 網址
- [ ] 瀏覽器「安裝應用程式」→ 釘到桌面 / 手機主畫面（standalone）
- [ ] （進階）改 [Tauri](https://tauri.app) 打包成真正的桌面 `.exe`

## 2. Hobonichi 風版面（參考 ほぼ日手帳 一日一頁）
把「今日」頁做成像手帳的一天一頁，國學內容與手帳格線並存。
- **背景**：淡點陣 / 方格（grid dots），莫蘭迪淺灰；`background-image: radial-gradient` 或 `repeating-linear-gradient`。
- **左側時間軸**：6 / 9 / 12 / 15 / 18 / 21 / 0 / 3 縱向刻度（可當待辦時段）。
- **角落日期區塊**：月 日 週幾 + 月相 ◐ + 一年第幾天（像參考圖左上的 `APR 19 SAT`）。
- **底部今日金句**：放當日「佳句」或「今日一問」（呼應 hobonichi 每日一句）。
- **右側迷你月曆**：本月日期、今天高亮；月份側邊標籤（tab）。
- **版面**：上半國學閱讀（卡片），下半手帳格線 + 隨筆自由畫布；可加「經典 / 手帳」版面切換鈕。
- 實作建議：新增 `body.hobonichi` 主題，CSS Grid 排兩欄（時間軸 | 內容），日期/月曆用既有 `pieceFor`/日期函式。

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
