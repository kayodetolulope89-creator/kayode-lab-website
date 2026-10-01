(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.mosquito-scene')) return;
  const scene = document.createElement('div');
  scene.className = 'mosquito-scene';
  scene.setAttribute('aria-hidden', 'true');
  const hover = document.createElement('div');
  hover.className = 'mosquito-hover';
  const sprite = document.createElement('span');
  sprite.className = 'mosquito-sprite';
  hover.append(sprite);
  scene.append(hover);
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'mosquito-control';
  control.textContent = 'Pause animation';
  control.setAttribute('aria-pressed', 'false');
  control.addEventListener('click', () => {
    const paused = hero.classList.toggle('mosquito-paused');
    control.setAttribute('aria-pressed', String(paused));
    control.textContent = paused ? 'Resume animation' : 'Pause animation';
  });
  // Only replace the original photograph after both new assets load.
  Promise.all(['assets/hero-leaf.webp', 'assets/mosquito-flight.webp'].map(src =>
    new Promise((resolve, reject) => {
      const asset = new Image();
      asset.onload = resolve;
      asset.onerror = reject;
      asset.src = src;
    })
  )).then(() => {
    hero.append(scene, control);
    hero.classList.add('has-mosquito-motion');
  }).catch(() => { /* The original photograph stays visible if an asset fails. */ });
})();
