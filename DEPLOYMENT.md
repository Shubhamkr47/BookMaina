# Deployment Guide

## Backend

Deploy the `backend` folder to a Node host such as Render, Railway, or Cyclic.

Set these environment variables:

- `MONGO_URI`
- `PORT`
- `JWT_SECRET`
- `EMAIL`
- `EMAIL_PASS`
- `CORS_ORIGIN`

Start command:

```bash
npm start
```

## Frontend

Deploy the `Front-end` folder to Vercel, Netlify, or any static host.

Set this environment variable before building:

```bash
VITE_API_BASE_URL=https://your-backend-url
```

Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

## Local Run

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd Front-end
npm install
npm run dev
```
