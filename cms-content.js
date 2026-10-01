/* The editor saves structured content. The public website only reads it. */
(() => {
  const node = (tag, className, text) => {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (text !== undefined) result.textContent = String(text ?? '');
    return result;
  };
  const externalURL = (value) => {
    try {
      const url = new URL(String(value || ''));
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };
  const assetURL = (value) => {
    const path = String(value || '').trim();
    if (/^\/?assets\//.test(path) && !path.split('/').includes('..')) return path.replace(/^\//, '');
    return externalURL(path);
  };
  const link = (label, url, className = 'text-link') => {
    const result = node('a', className, label);
    result.href = url;
    if (/^https?:/.test(url)) {
      result.target = '_blank';
      result.rel = 'noopener noreferrer';
      const arrow = node('span', '', ' ↗');
      arrow.setAttribute('aria-hidden', 'true');
      result.append(arrow);
    }
    return result;
  };
  const photo = (path, name, className) => {
    const src = assetURL(path);
    if (!src) {
      const placeholder = node('div', className + ' member-photo-placeholder', String(name || '').split(/\s+/).slice(0, 2).map(part => part[0]).join(''));
      placeholder.setAttribute('aria-hidden', 'true');
      return placeholder;
    }
    const image = node('img', className);
    image.src = src;
    image.alt = String(name || '');
    image.loading = 'lazy';
    image.decoding = 'async';
    return image;
  };
  const month = (value) => {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(String(value))) return String(value || '');
    return new Intl.DateTimeFormat('en-US', {month: 'long', year: 'numeric', timeZone: 'UTC'}).format(new Date(value + '-01T00:00:00Z'));
  };
  const newest = (items) => [...items].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const load = async (name) => {
    const response = await fetch('content/' + name + '.json', {cache: 'no-store'});
    if (!response.ok) throw new Error('Could not load ' + name);
    return response.json();
  };
  const loadList = async (name, render) => {
    const data = await load(name);
    if (!Array.isArray(data)) throw new Error('Expected a list for ' + name);
    render(data);
  };
  const renderNews = (items) => {
    document.querySelectorAll('[data-news-list]').forEach(list => {
      const updates = newest(items);
      const limit = Number(list.dataset.newsLimit) || updates.length;
      const fragment = document.createDocumentFragment();
      updates.slice(0, limit).forEach(item => {
        const article = node('article', 'news-item');
        const meta = node('div', 'news-meta');
        const date = node('time', 'news-year', month(item.date));
        date.dateTime = item.date || '';
        meta.append(date, node('span', '', item.category));
        const story = node('div', 'news-story');
        story.append(node('h3', '', item.title), node('p', '', item.body));
        article.append(meta, story);
        fragment.append(article);
      });
      list.replaceChildren(fragment);
    });
  };
  const renderMembers = (items) => {
    const list = document.querySelector('[data-members-list]');
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
      const article = node('article', 'member-card');
      const heading = node('h3', '', item.name);
      heading.id = 'member-' + index;
      article.setAttribute('aria-labelledby', heading.id);
      const summary = node('div', 'member-summary');
      const academic = node('p', 'member-academic', item.major);
      if (item.academic_detail) academic.append(node('br'), document.createTextNode(item.academic_detail));
      summary.append(heading, node('p', 'member-role', item.role), academic);
      if (item.graduation) {
        const graduation = node('p', 'member-graduation', 'Expected graduation: ');
        graduation.append(node('span', '', item.graduation));
        summary.append(graduation);
      }
      const overview = node('div', 'member-overview');
      overview.append(photo(item.photo, item.name, 'member-photo'), summary);
      article.append(overview, node('p', 'member-bio', item.bio));
      const links = node('div', 'member-links');
      links.setAttribute('aria-label', 'Contact ' + item.name);
      const linkedin = externalURL(item.linkedin);
      if (linkedin) links.append(link('LinkedIn', linkedin));
      if (item.show_email === true && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email || '')) {
        links.append(link(item.email, 'mailto:' + item.email, 'text-link member-email'));
      }
      article.append(links);
      fragment.append(article);
    });
    list.replaceChildren(fragment);
    list.closest('.student-section').hidden = items.length === 0;
  };
  const renderGallery = (items) => {
    const grid = document.querySelector('.gallery-grid');
    const fragment = document.createDocumentFragment();
    newest(items).forEach(item => {
      const src = assetURL(item.photo);
      if (!src) return;
      const figure = node('figure', 'gallery-figure');
      const button = node('button', 'gallery-photo-button');
      button.type = 'button';
      button.setAttribute('aria-label', 'Enlarge photo: ' + item.title);
      button.append(photo(src, item.alt, ''));
      const caption = node('figcaption', 'gallery-story');
      const date = node('time', 'gallery-date', month(item.date));
      date.dateTime = item.date || '';
      const title = node('h2', '', item.title);
      title.setAttribute('data-photo-caption', '');
      caption.append(date, title, node('p', '', item.story));
      figure.append(button, caption);
      fragment.append(figure);
    });
    const count = fragment.childNodes.length;
    grid.replaceChildren(fragment);
    const empty = document.querySelector('.gallery-empty');
    if (empty) empty.hidden = count > 0;
  };
  const scientificTitle = (value) => {
    const strong = node('strong');
    String(value || '').split(/(Plasmodium (?:falciparum|vivax|malariae|ovale))/g).forEach(part => {
      strong.append(/^Plasmodium /.test(part) ? node('em', '', part) : document.createTextNode(part));
    });
    return strong;
  };
  const renderPublications = (items) => {
    const list = document.querySelector('[data-publications-list]');
    const fragment = document.createDocumentFragment();
    // Show the ten newest papers. Keep the complete list saved in the editor.
    [...items].filter(item => externalURL(item.url)).sort((a, b) => Number(b.year || 0) - Number(a.year || 0)).slice(0, 10).forEach(item => {
      const url = externalURL(item.url);
      if (!url) return;
      const card = node('a', 'paper-card');
      card.href = url; card.target = '_blank'; card.rel = 'noopener noreferrer';
      const page = node('span', 'paper-page');
      const allowedStyles = ['nature','science','nejm','malaria','ofid','plos','plosone','reports','ijpara'];
      const style = allowedStyles.includes(item.journal_style) ? item.journal_style : 'neutral';
      page.append(node('span', 'paper-masthead ' + style, item.journal), node('span', 'paper-rule'), node('span', 'paper-kicker', (item.article_type || 'Article') + ' · ' + item.year), scientificTitle(item.title));
      if (item.doi) page.append(node('span', 'paper-doi', 'doi: ' + item.doi));
      const meta = node('span', 'paper-meta', item.short_journal || item.journal);
      meta.append(node('span', '', 'Read paper ↗'));
      card.append(page, meta);
      fragment.append(card);
    });
    list.replaceChildren(fragment);
  };
  const renderProfile = (item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item) || !item.name) throw new Error('Invalid PI profile');
    const profile = document.querySelector('[data-pi-profile]');
    const copy = node('div');
    const description = node('p');
    [item.role, item.position, item.institution].filter(Boolean).forEach((line, index) => {
      if (index) description.append(node('br'));
      description.append(document.createTextNode(line));
    });
    const links = node('div', 'member-links');
    links.setAttribute('aria-label', item.name + ' profiles');
    const faculty = externalURL(item.faculty_url), linkedin = externalURL(item.linkedin), cv = assetURL(item.cv);
    if (faculty) links.append(link('JMU faculty profile', faculty));
    if (linkedin) links.append(link('LinkedIn', linkedin));
    if (cv) links.append(link('CV (PDF)', cv));
    copy.append(node('h3', '', item.name), description, links);
    profile.replaceChildren(photo(item.photo, item.name, 'pi-photo'), copy);
  };
  const tasks = [];
  if (document.querySelector('[data-news-list]')) tasks.push(loadList('news', renderNews));
  if (document.querySelector('[data-members-list]')) tasks.push(loadList('members', renderMembers));
  if (document.querySelector('.gallery-grid')) tasks.push(loadList('gallery', renderGallery));
  if (document.querySelector('[data-publications-list]')) tasks.push(loadList('publications', renderPublications));
  if (document.querySelector('[data-pi-profile]')) tasks.push(load('profile').then(renderProfile));
  window.KAYODE_CONTENT_READY = Promise.allSettled(tasks).then(results => {
    results.forEach(result => { if (result.status === 'rejected') console.error('Website content:', result.reason); });
    return results;
  });
})();
