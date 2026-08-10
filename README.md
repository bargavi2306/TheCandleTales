# The Candle Tales — Production Deployment Guide

This workspace contains the complete codebase for **The Candle Tales** storefront:
- `/frontend` — React 19 + Vite + TailwindCSS 4 storefront and admin console.
- `/backend` — Java 17 + Spring Boot + Spring Security + JPA MySQL REST API.

---

## 1. Environment Setup

### Backend Environment Variables (`backend/.env`)
Set these environment variables on your backend hosting provider (e.g. Railway, Render):

| Environment Variable | Description / Example |
|----------------------|-----------------------|
| `SPRING_PROFILES_ACTIVE` | Set to `prod` to enable production settings. |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<db-host>:<port>/<db-name>` |
| `SPRING_DATASOURCE_USERNAME` | Database connection username |
| `SPRING_DATASOURCE_PASSWORD` | Database connection password |
| `JWT_SECRET` | Minimum 64-character secret key for secure JWT token signing. |
| `FRONTEND_URL` | The production URL of your frontend (e.g. `https://thecandletales.vercel.app`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name for image hosting storage |
| `CLOUDINARY_API_KEY` | Cloudinary API access key |
| `CLOUDINARY_API_SECRET` | Cloudinary API access secret |
| `ADMIN_DEFAULT_PASSWORD` | Optional password for the initial seeded admin account. |

### Frontend Environment Variables (`frontend/.env`)
Set these variables on your frontend hosting provider (e.g. Vercel):

| Environment Variable | Description / Example |
|----------------------|-----------------------|
| `VITE_API_BASE_URL` | The fully qualified URL of your backend API (e.g. `https://backend.railway.app`). If serving from a single domain/reverse proxy, leave empty. |

---

## 2. Deploying the Backend (Spring Boot)

You can deploy the Java Spring Boot backend directly to **Railway** or **Render**:

### Render Deployment
1. Create a new **Web Service** on Render.
2. Link your Git repository.
3. Configure the following service settings:
   - **Environment**: `Docker` OR `Java`
   - **Build Command**: `./mvnw clean package -DskipTests` (using Java runtime)
   - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
4. Add all required backend environment variables listed in section 1.

### Railway Deployment
1. Create a new project on Railway.
2. Choose **Deploy from GitHub repo**.
3. Railway automatically detects Java/Spring Boot and configures compile/run commands.
4. Go to **Variables** and add all variables listed in section 1.

---

## 3. Deploying the Frontend (React + Vite)

You can deploy the frontend to **Vercel** or **Netlify**:

### Vercel Deployment
1. Go to Vercel and import the `/frontend` subfolder.
2. Set the build parameters:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add the `VITE_API_BASE_URL` environment variable pointing to your deployed backend URL.

---

## 4. Initial Seed Setup
- The application automatically seeds a default category structure and three initial candle products on first launch if the database is empty.
- An admin user is seeded with email: `admin@thecandletales.com` and the password configured via `ADMIN_DEFAULT_PASSWORD` (or `admin123` by default). Change this password in the Admin Console immediately after deployment.
