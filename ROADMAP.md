# Roadmap

## 1. 變成 app
- [x] 單檔離線 HTML
- [x] PWA：`manifest.webmanifest` + `sw.js`（app shell 離線快取）+ `index.html` 已註冊 Service Worker
- [x] **PNG / ICO icon**（`icon-192.png` / `icon-512.png` any+maskable / `apple-touch-icon.png` / `icon.ico`）— Pillow 以標楷體 kaiu.ttf 畫「學」印章，manifest 與 `<head>` favicon 都已換 PNG。
- [x] **本機桌面 app（Session 6 已做，預設路線）**：桌面＋開始功能表捷徑「每日國學.lnk」→ `chrome --app=file:///…/index.html`（無邊框獨立視窗）。**用預設瀏覽器 Chrome＋預設 profile，file:// 同源 → 既有日記資料無縫接續**；圖示用 `icon.ico`。**坑**：中文路徑要用 `[Uri].AbsoluteUri` 轉成 %編碼，直接放原字會在命令列被 ANSI 轉碼→載到 about:blank。
- [ ] （可選 A）**裝成 PWA / 手機也能用**：部署 GitHub Pages 取 https → 瀏覽器「安裝應用程式」。**需把 repo 改 public（或 GitHub Pro 才有私有 Pages）**＋修 `sw.js` 快取版本號（避免舊快取卡更新，見 2.x 註）。
- [ ] （可選 B，進階）**打包真正 `.exe`**：[Tauri](https://tauri.app)。**本機尚無 Rust/cargo，需先裝 Rust + VS Build Tools（約 GB）**。
- [ ] （可選）把每晚 20:45 排程從 explorer 開檔改為開「每日國學.lnk」app 視窗。

## 2. Hobonichi 風版面（參考 ほぼ日手帳 一日一頁）✅ 已完成（Session 2）
頂部「📖 經典 / 🗓 手帳」切換鈕（`gx_view`），`body.hobonichi` 切換主題，手帳頁為自成一頁的 `#hoboPage`。
- [x] **點陣紙背景**：`radial-gradient` 18px 點陣，莫蘭迪 `#f4f0e7`。
- [x] **左側時間軸**：06/09/12/15/18/21/00/03（flex `space-between` 隨頁高分布）。
- [x] **角落日期區塊**：大日 + `JUN` + `SAT · 週六` + 一年第幾天 + 月相 emoji（`moonInfo`，🌑🌒🌓🌔🌕🌖🌗🌘＋朔/上弦/望…）。
- [x] **底部今日金句**：當日「佳句」(`item.best`)，頁底滿版，呼應 hobonichi 每日一句。
- [x] **右側迷你月曆**：今天高亮（`cur`/`today`）、有內容的日子有金點（`.dot`）、點選跳日；**月份側邊 tab**（1–12，現月高亮，未來月 disabled）。
- [x] **全文內容上頁（Session 4）**：手帳書寫區 `.hobo-piece` 除原文外，再鋪上 白話翻譯／注釋／賞析／作者與背景／今日一問（皆 `pointer-events:none`、固定字級不受 A−/A+ 影響以免與手寫錯位）。整片內容＝可手寫範圍。
- [x] **手寫／打字雙模式**（`gx_hobomode`，預設手寫）：✍ 手寫＝`#hbPad` 絕對定位覆蓋**整片內容**（canvas 等高於 zone，內容多高就蓋多高），可在原文/賞析/任一段文字上直接批註；五色莫蘭迪筆＋細中粗/橡皮/復原/清除，存 **`gx_hobo:YYYY-MM-DD`**（長詩如木蘭詩頁面自動長高、canvas 等高不裁切）；⌨ 打字＝`#hbEntry` textarea 接在全文下方，**共用 `diary:` 鍵**（與經典「今日心得·隨筆」打字同一份文字，切視圖互通）。
- [x] **整合**：`gx_hobo`（手寫）已併入連續天數、回顧時間軸（🗓 縮圖）、匯出 MD / JSON 備份 / 還原；打字走 `diary:` 故所有日記功能自動涵蓋。
- 驗證：`node --check` 通過、無頭瀏覽器逐項實測（手寫/打字切換、textarea 存讀、跨日跨視圖文字互通、月曆/月tab導覽、長詩等高、切換持久化）全程零 console 錯誤。
- 待精修（可選）：月相改 SVG 灰階（現用 emoji，Windows Segoe 線稿尚可）；節氣/農曆；sw.js 快取版本號（上 Pages 後更新才不會被舊快取卡住，file:// 不受影響）。

## 2.5 書本攤開版面 ✅ 已完成（Session 3）
第三個切換鈕「📖 經典 / 📚 書本 / 🗓 手帳」（`gx_view` 多一個值 `book`，`body.bookview`）。書本＝兩頁攤開的開卷閱讀。
- [x] **兩頁攤開**：CSS Grid `1fr 1fr`，中央書脊漸層 `::before`、左右頁內側摺痕漸層，等高（grid stretch）。
- [x] **左頁**：類別 + 節選標 + ☆書籤 + 朝代作者 + 標題 + 原文 + 佳句 + 🔊朗讀（`renderBook`）。
- [x] **右頁**：作者與背景 + 賞析。
- [x] **下方**：注釋／白話／今日一問維持可摺疊；今日心得隨筆（日記）照常顯示，書本模式也能寫。
- [x] **響應式**：≤640px 兩頁改上下堆疊、書脊隱藏。字級 A−/A+（`--fs`）對書本生效。
- 注意：`.book` 同時當區塊 class 與 body class 會撞（`.book{display:none}` 連 body 一起隱藏）→ body 改用 `bookview`（比照 hobo 的 `.hobo`/`hobonichi`）。
- 驗證：node --check + 無頭瀏覽器（兩頁等寬無縫 720=359+359、木蘭詩 422 字兩頁等高 1635 不溢出、書籤、導覽、三視圖互換、手機堆疊）零 console 錯誤。

## 2.6 每月莫蘭迪主色 ✅ 已完成（Session 5）
仿 ほぼ日手帳「每月一色」：12 個月各一個莫蘭迪色，翻到該月即覆寫 `--seal`，全 app 主色一起換做區隔（`--gold` 維持不變當固定搭配）。
- [x] `MONTH_HUE`（hex＋色名）：冬藍春綠夏金秋赭 — 黛藍/藕紫/柳綠/霧粉/苔橄/霧青/赭橘/琥珀/磚紅/霧棕/玫紫/靛灰。
- [x] `applyMonthColor(date)` 在 render/renderHobo/renderBook 開頭依 `current` 月份覆寫 `--seal` → 印章「日新」、類別徽章、月曆高亮、月份 tab、章節標題、佳句框、頁底金句全跟著走（三視圖皆然）。
- [x] 佳句／金句框背景與文字用 `color-mix(in srgb,var(--seal) X%,…)` 跟著月色（不支援 color-mix 的舊瀏覽器自動回退原玫色 rgba）。
- [x] 手帳日期區塊加「色名 · N月之色」小色票（`.hd-hue`）；切月有 .4s 淡入過渡。
- [x] **解開未來導覽**（為了看遍 12 個月的色）：「後一日 ▶」不再鎖在今天（三視圖 `$("next").disabled=false`）、手帳月份 tab 12 個全可點、迷你月曆未來日期也可點。今天仍以月曆光環標記、「今天」鈕一鍵回到今日。副作用：手帳本就是手帳，可前往未來日先寫計畫（連續天數仍由今日往回算，不受影響）。
- 驗證：12 色白字對比 3.6–4.8（≈ 原 seal #a07a6f 的 3.86，八月調深至 #957a4d）；6月→5月翻月即時換色；color-mix 解析成功；三視圖徽章/印章/佳句皆套色；後一日/月tab/月曆未來皆可點、跨年（12/31→次年 1/1）續走並換色；零 console 錯誤。

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
