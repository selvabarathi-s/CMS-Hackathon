# 🚀 Deploying CareerBridge on Render (Step-by-Step Guide)

This guide walks you through deploying **CareerBridge** on [Render.com](https://render.com) using either **Render Blueprint (1-Click Automated)** or **Manual Web Service Setup**.

---

## ⚡ Method 1: Deploy with Render Blueprint (Recommended & Fastest)

Render Blueprints use the `render.yaml` file included in the root of this repository to automatically configure the build command, start command, environment variables, and health checks.

### Step 1: Push Repository to GitHub
Ensure your latest code is pushed to your GitHub repository:
```bash
git push origin main
```

### Step 2: Create a Blueprint on Render
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click the **"New +"** button in the top navigation bar.
3. Select **"Blueprint"**.
4. Connect your GitHub account and select the **`CMS-Hackathon`** repository.
5. Enter a Blueprint Instance Name (e.g., `careerbridge-production`).
6. Click **"Apply"**.

Render will automatically read `render.yaml`, install dependencies, compile the React 19 client and Express TypeScript backend, and launch your live service with zero manual configuration!

---

## 🛠️ Method 2: Manual Web Service Setup on Render

If you prefer setting up the Web Service manually via the Render Dashboard:

### Step 1: Create a New Web Service
1. In the [Render Dashboard](https://dashboard.render.com/), click **"New +"** $\rightarrow$ **"Web Service"**.
2. Select **"Build and deploy from a Git repository"** and click **Next**.
3. Choose the **`CMS-Hackathon`** repository.

### Step 2: Configure Service Settings

Fill in the settings form as follows:

| Field | Value |
| :--- | :--- |
| **Name** | `careerbridge-platform` (or your chosen name) |
| **Region** | `Oregon (US West)` or `Frankfurt (EU Central)` |
| **Branch** | `main` |
| **Root Directory** | *(Leave blank / default)* |
| **Runtime** | `Node` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Step 3: Add Environment Variables

In the **Environment Variables** section, add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimization & static file serving |
| `PORT` | `10000` | Render dynamically assigns and binds to this port |

### Step 4: Health Check (Optional but Recommended)
- Expand **Advanced Settings**.
- Set **Health Check Path** to `/api/health`.

### Step 5: Deploy
Click **"Create Web Service"**. Render will start building the application.

---

## 🔍 How CareerBridge Runs in Production on Render

CareerBridge is designed as a **Unified Cloud Architecture**:

```
Client Browser (Desktop / Mobile PWA)
           │
           ▼  HTTPS (e.g. https://careerbridge.onrender.com)
┌─────────────────────────────────────────────────────────────┐
│ Render Node.js Web Service (Port 10000)                     │
│                                                             │
│  ├── GET /api/*         ──> Express REST API Routes        │
│  │                          (Auth, Careers, Skills, AI,    │
│  │                           Assessments, Roadmaps, Admin)  │
│  │                                                          │
│  ├── GET /assets/*      ──> Vite Production Build Bundles   │
│  │                          (client/dist/assets)            │
│  │                                                          │
│  └── GET /* (SPA Fall)  ──> client/dist/index.html          │
│                             (React Router DOM Navigation)   │
└─────────────────────────────────────────────────────────────┘
```

### Key Benefits of this Architecture:
1. **100% Free-Tier Friendly**: Requires only **1 single Free Web Service** on Render (saving resources and avoiding multi-service sleep sync delays).
2. **Zero CORS Issues**: The frontend and backend live under the exact same origin (`https://your-app.onrender.com`), eliminating cross-origin browser blocking.
3. **PWA & QR Companion Compatible**: The built-in QR pairing and mobile PWA sync seamlessly across smartphone browsers.

---

## 🧪 Post-Deployment Verification Checklist

Once Render shows **`Your service is live 🎉`**:

1. **Health Check**: Open `https://<your-app>.onrender.com/api/health` $\rightarrow$ Should return `{"status":"ok", "platform":"CareerBridge API v1.0"}`.
2. **Landing Page**: Open `https://<your-app>.onrender.com/` $\rightarrow$ CareerBridge homepage should render in Default Light Theme.
3. **Student Registration**: Click **"Get Started"** or **"Register"** $\rightarrow$ Complete the 5-step questionnaire to generate a dynamic personalized workspace.
4. **Multi-Portal Sign-In**:
   - Student: `selva@college.edu` (or `kalai@college.edu`) / `password123`
   - Faculty: `balu.prasath@university.edu` / `password123`
   - Admin: `admin@careerbridge.io` / `password123`
5. **AI Mentor & Diagnostic Arena**: Take a diagnostic quiz and test the real-time AI Career Mentor chat.

---

## 💡 Troubleshooting Render Deployments

### Issue: "npm: command not found" or "Build timed out"
- Ensure your Build Command is set to `npm run build` and Instance Type is `Free` or higher.

### Issue: 404 on page refresh (e.g., /dashboard, /explore)
- The server in `server/src/index.ts` has built-in SPA catch-all routing (`app.get('*')`) that routes all non-API paths to `client/dist/index.html`.

### Free Tier Spin-Down Note
- Render Free instances spin down after 15 minutes of inactivity. The first request after spin-down may take ~30-50 seconds to boot up.
