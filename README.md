# eVoice explanation site

A standalone, buildless project website for the eVoice privacy-preserving complaint platform. It contains no database credentials, API secrets, or runtime dependency on the MVP repository.

The repository includes `social-preview-evoice.png` and Open Graph/Twitter metadata for rich link previews. The metadata currently uses `https://cyber-cipher-explanation-site.vercel.app/`; update the canonical and image URLs in `index.html` if the final Vercel domain differs.

## Configure live-demo links

Edit `config.js` and set the public HTTPS origins of the separately deployed complaint, admin, and community portals. Leave a value empty when that portal is not publicly deployed; the corresponding links will be visibly disabled.

## Preview locally

From this directory, run any static web server. For example:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Deploy to Vercel

Create an empty Git repository, copy this folder into it, commit the files, and import the repository in Vercel. This is a buildless static site: no framework preset, build command, or output directory is required.

Alternatively, with the Vercel CLI installed and authenticated:

```powershell
vercel
vercel --prod
```

The included `vercel.json` supplies clean URLs and defensive browser-security headers.
