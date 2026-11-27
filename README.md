# EduNova Student v24 — iOS PWA

A standalone HTML5/CSS3/vanilla JavaScript port of EduNova Student v24.0.0 Career Edition. No npm or bundler needed.

## GitHub Pages
1. Extract the ZIP; upload its CONTENTS (including assets/ and .nojekyll) to the repository root. Keep index.html at the root.
2. Repository Settings > Pages > Deploy from a branch > main > /(root) > Save.
3. Open https://YOUR-USER.github.io/YOUR-REPO/ in iPhone Safari. Use Share > Add to Home Screen. Open online once to cache the shell and assets.
4. Sign in using an existing student account, or choose Preview with sample lessons without sending data to Firebase.

## Compatibility and security
- Uses the original RTDB URL and paths; retains assignment ownership and grade filtering, session token checks, local results and drafts, and pending submission retry. The conditional REST PUT (If-Match: null_etag) strengthens the original local single-attempt lock across devices, subject to database rules and REST support.
- This preserves the original legacy plaintext password validation for migration compatibility. It is NOT secure production authentication: public static JavaScript, localStorage and client-side scores cannot enforce authorization or prevent tampering. Do not deploy with real student data until Firebase Authentication, restrictive per-student RTDB rules, and trusted server-side grading/write-once enforcement are implemented. Never relax database rules merely to make the web app work. No student credentials are bundled. Avoid shared browsers for sensitive student data; signing out retains local practice as in Android.
- Interactive HTML uses sandboxed srcdoc with inline scripts, styles, SVG and details; external resources and network requests are restricted for isolation. HTML activities are viewed, not scored, matching v24. Teacher questions require an online session.
- PWA is a web app, not an IPA. iOS may purge localStorage/cache under storage pressure, and offline retry runs when the app is reopened or connectivity returns, not guaranteed in the background. Initial load and sign-in require internet.
- Native iOS Safari and live Firebase endpoints have not been tested; do not claim full runtime parity or production readiness. Visual design is a web recreation of v24, not pixel-identical. Test on a real iPhone with a dedicated test student before rollout.

## Files
index.html, style.css, app.js, repository.js, manifest.json, sw.js, app icons, assets/ (all 19 original requested assets), verification.txt.
