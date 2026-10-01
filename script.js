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

