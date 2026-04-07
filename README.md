# 靈魂訊息卡牌 (Spiritual Message Cards) 

這是一個結合抽卡與 AI 解讀的靈性指引網站。

## 部署到 GitHub Pages 的步驟

為了讓這個專案能夠順利在 GitHub Pages 上運行，請按照以下步驟設定您的 GitHub 儲存庫：

### 1. 建立 GitHub 儲存庫並上傳程式碼
1. 在 GitHub 上建立一個新的 Repository (儲存庫)。
2. 將這份程式碼推送到該儲存庫的 `main` 分支。

### 2. 設定 GitHub Secrets (安全存放 API Key)
因為我們使用了 OpenRouter 的 AI 服務，您需要將 API Key 設定在 GitHub Secrets 中，這樣 GitHub Actions 在打包網站時才能正確讀取到它。

1. 進入您的 GitHub 儲存庫頁面。
2. 點擊上方的 **Settings** (設定) 標籤。
3. 在左側選單中找到 **Secrets and variables**，點開後選擇 **Actions**。
4. 點擊綠色的 **New repository secret** 按鈕。
5. **Name** (名稱) 填入：`OPENROUTER_API_KEY`
6. **Secret** (內容) 填入：您的 OpenRouter API Key (例如 `sk-or-v1-...`)
7. 點擊 **Add secret** 儲存。

### 3. 開啟 GitHub Pages 與 Actions 權限
1. 在 **Settings** 頁面，左側選單找到 **Pages**。
2. 在 **Build and deployment** 區塊的 **Source**，選擇 **GitHub Actions**。
3. (可選) 確保您的 GitHub Actions 權限允許執行 workflow (通常預設是開啟的)。

### 4. 觸發部署
完成上述設定後，只要您將程式碼推送到 `main` 分支，GitHub Actions 就會自動開始打包並部署您的網站。
您可以在儲存庫上方的 **Actions** 標籤頁中查看部署進度。部署完成後，GitHub 會提供一個網址給您 (通常是 `https://您的帳號.github.io/您的儲存庫名稱/`)。

---

**⚠️ 安全性提醒**
這個專案是純前端 (Client-side) 架構。當網站打包並部署到 GitHub Pages 後，您的 `OPENROUTER_API_KEY` 會被包含在前端程式碼中。
這意味著任何熟悉網頁開發工具的人都可以找到這把 Key。
* 建議您在 OpenRouter 後台為這把 Key **設定額度上限 (Credit Limit)**。
* 如果您希望完全隱藏 API Key，未來需要將架構改為包含後端伺服器 (Full-stack) 的形式。
