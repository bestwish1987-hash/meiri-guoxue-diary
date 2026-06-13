# AGENTS.md — 日日。文學（每日古典文學日記 PWA）

> 給 AI 編碼代理（Codex / Claude Code 等）與協作者的操作指南。**動工前先讀本檔，再讀 `DEVLOG.md`、`ROADMAP.md`。**

## 專案是什麼
- 單檔離線 PWA：**所有程式都在 `index.html` 一支檔案**（HTML + CSS + inline JS）。無 build、無框架、無 npm。
- 每天推一篇古典文學，七類按星期輪播；漸進式賞析 ＋ 日記（打字／手寫畫布）＋ 三視圖（經典／書本／手帳）。
- 線上：<https://bestwish1987-hash.github.io/meiri-guoxue-diary/>
- repo：`bestwish1987-hash/meiri-guoxue-diary`（公開；**直接 commit 到 `main`**，push 後 GitHub Pages 自動部署）。
- 雲端同步：Firebase（Google 登入 + Firestore），程式在檔尾 `<script type="module">`。`firebaseConfig` 非機密、可公開（安全靠 Firestore 規則 + 登入）。

## 鐵則（務必遵守）
1. **原文一律逐字查證，禁憑記憶杜撰。** 新增任何篇目，原文必須用 WebFetch 從 zh.wikisource.org（維基文庫）或 ctext.org 抓取、逐字照抄，並核對作者／朝代；查不到可靠來源就**不要加**。用字／作者／出處錯了，這個 app 就失去意義。
2. **維持單檔內嵌。** CORPUS 留在 `index.html`，**不要**抽成外部 `corpus.json`（改 fetch 會讓 `file://` 桌面版壞掉）。
3. **繁體中文、標點全形**（，。：；「」〈〉《》——）。
4. 改完務必驗證（見下）。`main` 可直接 commit，但**破壞性或對外動作（push / 改 repo 設定等）先跟使用者確認**。

## CORPUS 結構
`index.html` 內 `const CORPUS = { 類key:{label:"…",items:[ … ]} }`。七類 key 對應星期（見 `WEEKDAY_MAP`）：

| 星期 | key | label |
|---|---|---|
| 一 | `yuefu` | 樂府詩 |
| 二 | `hanfu` | 漢賦 |
| 三 | `tangshi` | 唐詩 |
| 四 | `songci` | 宋詞 |
| 五 | `yuanqu` | 元曲 |
| 六 | `shijing` | 詩經 |
| 日 | `guwen` | 古文觀止 |

每個 item 欄位（全部繁中）：

```js
{title:"曲牌·題", dynasty:"元", author:"…",
 text:"原文…\n逐句換行",      // 查證後原文，\n 分句
 best:"…",                     // 佳句，須為 text 中實際出現的一整句
 notes:"…",                    // 注釋：曲牌／難字／典故
 trans:"…",                    // 白話翻譯
 appr:"…",                     // 賞析 3–5 句
 bio:"…",                      // 作者與背景 2–3 句
 reflect:"…"}                  // 今日一問：溫暖、扣回日常的一句提問
```

長篇（如漢賦）用節選，可加 `excerpt:true`（顯示「節選」標）。

**不重複引擎**（`pieceFor`）：以使用者 `gx_start` 那週為起點，**逐週順序**取該類第 N 首，讀完整類才循環。故**每類約 52 首**才能整年（366 天）不重複。

## 現況（2026-06，Session 11）
篇數 **42**：樂府 6／漢賦 4／唐詩 7／宋詞 7／**元曲 6**／詩經 7／古文 5。
主題（莫蘭迪／宣紙／夜間）、灰階月相 SVG、朗讀語速＋語音、手帳農曆＋節氣 皆已上線。

## 366 篇擴充（進行中）
目標每類 ~52。流程：**選目 → 查證 wikisource/ctext 撰六欄 → 第二代理逐字校對 → 合併進 index.html**。
- **教訓：一次跑太多代理會撞 session 用量上限、大半做白工（曾 288 萬 token 只換 2 首）。請小批，每批 10–12 首。**
- 多代理產出請回傳 JSON，由主流程**集中**寫進 `index.html`（避免並行改同一檔衝突）。
- 撰寫 prompt 記得要求「標點全形」（曾出現混入半形逗號需手動修）。
- 合併位置：各類 `items:[ … ]` 末尾，最後一首加逗號後接新項，維持縮排。

### 元曲候選清單（curator 已選，**需逐一查證；查不到就換掉**）
蟾宮曲·問人間誰是英雄、折桂令·盧溝曉月、折桂令·西陵送別、普天樂·辭參議還家、水仙子·詠江南、慶東原·泊羅陽驛、小桃紅·江岸水燈、小桃紅·客船晚煙、四塊玉·馬嵬坡、乾荷葉·乾荷葉色蒼蒼、折桂令·歎世、喜春來·春宴、凌波仙·吊關漢卿、壽陽曲·瀟湘夜雨、山坡羊·燕城述懷、天淨沙·春、大德歌·秋、山坡羊·驪山懷古、壽陽曲·遠浦帆歸、折桂令·中秋、沉醉東風·漁夫、沉醉東風·秋景、四塊玉·閒適（其四）、節節高·題洞庭鹿角廟壁、沉醉東風·送別、撥不斷·歎世、四塊玉·恬退、憑闌人·寄征衣、折桂令·春情、壽陽曲·別朱簾秀、清江引·相思、鸚鵡曲·儂家鸚鵡洲邊住、折桂令·箕山感懷、陽春曲（題待確認）、塞鴻秋·代人作、紅繡鞋·歡情、人月圓·山中書事、清江引·棄微名去來心快哉、水仙子·夜雨、清江引·秋懷、折桂令·九日、賣花聲·懷古、陽春曲·皇亭晚泊、山坡羊·述懷、醉中天·詠大蝴蝶、水仙子·尋梅、寄生草·感嘆、清江引·野興（其八）、賣花聲·悟世、塞鴻秋·潯陽即景

**已收錄、勿重複**：天淨沙·秋思、山坡羊·潼關懷古、天淨沙·秋、四塊玉·別情、滿庭芳·漁父詞（秋江暮景）、罵玉郎過感皇恩採茶歌·閨中聞杜鵑

## localStorage keys
- 書寫資料：`diary:<date>`（打字）、`gx_canvas:<date>`（隨筆畫布）、`gx_hobo:<date>`（手帳手寫）、`gx_ink`（詩上手寫，依篇）、`gx_anno`（劃線批註，依篇）。
- 進度／偏好：`gx_read`、`gx_marks`、`gx_start`、`gx_font`、`gx_view`、`gx_diarymode`、`gx_hobomode`、`gx_theme`、`gx_ttsrate`、`gx_ttsvoice`、`gx_autobackup`、`gx_backupinterval`、`gx_lastbackup`。
- **Firebase 只同步**：`SYNC_PREFIX`（`diary:` / `gx_canvas:` / `gx_hobo:`）＋ `SYNC_KEY`（`gx_ink` / `gx_anno` / `gx_marks` / `gx_read` / `gx_start`）。其餘（主題／語音／字級／視圖…）各裝置本地、不同步。

## 主題
3 主題（`gx_theme`: morandi / xuan / night）。主題 class 掛在 `<html>`（`html.theme-xuan` / `html.theme-night` 覆寫 CSS 變數）；`<head>` 有前置 script 依 `gx_theme` 在繪製前掛 class（防白閃）。`--seal` 是「每月主色」，**不被主題覆寫**。**夜間時手帳頁（`.hobo` 子樹）重新宣告淺色變數** → 計畫頁維持紙感、手寫墨色才看得見。新增寫死顏色時請改用 CSS 變數，否則夜間／宣紙會出現白塊或暗對暗。

## 驗證（每次改完都做）
- **語法**（JS 內嵌於 HTML，抽出檢查）：
  ```bash
  node -e "const h=require('fs').readFileSync('index.html','utf8');const re=/<script>([\s\S]*?)<\/script>/g;let m;while((m=re.exec(h)))new Function(m[1]);console.log('JS OK')"
  ```
- **瀏覽器**：起任一靜態 http server 開 `index.html`，看 console 無錯誤、篇目正常輪播、三視圖切換正常。（`file://` 也能跑，但 ES module 的 Firebase 與 fetch 會受限。）
- **農曆／節氣**：相關改動要對權威萬年曆（bmcx / 8s8s）核對。
- 註：某些無頭環境 `screenshot` 會逾時 → 改讀 DOM／computed style 驗。

## 更多
- `DEVLOG.md`：逐 Session 做了什麼、踩過的坑（強烈建議讀）。
- `ROADMAP.md`：路線圖與待辦。
