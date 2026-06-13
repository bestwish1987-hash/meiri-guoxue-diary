# 日日。文學 · Daily Literature

每天一篇中國古典文學的**閱讀 ＋ 手帳日記** PWA。離線可用、可多裝置雲端同步、單檔無框架。

🔗 **直接用（線上版）**：<https://bestwish1987-hash.github.io/meiri-guoxue-diary/>
（手機／平板用瀏覽器開 → 「加入主畫面 / 安裝應用程式」就變成 app。）

> 每天依星期推一篇（樂府詩・漢賦・唐詩・宋詞・元曲・詩經・古文觀止），含原文／注釋／白話／賞析／作者背景／今日一問。原文以 [zh.wikisource.org](https://zh.wikisource.org) 等逐字查證，不憑記憶杜撰；收錄之古典文學為**公有領域**。

## 功能
- **三種版面**：📖 經典（單欄漸進）/ 📚 書本（兩頁攤開，左原文右賞析）/ 🗓 手帳（一日一頁：點陣紙＋時間軸＋迷你月曆＋月相＋全文鋪頁可整片手寫批註）
- **每月一色**：12 個月各一個莫蘭迪主色，翻月全 app 換色
- **不重複引擎**：依星期輪類別，從「開始週」逐週推進，讀完整輪才循環
- 劃線批註、詩上手寫、隨筆畫布／打字、書籤、字級、朗讀
- **每週自動備份**（JSON）、匯出 Markdown／JSON、還原
- **雲端同步**（選用，Firebase）：Google 登入，多裝置共用同一份
- **純本機也完全可用**（不登入＝資料只在這台）

## 自己架一份（self-host）
開源專案，歡迎 fork 一份、用**自己的** Firebase —— 資料完全在你自己手上，不經過任何人。

### 1. Fork ＋ 開 GitHub Pages
1. 右上角 **Fork** 這個 repo。
2. 你的 fork → **Settings → Pages → Source：Deploy from a branch → `main` / `(root)` → Save**。
3. 等 1～2 分鐘 → 你的網址：`https://你的帳號.github.io/你的repo名/`
   到這裡 app 就能用了（**純本機、單裝置**，還沒雲端同步）。

### 2.（選用）開自己的雲端同步
要多裝置同步才需要這步，用**免費**的 Firebase：
1. [console.firebase.google.com](https://console.firebase.google.com) → 建立專案（免費 Spark 方案）。
2. 加一個 **Web app**（`</>`）→ 複製它給你的 `firebaseConfig`。
3. **Authentication → Sign-in method → 啟用 Google**。
4. **Authentication → Settings → Authorized domains → 新增** `你的帳號.github.io`。
5. **Firestore Database → 建立（Production mode）→ Rules** 分頁貼下面這段 → **發布**：
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{doc=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
6. 打開 `index.html`，找到 `const firebaseConfig = { … }`，**換成你自己那段** → commit。
7. 完成。每台裝置開你的網址 → **設定 → 用 Google 登入同步**（同一帳號）。

> `firebaseConfig` **不是機密**，放在公開程式碼是正常的；安全靠上面的 Firestore 規則＋登入 —— **只有本人能讀寫自己的資料**，別人（含看到原始碼的人）都進不來。

## 在本機跑
- 直接雙擊 `index.html`（離線可用；但 PWA／雲端同步需要 http/https，`file://` 不支援登入）。
- 或起個本機伺服器：
  ```
  python -m http.server 8731   # 開 http://localhost:8731
  ```

## 技術
- 單一 `index.html`（HTML / CSS / 原生 JS，**無框架、無建置**）。
- 資料存瀏覽器 **localStorage**；雲端同步以 `<script type="module">` 把 localStorage 寫入鏡像到 Firestore（`users/{uid}/kv`），`onSnapshot` 即時套回。
- PWA：`manifest.webmanifest` + `sw.js`（導覽 network-first，離線回退快取）。

### localStorage keys
| key | 內容 | 同步 |
|---|---|:--:|
| `gx_start` | 開始週（不重複序列起點） | ✓ |
| `diary:YYYY-MM-DD` | 當日打字 | ✓ |
| `gx_canvas:` / `gx_hobo:` | 當日隨筆畫布 / 手帳頁手寫（PNG） | ✓ |
| `gx_ink` / `gx_anno` | 詩上手寫 / 劃線批註（依篇） | ✓ |
| `gx_read` / `gx_marks` | 已讀 / 書籤 | ✓ |
| `gx_view` `gx_diarymode` `gx_hobomode` `gx_font` | 版面／模式／字級偏好 | ✗（各裝置自己的） |
| `gx_autobackup` `gx_backupinterval` `gx_lastbackup` | 自動備份設定 | ✗ |

## 篇目
目前 **40 篇**（樂府6・漢賦4・唐詩7・宋詞7・元曲4・詩經7・古文5）。目標 **366 篇**（全年每天不重複），擴充方式見 [ROADMAP.md](ROADMAP.md)。

## 授權
程式碼採 **MIT**（見 [LICENSE](LICENSE)）—— 可自由使用、修改、再散布。收錄之古典文學原文為公有領域。

---
🤖 與 [Claude Code](https://claude.com/claude-code) 共同開發。
