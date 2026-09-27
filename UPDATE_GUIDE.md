# Updating Kayode Lab

The public content is in `index.html`; images are in `assets/`. After GitHub Pages is configured to publish from `main` and `/(root)`, changes committed to `main` are published automatically.

## Preview on your computer

Run `python3 -m http.server 8000` in the repository folder and open http://localhost:8000/. Refresh after changes; press `Ctrl+C` to stop the server.

## Add a lab member

Place the approved headshot in `assets/`, then find `<div class="wrap member-list"></div>` in `index.html` and replace it with:

```html
<div class="wrap member-list">
  <article class="member-card">
    <img src="assets/jane-doe.jpg" alt="Jane Doe" width="600" height="750" loading="lazy">
    <h3>Jane Doe</h3>
    <p class="member-role">Undergraduate researcher</p>
    <p>Jane studies [brief research interest or project].</p>
  </article>
</div>
```

Replace the sample details. Add further profiles inside the same `member-list` div.

## Add a news item

Find `<div class="news-list">` in `index.html` and add the new item above the older entries:

```html
<article class="news-item">
  <div class="news-meta"><time class="news-year" datetime="2027-05">May 2027</time><span>New member</span></div>
  <div class="news-story">
    <h3>Jane Doe joins Kayode Lab</h3>
    <p>Jane joins as an undergraduate researcher and will work on [project].</p>
  </div>
</article>
```

Use the actual month and year. Categories can include `Grant`, `Publication`, or `Lab milestone`.

## Add a selected publication

Find `<div class="paper-grid">` in `index.html`. Copy an existing `<a class="paper-card">…</a>` entry, then replace the journal, year, title, visible DOI, and DOI link. Keep entries newest first.

## Put an update online

Edit or upload changed files in GitHub and commit to `main`. Open the live site afterward to check the new content and image. If an image changed but still looks old, refresh the browser cache.
