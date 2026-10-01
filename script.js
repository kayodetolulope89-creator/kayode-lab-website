const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');

if (menuButton && nav) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    nav.classList.toggle('is-open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

// Enlarge gallery photos while keeping keyboard and screen reader support.
const galleryGrid = document.querySelector('.gallery-grid');
const galleryDialog = document.querySelector('.gallery-dialog');

if (galleryGrid && galleryDialog) {
  const enlargedImage = galleryDialog.querySelector('.gallery-enlarged');
  const enlargedCaption = galleryDialog.querySelector('.gallery-enlarged-caption');
  const closeButton = galleryDialog.querySelector('.gallery-close');

  galleryGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.gallery-photo-button');
    if (!button || !galleryGrid.contains(button)) return;
    const image = button.querySelector('img');
    if (!image) return;
    if (typeof galleryDialog.showModal !== 'function') {
      window.open(image.src, '_blank', 'noopener,noreferrer');
      return;
    }
    enlargedImage.src = button.dataset.fullImage || image.src;
    enlargedImage.alt = image.alt;
    const caption = button.closest('figure').querySelector('[data-photo-caption], figcaption');
    enlargedCaption.textContent = caption ? caption.textContent.trim() : '';
    galleryDialog.showModal();
  });

  closeButton.addEventListener('click', () => galleryDialog.close());
  galleryDialog.addEventListener('click', (event) => {
    if (event.target !== galleryDialog) return;
    const bounds = galleryDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      galleryDialog.close();
    }
  });
}

// One news list powers the latest four homepage updates and the full archive.
if (Array.isArray(window.KAYODE_NEWS)) {
  const updates = [...window.KAYODE_NEWS].sort((a, b) => b.date.localeCompare(a.date));
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  document.querySelectorAll('[data-news-list]').forEach((list) => {
    const limit = Number(list.dataset.newsLimit) || updates.length;
    const fragment = document.createDocumentFragment();
    updates.slice(0, limit).forEach((update) => {
      const article = document.createElement('article');
      article.className = 'news-item';
      const meta = document.createElement('div');
      meta.className = 'news-meta';
      const date = document.createElement('time');
      date.className = 'news-year';
      date.dateTime = update.date;
      date.textContent = monthFormatter.format(new Date(update.date + '-01T00:00:00Z'));
      const category = document.createElement('span');
      category.textContent = update.category;
      meta.append(date, category);
      const story = document.createElement('div');
      story.className = 'news-story';
      const title = document.createElement('h3');
      title.textContent = update.title;
      const body = document.createElement('p');
      body.textContent = update.body;
      story.append(title, body);
      article.append(meta, story);
      fragment.append(article);
    });
    list.replaceChildren(fragment);
  });
}
