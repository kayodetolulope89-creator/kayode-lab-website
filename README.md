# Kayode Lab website

This repository contains the static Kayode Lab website. The published files are in the repository root: `index.html`, `styles.css`, `script.js`, and `assets/`.

## Preview locally

Run `python3 -m http.server 8000` in this directory, then open http://localhost:8000/.

## Publish with GitHub Pages

1. Create a **public** repository in your GitHub account, for example `kayode-lab-website`.
2. Upload all files and the `assets` folder from this directory to the repository root. Keep `.nojekyll` if your upload method shows hidden files.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, and save.
4. Once GitHub provides the `github.io` address, check the site there before changing DNS.
5. In **Settings → Pages → Custom domain**, enter `kayodelabs.com` and save. Do this before pointing DNS at GitHub.
6. In GoDaddy DNS, use GitHub Pages' current four apex A records for `@`, and a `www` CNAME to `<your-github-username>.github.io` (without a repository path). Remove conflicting old website A/CNAME records, but preserve email MX/TXT records. The previous ChatGPT Sites DNS values are for the temporary host and must not be used with GitHub Pages.
7. Once DNS and the certificate are ready, enable **Enforce HTTPS** in Pages settings.

GitHub's current instructions and IP addresses: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

For adding members, news, and publications, see [UPDATE_GUIDE.md](UPDATE_GUIDE.md).
