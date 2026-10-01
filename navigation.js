// Run in the head so refresh restoration is disabled before section anchors resolve.
(() => {
  const page = window.location.pathname.split('/').pop();
  const home = page === '' || page === 'index.html';
  const navigation = performance.getEntriesByType('navigation')[0];
  const reload = navigation ? navigation.type === 'reload' : performance.navigation?.type === 1;
  if (home && reload) {
    history.scrollRestoration = 'manual';
    history.replaceState(history.state, '', window.location.pathname + window.location.search);
    const reset = () => window.scrollTo({top: 0, left: 0, behavior: 'instant'});
    reset();
    window.addEventListener('DOMContentLoaded', reset, {once: true});
    window.addEventListener('pageshow', reset, {once: true});
  } else {
    history.scrollRestoration = 'auto';
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href="#top"]').forEach(anchor => {
      anchor.addEventListener('click', event => {
        event.preventDefault();
        history.pushState(null, '', window.location.pathname + window.location.search);
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({top: 0, left: 0, behavior: reduceMotion ? 'instant' : 'smooth'});
      });
    });
  });
})();
