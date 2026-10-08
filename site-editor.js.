/* Applies Pages CMS content to the public website. */
(() => {
  'use strict';

  const bindings = {
    homepage: [
      ['eyebrow', '.hero .eyebrow'],
      ['headline', '#hero-title'],
      ['subtitle', '.hero-statement'],
      ['research_link', '.hero .text-link'],
      ['perspective_label', '.perspective .section-label'],
      ['perspective_heading', '#perspective-title'],
      ['perspective_body', '.perspective-copy'],
      ['page_title', 'title'],
      ['description', 'meta[name="description"]', 'meta']
    ],
    opportunities: [
      ['label', '#join .section-label'],
      ['heading', '#join-title'],
      ['students_heading', '.join-path:nth-child(1) h3'],
      ['students_body', '.join-path:nth-child(1) p'],
      ['collaborators_heading', '.join-path:nth-child(2) h3'],
      ['collaborators_body', '.join-path:nth-child(2) p'],
      ['contact_label', '#join .outline-link']
    ],
    'page-headings': [
      ['research_label', '#research .section-label', '', 'index.html'],
      ['research_heading', '#research-title', '', 'index.html'],
      ['people_label', '#people .section-label', '', 'index.html'],
      ['people_heading', '#people-title', '', 'index.html'],
      ['news_label', '#news .section-label', '', 'index.html'],
      ['news_heading', '#news-title', '', 'index.html'],
      ['publications_label', '#publications .section-label', '', 'index.html'],
      ['publications_heading', '#publications-title', '', 'index.html'],
      ['students_heading', '.student-heading', '', 'index.html'],
      ['older_news', '.news-archive-link', '', 'index.html'],
      ['scholar_label', '#publications .text-link', '', 'index.html'],
      ['gallery_title', 'title', '', 'gallery.html'],
      ['gallery_label', '.gallery-intro .section-label', '', 'gallery.html'],
      ['gallery_heading', '.gallery-intro h1', '', 'gallery.html'],
      ['gallery_intro', '.gallery-intro-copy', '', 'gallery.html'],
      ['gallery_back', '.gallery-back', '', 'gallery.html'],
      ['gallery_description', 'meta[name="description"]', 'meta', 'gallery.html'],
      ['archive_title', 'title', '', 'news.html'],
      ['archive_label', '.gallery-intro .section-label', '', 'news.html'],
      ['archive_heading', '.gallery-intro h1', '', 'news.html'],
      ['archive_intro', '.gallery-intro-copy', '', 'news.html'],
      ['archive_back', '.gallery-back', '', 'news.html'],
      ['archive_description', 'meta[name="description"]', 'meta', 'news.html'],
      ['gallery_empty_heading', '.gallery-empty h2', '', 'gallery.html'],
      ['gallery_empty_body', '.gallery-empty p', '', 'gallery.html']
    ]
  };

  const page = location.pathname.split('/').pop() || 'index.html';

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = String(text ?? '');
    return element;
  }

  function safeURL(value) {
    const text = String(value || '').trim();

    if (!text || /[\u0000-\u0020\\]/.test(text)) return '';

    try {
      const url = new URL(text, location.href);
      return ['https:', 'http:', 'mailto:'].includes(url.protocol)
        ? text
        : '';
    } catch {
      return '';
    }
  }

  function asset(value) {
    const url = safeURL(value);
    if (!url || url.startsWith('mailto:')) return '';

    if (/^\/?assets\//.test(url) && !url.split('/').includes('..')) {
      return url.replace(/^\//, '');
    }

    return /^https?:\/\//.test(url) ? url : '';
  }

  function link(label, value, className) {
    const url = safeURL(value);
    if (!url) return null;

    const element = make('a', className, label);
    element.href = url;

    if (/^https?:/.test(url)) {
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
    }

    return element;
  }

  async function fetchJSON(name) {
    const response = await fetch(`content/${name}.json`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Could not load ${name}: ${response.status}`);
    }

    return response.json();
  }

  function textWithLines(element, value) {
    element.replaceChildren();

    String(value ?? '').split('\n').forEach((line, index) => {
      if (index) element.append(make('br'));
      element.append(document.createTextNode(line));
    });
  }

  function applyBindings(name, data) {
    if (!data || typeof data !== 'object') return;

    for (const [key, selector, mode, requiredPage] of bindings[name] || []) {
      if (requiredPage && requiredPage !== page) continue;
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

      for (const element of document.querySelectorAll(selector)) {
        if (mode === 'meta') {
          element.setAttribute('content', String(data[key] ?? ''));
          continue;
        }

        const arrow = element.tagName === 'A'
          ? element.querySelector('span[aria-hidden]')
          : null;

        if (arrow) {
          element.replaceChildren(
            document.createTextNode(String(data[key] ?? '') + ' '),
            arrow
          );
        } else {
          textWithLines(element, data[key]);
        }
      }
    }
  }

  function renderResearch(items) {
    const list = document.querySelector('.research-list');
    if (!list || !Array.isArray(items)) return;

    const fragment = document.createDocumentFragment();

    items
      .filter(item => item && item.visible !== false)
      .forEach((item, index) => {
        const article = make('article', 'research-item');
        const copy = make('div', 'research-copy');
        const body = make('p');

        textWithLines(body, item.body);

        copy.append(
          make('span', 'number', String(index + 1).padStart(2, '0')),
          make('h3', '', item.title),
          body
        );

        article.append(copy);

        const source = asset(item.photo);

        if (source) {
          const image = make('img', 'research-image');
          image.src = source;
          image.alt = String(item.alt || '');
          image.loading = 'lazy';
          article.append(image);
        } else {
          article.style.gridTemplateColumns = '1fr';
        }

        fragment.append(article);
      });

    list.replaceChildren(fragment);
  }

  function renderSite(data) {
    if (!data || typeof data !== 'object') return;

    document.querySelectorAll('.wordmark').forEach(element => {
      if (typeof data.lab_name === 'string') {
        element.textContent = data.lab_name;
        element.setAttribute('aria-label', data.lab_name + ', home');
      }
    });

    const footer = document.querySelector('.footer-grid');

    if (footer) {
      const brand = footer.querySelector('.footer-brand');
      if (brand && data.lab_name !== undefined) {
        brand.textContent = data.lab_name;
      }

      const address = footer.querySelector('div:first-child > p');
      if (address && data.address !== undefined) {
        textWithLines(address, data.address);
      }

      const connect = footer.children[1];

      if (connect) {
        connect.replaceChildren(
          make('p', 'footer-heading', data.connect_label || 'Connect')
        );

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) {
          const emailLink = link(data.email, 'mailto:' + data.email);
          if (emailLink) connect.append(emailLink);
        }

        const faculty = link(data.faculty_label, data.faculty_url);
        if (faculty) connect.append(faculty);
      }
    }

    const scholar = safeURL(data.scholar_url);

    if (scholar) {
      document.querySelectorAll('#publications .section-heading > a')
        .forEach(element => {
          element.href = scholar;
        });
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) {
      document.querySelectorAll('#join .outline-link').forEach(element => {
        element.href = 'mailto:' + data.email
          + '?subject=Kayode%20Lab%20inquiry';
      });
    }

    if (Array.isArray(data.navigation)) {
      const nav = document.querySelector('.primary-nav');
      const fragment = document.createDocumentFragment();
      const explore = footer && footer.children[2];

      if (explore) {
        explore.replaceChildren(
          make('p', 'footer-heading', data.explore_label || 'Explore')
        );
      }

      for (const item of data.navigation.filter(
        item => item && item.visible !== false
      )) {
        const anchor = link(
          item.label,
          item.url,
          item.button ? 'nav-join' : ''
        );

        if (!anchor) continue;

        const destination = new URL(anchor.href, location.href);

        if (destination.pathname === location.pathname && !destination.hash) {
          anchor.setAttribute('aria-current', 'page');
        }

        anchor.addEventListener('click', () => {
          nav?.classList.remove('is-open');

          const button = document.querySelector('.menu-toggle');

          if (button) {
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-label', 'Open menu');
          }
        });

        fragment.append(anchor);

        if (
          explore &&
          !item.button &&
          !String(item.url).includes('#contact')
        ) {
          const footerLink = link(item.label, item.url);
          if (footerLink) explore.append(footerLink);
        }
      }

      if (nav) nav.replaceChildren(fragment);
    }

    const bottom = document.querySelector('.footer-bottom');

    if (bottom) {
      if (data.copyright !== undefined && bottom.children[0]) {
        bottom.children[0].textContent = data.copyright;
      }

      const credit = bottom.children[1];

      if (credit) {
        credit.replaceChildren(
          document.createTextNode(data.image_credit_prefix || '')
        );

        const creditLink = link(
          data.image_credit_label,
          data.image_credit_url
        );

        credit.append(
          creditLink || document.createTextNode(data.image_credit_label || ''),
          document.createTextNode(data.image_credit_suffix || '')
        );
      }
    }
  }

  function renderAppearance(data) {
    if (!data || typeof data !== 'object') return;

    const root = document.documentElement;

    for (const key of [
      'paper', 'white', 'ink', 'secondary', 'accent',
      'gold', 'gold_ink', 'dark', 'line'
    ]) {
      if (/^#[0-9a-f]{6}$/i.test(data[key] || '')) {
        root.style.setProperty(
          '--' + key.replace('_', '-'),
          data[key]
        );
      }
    }

    const scale = Number(data.font_scale);

    if (Number.isFinite(scale) && scale >= 90 && scale <= 125) {
      root.style.fontSize = scale + '%';
    }

    const fonts = {
      Arial: 'Arial,Helvetica,sans-serif',
      Georgia: "Georgia,'Times New Roman',serif",
      Verdana: 'Verdana,sans-serif',
      'Trebuchet MS': "'Trebuchet MS',sans-serif"
    };

    const rules = [
      '[hidden]{display:none!important}',
      '.wordmark{font:600 1.3rem/1.2 Arial,Helvetica,sans-serif;'
        + 'letter-spacing:-.025em;color:var(--ink)}'
    ];

    if (fonts[data.body_font]) {
      rules.push(`body{font-family:${fonts[data.body_font]}}`);
    }

    if (fonts[data.heading_font] && data.heading_font !== 'Georgia') {
      rules.push(
        'h1,h2,h3,.research-item h3,.pi-detail h3,.member-card h3'
        + `{font-family:${fonts[data.heading_font]}}`
      );
    }

    function imageRule(selector, value) {
      const source = asset(value);

      if (source) {
        rules.push(
          selector + '{background-image:url('
          + JSON.stringify(source) + ')!important}'
        );
      }
    }

    imageRule('.hero::before', data.hero_photo);

    imageRule(
      '.hero.has-mosquito-motion::before,.mosquito-scene',
      data.leaf_photo
    );

    imageRule('.mosquito-sprite', data.mosquito_sprite);

    if (data.animate_mosquito === false) {
      rules.push('.mosquito-scene,.mosquito-control{display:none!important}');
      imageRule('.hero.has-mosquito-motion::before', data.hero_photo);
    }

    if (
      /^#[0-9a-f]{6}$/i.test(data.dark || '') &&
      data.dark.toLowerCase() !== '#16231d'
    ) {
      rules.push(
        '.hero::after{background:linear-gradient('
        + '90deg,var(--dark) 0%,var(--dark) 47%,transparent 100%)}'
      );
    }

    document.getElementById('site-editor-appearance')?.remove();

    const style = make('style', '', rules.join('\n'));
    style.id = 'site-editor-appearance';
    document.head.append(style);

    for (const key of [
      'perspective', 'research', 'people', 'news', 'publications', 'join'
    ]) {
      const element = document.querySelector(
        key === 'perspective' ? '.perspective' : '#' + key
      );

      if (element && typeof data['show_' + key] === 'boolean') {
        element.hidden = !data['show_' + key];
      }
    }
  }

  async function run() {
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve, { once: true });
      });
    }

    await (window.KAYODE_CONTENT_READY || Promise.resolve());

    const jobs = [
      ['site-settings', renderSite],
      ['appearance', renderAppearance],
      ['page-headings', data => applyBindings('page-headings', data)]
    ];

    if (document.querySelector('.hero')) {
      jobs.push(
        ['homepage', data => applyBindings('homepage', data)],
        ['opportunities', data => applyBindings('opportunities', data)]
      );
    }

    if (document.querySelector('.research-list')) {
      jobs.push(['research', renderResearch]);
    }

    const results = await Promise.allSettled(
      jobs.map(async ([name, render]) => {
        render(await fetchJSON(name));
      })
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(
          `Could not apply CMS content: ${jobs[index][0]}`,
          result.reason
        );
      }
    });

    return results;
  }

  window.KAYODE_EDITOR_READY = run();
})();
