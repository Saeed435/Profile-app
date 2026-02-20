# Profile App (React)

Converted from a small HTML/JS profile editor to a React app for learning.

## Features

- Add profiles with name, image URL, and bio
- Profiles persist to `localStorage`
- Clear saved profiles button

## Run locally

```bash
cd profile-app
npm install
npm start
```

Open http://localhost:3000 in your browser.
## Images

Sample images are in public/photo/ and are referenced as /photo/<name>.

## Publish to GitHub

1. Create a new empty repository on GitHub (do not initialize with README).
2. From this folder run:

``ash
cd profile-app
git init -b main
git add .
git commit -m "Initial commit: profile-app"
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
``

Replace the remote URL with your repository URL.
