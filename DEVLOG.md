# 開發日誌 · DEVLOG

## 2026-06-13 — Session 12：語料庫 42→262（codex 七類擴充）+ 查證抽查 + 上線

由 **codex 在本機接力擴充語料**（只動 `index.html` 的 `CORPUS`，逐字查證 wikisource/ctext），本 session 由 Claude 盤點進度、做查證抽查、commit + push 上線。

### 做了什麼
1. **codex 七類擴充（兩批）**：`aad8bab` 元曲 6→16（+10）；**`f367657`（本次提交）樂府+50、唐詩+80、宋詞+45、古文+25、詩經+10（+210）**。合計 **42→262**。現各類：樂府 56／漢賦 4／唐詩 87／宋詞 52／元曲 16／詩經 17／古文 30。
2. **確立加權選書理念（非平均）**：使用者明示**不要每類 52 平均**——唐詩/樂府/宋詞本為大宗（文化興盛、存世最豐），多多益善不算超標；漢賦本就稀少**定案維持 4 不再補**；詩經/元曲屬小眾不強求補滿。評進度勿再用「每類 52 達標」框架。
3. **查證抽查（鐵則第 1 條把關）**：跨三類抽 8 首，**逐字比對來源 6 首全一致**——蘇轍〈南康直節堂記／黃州師中庵記／洛陽李氏園池詩記／王氏清虛堂記〉（皆 wikisource，連 Google 都難搜的冷門篇竟逐字無誤、作者正確非蘇軾）、〈月出〉（詩經·陳風·ctext）、〈慶東原·泊羅陽驛〉（趙善慶·dugushici）；另〈終南望餘雪／宿桐廬江〉唐詩定本字面正確。**結論：codex 確有逐字查證、無杜撰/改字/作者錯掛/半形標點**。
4. **commit + push 上線**：`f367657` → `origin/main`（`aad8bab..f367657`），Pages 自動部署、`sw.js` network-first → 線上 PWA 約 1–2 分更新。

### 驗證
- 官方 inline-JS `new Function` 語法檢查 **JS OK**；`CORPUS` 物件可完整解析。
- 262 篇 **10 欄位（含 best/notes）全齊**（grep 各欄＝262）；三視圖渲染 `item.best`/`item.notes`/`item.trans`… 不會 undefined。
- **半形逗號/句號混入＝0**（鐵則：全形）。
- 查證如上（8 首，6 首逐字、2 首定本）。

### 現狀（給下個 session 接手）
- ✅ 線上 **262 篇** live；最新 commit **f367657**，`main` 與 origin 乾淨同步、無未提交。
- **加權選書**：要再加厚就補 **元曲 16／詩經 17／古文 30**（使用者邏輯下週五/六/日最有感）；唐詩/樂府/宋詞**別再加**亦無妨、加也不算錯；**漢賦維持 4**。詳見 user memory `meiri-guoxue-corpus-weighting`。
- **續補流程**：開 codex、貼 `docs/expand-prompt.md`，把候選清單換成目標類即可（單一代理、小批；逐字查證；回傳來源網址後再 push）。
- **唯一殘留**：〈折桂令·盧溝曉月〉（鮮于必仁，**上一批 `aad8bab` 已收**）web 搜不到獨立來源做逐字 diff，篇目真實、首句與記憶相符研判正確，要 100% 可查《全元散曲》。

---

## 2026-06-13 — Session 11：四項精修（主題切換 + 月相 SVG + 朗讀設定 + 節氣農曆）

接已上線開源版（commit d0e5177）做四項精修，全在 `index.html` 單檔。

### 做了什麼
1. **外觀主題（莫蘭迪 / 宣紙 / 夜間）**：寫死色抽成 CSS 變數（`--paper0/--surface/--sheet/--ink2/--mixdark/--moon-*`），預設值不變→莫蘭迪像素一致。主題 class 掛在 `<html>`（`html.theme-xuan/.theme-night` 覆寫變數），加 `<head>` 前置 script 依 `gx_theme` 在繪製前先掛 class（**防夜間載入白閃**）。設定面板三鈕，`applyTheme()` 同步 `<meta theme-color>`。**`--seal` 月色不覆寫**＝三主題都照樣每月換色。**關鍵設計：夜間時手帳頁於 `.hobo` 子樹重新宣告莫蘭迪（淺）變數**→計畫頁維持紙感、手寫墨色看得見、原文讀得到（一條 rule 解決，免幾十條覆寫）。手寫畫布 `#diarypad` 固定淺紙不隨主題（墨色永遠可見）。
2. **月相改灰階 SVG**：`moonInfo` 改算真實相位 age/fraction；`moonSVG(age)` 用**多邊形描終止線**（明亮緣半圓＋終止線半橢圓 `rx=r·cos(2π·phase)`，盈右虧左用水平鏡射），避開 SVG 弧線 sweep 旗標歧義。灰階莫蘭迪，lit/dark/edge 用變數隨主題。取代原 emoji。
3. **朗讀語速 / 語音選擇**：兩處 speak handler 併成 `speakText(t)`，讀 `gx_ttsrate`（預設 0.85）/`gx_ttsvoice`。設定加語速滑桿（即時標籤）＋中文語音 select（`getVoices` 過濾 zh/cmn/中文…＋`onvoiceschanged` 補填）＋試聽鈕。
4. **節氣 / 農曆**：手帳日期區塊加「農曆◯月◯ · 節氣」。農曆用 jjonline 通用 `lunarInfo`(1900-2100) 表＋標準 `solar2lunar`（閏月 isLeap 處理）；節氣用壽星公式（2000-2099 準）`currentTerm` 給當前所在／當日交的節氣。

### 驗證（無頭瀏覽器；本環境 screenshot 仍逾時，全靠 computed style + DOM + 演算法 eval）
- **農曆/節氣對權威值**：今日 2026-06-13 → DOM 實渲染 `農曆四月廿八　·　芒種`（對 bmcx/8s8s 萬年曆）；春節 2024/25/26/27 皆落正月初一；1900-01-31 基準＝正月初一；閏 2025=6、2033=11；芒種6/5・夏至6/21・清明4/5・立春2/4 皆符。
- **月相**：8 相 lit% 0→15→50→85→100→85→50→15、盈右虧左（多邊形質心 x 驗）。
- **主題**：三主題切換＋持久化＋meta 色；夜間全域深、`.hobo` 子樹 card `#efeae2`/ink `#4b453e`/sheet `#f4f0e7`（紙感）；莫蘭迪重置回原值像素一致。
- **朗讀**：語速存讀＋標籤即時、6 個中文語音（含 Microsoft Hanhan zh-TW）過濾、選取持久化。
- console 僅 Firebase deprecation warning，零錯誤；inline JS `new Function` 語法檢查過。

### 現狀
- 四項全上，仍單檔。新 localStorage keys：`gx_theme`/`gx_ttsrate`/`gx_ttsvoice` ——屬**裝置偏好**，不在 Firebase 同步清單（`SYNC_KEY`/`SYNC_PREFIX`，line 1810）→各裝置自己的（夜間可只設手機、語音各機不同），正確。
- 待 commit（v3.6）。

---

## 2026-06-13 — Session 10：上線 + 三裝置雲端同步 + 改名 + 開源自架（部署實戰）

把 app 從「本機 + 同步骨架」真正推上線、接通雲端、開源。**全程陪使用者一步步點 GitHub / Firebase 主控台**（非技術使用者，靠截圖來回對照）。

### 做了什麼（時序）
1. **PWA 上線**：陪使用者 repo 改 public（Settings→Danger Zone→Change visibility，最常卡「沒拉到最底」）→ 開 GitHub Pages。**坑**：Pages 的 Branch 預設 `None`＝disabled，要**手動選 `main` /`(root)` 再 Save** 才會 build（不是選 Source 就好）；首次 build 約 1–3 分。網址 **https://bestwish1987-hash.github.io/meiri-guoxue-diary/**（curl 驗 200＋title＋manifest/sw/icon 全 200）。背景用 `run_in_background` 輪詢 curl 直到 200 通知。
2. **Firebase 全套設定**（陪點 console）：建專案 `meiri-guoxue`(Spark 免費) → 加 Web app 拿 `firebaseConfig` → Authentication 啟用 Google（公開名稱設「日日。文學」）→ Settings→Authorized domains 加 `bestwish1987-hash.github.io` → Firestore 建（Standard/Production/asia-east1）→ Rules 貼 `allow read,write: if request.auth.uid==uid` 發布。
3. **接 config + 同步運作**（commit a4def18）：firebaseConfig 填進 module，localhost 先驗 SDK 載入＋按鈕就緒。電腦(https PWA)+Android 都登入「**已同步 ✓ bestwish1987@gmail.com**」。
4. **手機登入修正**（commit 9e633cb）：`signInWithPopup` 在行動裝置常失敗 → `isMobile`（含 **iPad 偽裝 Mac：`maxTouchPoints>1 && /Mac/`**）改 **`signInWithRedirect`+`getRedirectResult`**；桌面維持 popup＋失敗 fallback redirect。手機重開→登入→成功。
5. **改名 日日。文學**（aef318f「日日文學」→ e7d43be 加中點「日日。文學」）：title / h1 / manifest name+short_name；icon 維持「學」印章、seal「日新」不動。
6. **開源自架**（commit 21f66b0）：README 重寫含完整 **self-host 步驟**（fork→開 Pages→建自己的 Firebase→換 config）；**MIT LICENSE**；index.html `firebaseConfig` 上方標註「自架請換成你自己的」。

### 重要決定 / 狀態
- 使用者**選擇不搬舊資料**：file:// 桌面 app 的舊日記留著不動，三台**從現在開始**寫的才共用（要搬：舊版 JSON 匯出 → 線上版 還原）。
- **file:// 桌面捷徑不同步**（Firebase auth 不支援 file:// origin）→ 三台都要用 **https PWA**。桌面可在 Chrome 對線上版按「安裝」變同步的桌面 app（取代舊 file:// 捷徑）。
- 分享策略：一般朋友→傳網址（用使用者的 Firebase，owner 後台看得到，適合熟人、吃免費額度）；要自己掌握/很多人→傳 repo 自架（各自 Firebase，互不相干）。

### 驗證
- 純 config-inert 與接上後都在 localhost preview 驗（按鈕狀態、零 console 錯誤）；live 用 curl 驗 200/title/manifest/config/redirect 字串。**screenshot 工具本環境逾時**，全程靠 curl + preview_eval + 使用者截圖。

### 現狀（給下一個 session 接手）
- ✅ 線上版 live、✅ 三裝置雲端同步 live（電腦+Android 已登入；iPad 還沒接）、✅ repo 已開源(MIT)+自架文件。
- 最新 commit **21f66b0**，`main` 與 origin 乾淨同步，無未推/未提交。
- **iPad 待接**：Safari 開網址→加入主畫面→設定→Google 登入（同帳號）即同步。
- 可選待辦：① 舊資料搬上雲 ② 擴 366 篇 ③ PWA 圖示改名需移除重裝 ④ Tauri .exe（需裝 Rust）⑤ GitHub repo About 加描述/線上版網址/topics ⑥ 量大才需 Firebase 升 Blaze。
- 本機工具（不在 repo）：桌面捷徑「日日。文學」(file:// app)、「日日。文學 · 自動開啟設定」、`auto-open-settings.ps1`(gitignore)。

---

## 2026-06-13 — Session 9：Firebase 雲端同步（三裝置共用）骨架

### 做了什麼
- 需求：Android／iPad／電腦共用同一份資料 → 選 Firebase 雲端同步（Firestore + Google 登入）。
- 設定面板加「雲端同步」區（登入鈕 + 狀態）。新增 `<script type="module">` 同步層（用 gstatic CDN 動態 import firebase 10.13.2 app/auth/firestore）。
- 同步機制：**monkeypatch `localStorage.setItem/removeItem`** → 寫到 Firestore `users/{uid}/kv/{keyToId}`（debounce 1.2s 合併連續寫，省額度）；`onSnapshot` 監聽遠端 → 套回本機 + `window.refresh()`；`initialMerge`（遠端為準 + 本機獨有鍵推上雲）；Google signInWithPopup/signOut。
- **同步哪些**：`diary:` / `gx_canvas:` / `gx_hobo:` 前綴 + `gx_ink/gx_anno/gx_marks/gx_read/gx_start`。裝置本地偏好（font/view/diarymode/hobomode/autobackup/lastbackup）**不同步**（各裝置自己的）。
- **防呆**：`firebaseConfig` 留空 → 整段不啟用、app 照常本機跑；`file://` → 不啟用（Firebase Auth 不支援 file:// origin）→ 提示用網頁版。避免迴圈：套遠端時用 raw set + `applying` 旗標。

### 驗證
- 無頭瀏覽器（config 空）：app 正常、設定顯示「雲端同步（尚未設定）」鈕 disabled、localStorage 未被攔截照常、零 console 錯誤。
- Firebase 實際同步待使用者建專案給 config 後上線測。

### 待使用者做（只有他能做；本機無 gh/firebase CLI）
1. GitHub repo 改 public + 開 Pages（拿 https 網址）。
2. Firebase console 建專案 → 加 Web app 拿 firebaseConfig → 啟用 Google 登入 → 建 Firestore → 貼安全規則(只允許 uid==auth.uid) → Authorized domains 加 Pages 網域。
3. 把 firebaseConfig 給我貼進去 commit。
- **重點**：file:// 桌面版無法登入 → 三台都改用 https PWA 才能共用同一份。firebaseConfig 不是機密(可進公開 repo)，安全靠規則+登入。

### 現狀
- 同步骨架已 push（inert，等 config）。v3.4。
- **v3.5：使用者建好 Firebase 專案 `meiri-guoxue`(Spark免費) → 貼 firebaseConfig 進 module。localhost 實測 Firebase SDK 載入成功、按鈕變「用 Google 登入同步」、零 console 錯誤**。待使用者完成 console 步驟 3-6（Google 登入/Firestore/規則/Authorized domains 加 github.io）後，於 https PWA 登入即同步。apiKey 進公開 repo 安全(靠 Firestore 規則+登入)。

---

## 2026-06-13 — Session 8：自動開啟設定工具（Windows 排程 GUI）

### 做了什麼
- 需求：app 內要能選自動開啟時間 / 關閉。但自動開啟＝Windows 排程，網頁無法控制 → 改用桌面小工具。
- 把既有排程「每日國學日記」的 action 從 `explorer.exe index.html`（瀏覽器分頁）改成 **`chrome.exe --app=<file URI>`（app 視窗）**，時間維持 20:45。
- `auto-open-settings.ps1`：WinForms 小對話框（勾選「每天自動開啟」+ 時間 HH:mm 選擇器 + 儲存/取消）。儲存→啟用則 `Register-ScheduledTask -Force`（daily/Interactive/Limited，免 admin），停用則 `Unregister-ScheduledTask`。路徑用 `$PSScriptRoot`/`[Uri].AbsoluteUri`。
- 桌面＋開始功能表捷徑「每日國學 · 自動開啟設定.lnk」→ `powershell -WindowStyle Hidden -File auto-open-settings.ps1`（**相對檔名＋WorkingDirectory，避免中文路徑在命令列被 ANSI 轉碼**）。

### 驗證
- `[scriptblock]::Create()` 解析通過；Register/Unregister 在拋棄式 task（_TESTTMP）實測：設 07:30→Ready、Unregister→removed。
- **坑**：`.ps1` 用 Write 寫成 UTF-8 無 BOM → Windows PowerShell 5.1 當 ANSI 讀→中文亂碼、parse fail。改用 `[IO.File]::WriteAllText(..., UTF8Encoding($true))` 補 BOM 即正常。
- 註：`.ps1` 為本機工具、加進 `.gitignore` 不上 repo（捷徑 .lnk 在桌面/開始功能表，本就不在 repo）。

### 現狀
- 桌面有兩個捷徑：「每日國學」(開 app)、「每日國學 · 自動開啟設定」(改時間/關閉)。排程已改成開 app 視窗。

---

## 2026-06-13 — Session 7：每週自動備份 + 設定面板 + SW 改 network-first

### 做了什麼
- **設定面板**：模態多一個「設定」分頁（switchTab 改吃三頁 toc/hist/set）。
- **每週自動備份**：`maybeAutoBackup()` 在開 app 時跑——若啟用(預設開)＋有資料＋距上次≥間隔(預設7天)，延遲 1.8s 自動匯出 JSON 到下載資料夾、記 `gx_lastbackup`、跳 toast。設定可開關(`gx_autobackup`)、選間隔週/兩週/月(`gx_backupinterval`)、「立即備份」。expJson 重構成 `buildBackupJson`/`doBackup(auto)` 共用。
- **toast** 輕提示元件（showToast）。
- **sw.js 改 network-first**：版本 bump `guoxue-v2`；導覽(HTML)有網路就拿最新、離線回退快取；其他資源 stale-while-revalidate；CORE 補進 PNG icon。**解掉舊的 cache-first 永遠吃舊版問題（為上 Pages 鋪路）**。
- 自動開啟時間/開關：設定面板裡說明「請用桌面捷徑調整」（Windows 排程，網頁無法直接控制）→ 配套見 Session 8 的桌面工具。

### 驗證
- node --check（sw.js + index inline JS）過。
- 無頭瀏覽器：設定分頁切換、開關/間隔持久化、立即備份設 gx_lastbackup+toast、**開 app 自動備份確實觸發(清掉 lastbackup+有資料→重載後已自動補上日期)**、關閉時不備份(off respected)；零 console 錯誤。
- 註：自動備份用程式觸發 blob 下載，單一檔通常 Chrome 允許；首次可能跳「允許多個下載」一次。

### 現狀
- app 內可控每週自動備份。sw.js network-first。repo 待 commit（v3.2）。

---

## 2026-06-13 — Session 6：製作成 app（本機桌面 app 路線）

### 做了什麼
- **圖示**：Pillow（PIL 12.2）以 `C:\Windows\Fonts\kaiu.ttf`（標楷體）畫「學」印章 → `icon-192.png` / `icon-512.png`（full-bleed 方底，any+maskable 通用）/ `apple-touch-icon.png`(180) / `icon.ico`(多尺寸 16–256)。`<head>` favicon 與 `manifest.webmanifest` icons 都改 PNG（保留 svg 當補充）。
- **本機桌面 app**：偵測預設瀏覽器＝**Chrome**（registry `FileExts\.html\UserChoice`=ChromeHTML），故 launcher 用 Chrome `--app=<file URI>` 開無邊框獨立視窗。建立桌面＋開始功能表捷徑「每日國學.lnk」（WScript.Shell），圖示 `icon.ico`。**用預設 profile（不帶 --user-data-dir）＋同一個 file:// → localStorage 同源，既有日記資料無縫**。
- **驗證**：launch 後列舉視窗，確認出現標題「每日國學日記」的視窗。
- **踩到的坑**：第一版捷徑直接放中文路徑 `file:///D:/每日國學日記/index.html`，命令列被 ANSI 轉碼→Chrome 找不到檔→開成 about:blank。改用 `([Uri]"D:\…\index.html").AbsoluteUri` 轉成 `file:///D:/%E6%AF%8F…/index.html`（純 ASCII %編碼）即正常。同檔→Chrome 正規化後同源，資料續接不受影響。

### 為何選本機路線（vs PWA / Tauri）
- PWA 安裝需 https；repo 是 private，GitHub Pages 私有需 Pro，否則要改 public（使用者決定）。
- Tauri 需 Rust + VS Build Tools（本機無 cargo，約 GB）。
- 本機 Chrome `--app` 捷徑：零安裝、純離線、保住既有資料、立刻就是「app」。PWA/Tauri 列為可選升級。

### 現狀
- 桌面/開始功能表有「每日國學」app 捷徑，雙擊＝無邊框 app 視窗。新增 4 個 icon 檔 + manifest/head 改 PNG。repo 待 commit（v3.1）。

---

## 2026-06-13 — Session 5：每月莫蘭迪主色

### 做了什麼
- 需求：「每個月用不同的莫蘭迪色做區隔」（仿 ほぼ日手帳 每月一色）。
- `MONTH_HUE[12]`＝[hex,色名]：黛藍/藕紫/柳綠/霧粉/苔橄/霧青/赭橘/琥珀/磚紅/霧棕/玫紫/靛灰（冬藍→春綠→夏金→秋赭的莫蘭迪漸變）。
- `applyMonthColor(d)` 用 `documentElement.style.setProperty("--seal", …)` 覆寫主色；在 render / renderHobo / renderBook 開頭依 `current.getMonth()` 套用。因 `--seal` 是全 app 主色變數，印章「日新」、類別徽章、月曆 cur/today、月份 tab、章節標題、佳句框邊、頁底金句等一起換色。`--gold` 不動，當固定搭配。
- 佳句框 `.best/.bk-best`、金句 `.hobo-quote` 的「玫色」底/字本來是寫死 `rgba(160,122,111,…)`，改用 `color-mix(in srgb,var(--seal) X%,…)` 跟著月色；舊瀏覽器不支援 color-mix 時，宣告無效會自動回退到前一條原 rgba 規則（graceful degradation）。
- 手帳日期區塊加 `.hd-hue` 小色票（●＋「霧青 · 6月之色」）；切月加 .4s 過渡。
- **解開未來導覽**（接著的需求「讓後一日可以點、12 個月都到得了」）：三視圖 `$("next").disabled` 改恒 `false`（原本鎖在 ≤今天）；buildHboTab 移除 `target>today` 的 disable → 12 月 tab 全可點；buildHboCal 移除 `cell>today→future`（連同死掉的 `.cal-day.future` CSS）→ 未來日皆可點。今天仍有月曆光環＋「今天」鈕。原「日記不可寫未來」的限制就此放寬（手帳可預寫；連續天數由今日往回算不受影響）。

### 驗證方式
- node --check 通過。
- 無頭瀏覽器：12 個月 `applyMonthColor` 後讀 `--seal` 皆正確；**白字對比 3.58→調整後最低約 3.8–4.8**（原 seal #a07a6f≈3.86 為基準，八月 #9d8456 偏淺→改 #957a4d）；6月(霧青#6a857a)→5月(苔橄#7e875c)翻月即時換色＋色票文字更新；`color-mix` 解析成功（quote bg 出現 `color(srgb …/0.09)`）；經典/書本/手帳三視圖的徽章/印章/佳句框皆套月色；零 console 錯誤。

### 現狀
- 三視圖 + 每月主色。40 篇不變。repo 待 commit（Session 3-5 = v3）。

---

## 2026-06-13 — Session 4：手帳頁併入全文內容＋整片可手寫

### 做了什麼
- 需求：「內容跟手帳放在一起，要（處處）皆可手寫」。原本手帳書寫區只有 類別/朝代作者/原文，現把 **白話翻譯／注釋／賞析／作者與背景／今日一問** 也鋪進 `.hobo-piece`（全部 `pointer-events:none`）。
- 手寫畫布 `#hbPad`（絕對定位 `inset:0`、z-index:2、pointer-events:auto）本就覆蓋整個 `.hobo-zone`；內容變多→zone 變高→`sizeHbPad` 把 canvas 撐到 `zone.clientHeight`，於是**整片內容都被畫布蓋住＝處處可手寫**（在印好的原文/賞析/任一段上批註）。
- 內容字級刻意維持固定（不吃 `--fs`），避免 A−/A+ 後內容高度變動、與既存手寫筆跡錯位。
- 打字模式 `#hbEntry` 接在全文下方（讀完再打字）。
- `renderHobo` 多填 hbTrans/hbNotes/hbAppr/hbBio/hbReflect；新增 CSS `.hp-extra/.hp-sec-h/.hp-sec/.hp-reflect`。

### 驗證方式
- node --check 通過。
- 無頭瀏覽器：五段內容皆填入；canvas 高(926)==zone 高(926)>=內容高(900) 全覆蓋；canvas z-index2/pointer-events auto、piece pointer-events none；以 PointerEvent 在「賞析」區(y=627)與「原文」區實畫一筆都寫得進去並存 gx_hobo；打字模式 textarea 在全文下方、內容仍可見；零 console 錯誤。

### 現狀
- 手帳頁＝完整國學全文鋪在點陣紙上＋整片可手寫批註/打字。三視圖、40 篇不變。repo 待 commit（連同 Session 3 書本一起 = v3）。

---

## 2026-06-13 — Session 3：書本攤開版面（第三視圖）

### 做了什麼
1. **第三個切換鈕**「📖 經典 / 📚 書本 / 🗓 手帳」：`gx_view` 新增值 `book`，`body.bookview` 切主題；`applyView`/`refresh` 加 book 分支，`setView(v)` 收斂三鈕邏輯。
2. **兩頁攤開** `#bookPage`：CSS Grid `1fr 1fr` 兩頁等寬，中央 `::before` 書脊漸層、左右頁內側摺痕漸層（`linear-gradient` 往書脊變深），grid stretch 使兩頁等高如真開卷。
3. **renderBook**：左頁＝類別/節選/☆書籤/朝代作者/標題/原文/佳句/🔊朗讀；右頁＝作者與背景＋賞析；下方 book-extra 放注釋／白話／今日一問（維持可摺疊）。書本模式 `.diary` 照常顯示（可寫今日心得）；只取代 `.card`。
4. **書籤 `#bkStar`**（共用 gx_marks）、朗讀 `#bkSpeak`（共用 viewItem.text）；字級 `--fs` 用 calc 對書本生效。
5. **響應式**：≤640px → `grid-template-columns:1fr` 兩頁上下堆疊、書脊隱藏。

### 驗證方式
- node --check 通過。
- 無頭瀏覽器 `preview_eval`：兩頁幾何（720 = 359+359 等寬、同 top、無縫）、木蘭詩 422 字兩頁等高 1635 不溢出、書籤存讀、prev/today/next 導覽、經典/書本/手帳三視圖 display 互斥正確、手機 375px 堆疊+書脊隱藏；零 console 錯誤。
- **踩到的坑**：`.book` 既是區塊 class 又拿來當 body class（`body.book`），`.book{display:none}` 連 `<body>` 一起 display:none → 整頁 0 寬。幾何量測（htmlW=1280 但 bodyW=0、bodyDisplay=none）抓到；body class 改 `bookview`（比照 hobo 的 `.hobo`/`hobonichi` 不同名）即解。（提醒：screenshot 在本環境逾時，全靠幾何/功能量測，這種「整頁被隱藏」靠截圖反而可能誤判。）

### 現狀
- 三視圖：經典（單欄漸進）／書本（兩頁攤開）／手帳（一日一頁）。40 篇不變。repo 待 commit（v3）。

---

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
`gx_start`｜`diary:YYYY-MM-DD`(打字)｜`gx_canvas:YYYY-MM-DD`(隨筆畫布)｜`gx_hobo:YYYY-MM-DD`(手帳頁手寫，Session 2)｜`gx_diarymode`｜`gx_hobomode`(手帳手寫/打字，Session 2)｜`gx_view`(經典/書本/手帳，Session 2-3)｜`gx_read`/`gx_marks`(篇id)｜`gx_anno`(劃線批註,依篇)｜`gx_ink`(詩上手寫,依篇)｜`gx_font`

### 原則
- **原文一律查證、禁憑記憶杜撰**（用字、作者、出處錯了就失去意義）。
- 資料各裝置自存，換機靠 JSON 備份/還原。
