# Mudra (Frontend)

## Run locally

From the repository root:

```sh
cd frontend
npm install
npm run dev
```

## Configure API URL (optional)

The frontend calls the backend using `VITE_API_BASE_URL`.

Examples:

```powershell
$env:VITE_API_BASE_URL="http://127.0.0.1:5000"
npm run dev
```

```powershell
$env:VITE_API_BASE_URL="http://192.168.0.187:5000"
npm run dev
```
