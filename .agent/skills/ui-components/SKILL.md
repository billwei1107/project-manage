---
name: Project UI Components System
description: "指導如何將 Figma 產出的 Tailwind CSS 設計規範與組件轉換為本專案所使用的 Material-UI (MUI) 系統組件"
---

# UI Components Design System & MUI Mapping

這份 Skill 記錄了本專案的核心 UI 設計規範，基於 Figma 中的 [UI Components] 設計稿所萃取。
開發本專案的介面時，**不應安裝 Tailwind CSS**，而必須將設計轉換為 Material-UI (MUI) `<Box sx={{ ... }}>` 與相關組件的寫法。

## 1. 顏色與全域變數 (Colors & Global Variables)
- **Primary Blue (主色)**
  - 預設 (Enabled): `#3F8CFF`
  - 懸停 (Hover): `#3A81EB`
  - 點擊/啟用 (Active/Pressed): `#1F6DE0`
  - 淺色底框 (如 Input 啟用狀態/標籤底色): `rgba(63, 140, 255, 0.12)`
- **Neutral (中性色 / 背景 / 文字)**
  - 網頁/畫布底色 (Canvas BG): `#F4F9FD`
  - 純白卡片底色 (Card BG): `#FFFFFF`
  - 標題/主要文字 (Dark Text): `#0A1629`
  - 次要提示文字 (Gray Text): `#7D8592`
  - 禁用狀態 (Disabled/Inactive): 底色 `#CED5E0`, 文字 `#B2B8C2`
  - 分隔線與灰色卡片底: `#E6EBF5` 或 `#F4F9FD`
- **系統回饋色 (Status Colors)**
  - 成功/完成 (Done/Approved): `#00D097` (搭配背景 `rgba(0, 208, 151, 0.12)`)
  - 警告/待處理 (Pending): `#FDC748`
  - 錯誤 (Error): `#F65160`
  - 特定狀態 (In Review): `#C418E6`

---

## 2. 字型設定 (Typography)
主要採用 **Nunito Sans** 字型，並根據不同大小搭配以下粗細。
如 Figma 程式碼標記為 `font-['Avenir:Heavy',sans-serif]` 或類似內容，也可統一映射為本專案使用的字型族 (主要為 `Nunito Sans`)。
- **H1 Titile:** `fontWeight: 700`, `fontSize: 36px`, `color: '#0A1629'`
- **H2 Subtitle:** `fontWeight: 700`, `fontSize: 22px`, `color: '#0A1629'`
- **Button Text:** `fontWeight: 700`, `fontSize: 16px`
- **Body Regular:** `fontWeight: 400`, `fontSize: 14px/16px`
- **Small Label:** `fontWeight: 600/700`, `fontSize: 12px`

---

## 3. 按鈕組件 (Buttons)
所有主要按鈕皆為圓角。
在 MUI 實作時，可使用 `<Box onClick={...} sx={{...}}>` 包覆文字與圖示。

### Main Button (主要按鈕)
- **Enabled (預設)**: 
  - `bgcolor: '#3F8CFF'`, `color: 'white'`
  - `borderRadius: '14px'`
  - 陰影: `boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)'`
  - `height: 48px`, 內距左右自適應。
- **Hover (懸停)**: `bgcolor: '#3A81EB'`
- **Pressed (按下)**: `bgcolor: '#1F6DE0'`
- **Disabled (禁用)**: `bgcolor: '#CED5E0'`, 無陰影, 文字 `#B2B8C2`

### Text Button (文字按鈕 - 例如 View All)
- **預設**: `color: '#3F8CFF'`, `fontWeight: 600` (SemiBold)
- **Hover**: 右側箭頭外可搭配底線指示器 (`bgcolor: '#3F8CFF'`, `height: 1px`)
- **Disabled**: `color: '#B2B8C2'`

---

## 4. 陰影與卡片容器 (Cards & Shadows)
專案裡大量使用飄浮感的白色卡片。
- **大版面容器 (Main Card)**:
  - `bgcolor: 'white'`
  - `borderRadius: '24px'`
  - **主要陰影**: `boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)'`
- **副版面容器 (Gray Card / Area)**:
  - `bgcolor: '#F4F9FD'`
  - `borderRadius: '24px'`

---

## 5. 輸入框模組 (Inputs)
使用 `<Box>` 模擬 Input 的邊框，或是透傳給 `<TextField>` 的 sx：
- **Inactive (未選中)**: `border: '1px solid #D8E0F0'`, `borderRadius: '14px'`, 淺陰影。
- **Active (選中)**: `border: '1px solid #3F8CFF'`, 背景疊加一層淺色 `rgba(63,140,255,0.12)` 作為選中強調。
- **Error (錯誤)**: `border: '1px solid #F65160'`，並在最下方顯示紅色 `Incorrect data` (#F65160) 提示。
- **Disabled**: `border: '1px solid #CED5E0'`, 內文字體為灰色 (#B2B8C2)。

---

## 6. 其他關鍵元件 (Controls, Chips & Statuses)

### 開關與控制 (Switches & Segments)
- **Switches**: 
  - On: `bgcolor: '#3F8CFF'`, 寬 `51px`, 高 `31px`, 圓球大小 `23px` (置右)。
  - Off: `bgcolor: '#CED5E0'`, 圓球大小 `23px` (置左)。
- **Segmented Control (切換分頁標籤)**:
  - 背景容器: `bgcolor: '#E6EDF5'`, `borderRadius: '24px'`
  - 選中的 Tab: `bgcolor: '#3F8CFF'`, `color: 'white'`, `borderRadius: '20px'`
  - 未選的 Tab: 文字 `#0A1629`

### 狀態標籤 (Task / Vacation Statuses)
這類標籤高度通常為 `30px`，內部包含文字與圓角底色。
- **To Do**: 背景 `rgba(125,133,146,0.14)` (淺灰), 文字 `#7D8592`
- **In Progress**: 背景 `rgba(63,140,255,0.12)` (淺藍), 文字 `#3F8CFF`
- **In Review**: 背景 `rgba(196,24,230,0.11)` (淺紫), 文字 `#C418E6`
- **Done/Approved**: 
  - 任務使用：背景 `rgba(0,208,151,0.12)` (淺綠), 文字 `#00D097`
  - 請假狀態使用：實心背景 `#00D097` (綠色), 文字 `white`
- **Pending**: 實心背景 `#FDC748` (黃色), 文字 `white`

---

### 使用此 Skill 的行為準則
1. **開發前先查閱此文件**：請以本文件定義的顏色、陰影 (`0px 6px 58px ...`)、圓角(`14px`, `24px`) 為準。
2. **切勿複製貼上 Figma 的 absolute 佈局**：Figma 導出的 Tailwind 程式碼充斥著 `absolute` 與 `top-[...] left-[...]` 絕對定位。請將其轉換成靈活的 `Flexbox` (在 MUI 則是 `<Box sx={{ display: 'flex', ...}}>`) 佈局。
3. **實作組件化**：當你發現自己多次寫入相同的 `boxShadow` 或按鈕樣式時，請考慮將該組件抽取到 `src/components/` 底下並套用這些 MUI props。
