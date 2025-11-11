document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (!header) return;

  const container = document.createElement('div');
  container.className = 'header-floating';

  container.style.position = 'absolute';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.overflow = 'hidden';
  container.style.zIndex = '1';
  header.appendChild(container);

  const imageList = [
    'projectImages/AU/1.png',
    'projectImages/AU/2.png',
    'projectImages/AU/3.png',
    'projectImages/AU/4.png',
    'projectImages/AU/5.png',
    'projectImages/AU/6.png',
    'projectImages/AU/7.png',
  ];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnFloatingImage() {
  const rect = header.getBoundingClientRect();
  const size = Math.round(rand(100, 200)); 


  const sides = ['left', 'right', 'top', 'bottom'];
  const startSide = sides[Math.floor(Math.random() * sides.length)];

  const opposite = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' };
  const endSide = opposite[startSide] || sides[Math.floor(Math.random() * sides.length)];

    function pickPointOnSide(side, outside = true) {

      if (side === 'left') {
        const x = outside ? -size - rand(8, 40) : rand(0, Math.max(0, rect.width - size));
        const y = rand(-size * 0.2, rect.height - size * 0.2);
        return { x, y };
      }
      if (side === 'right') {
        const x = outside ? rect.width + rand(8, 40) : rand(0, Math.max(0, rect.width - size));
        const y = rand(-size * 0.2, rect.height - size * 0.2);
        return { x, y };
      }
      if (side === 'top') {
        const x = rand(-size * 0.2, rect.width - size * 0.2);
        const y = outside ? -size - rand(8, 40) : rand(0, Math.max(0, rect.height - size));
        return { x, y };
      }

      const x = rand(-size * 0.2, rect.width - size * 0.2);
      const y = outside ? rect.height + rand(8, 40) : rand(0, Math.max(0, rect.height - size));
      return { x, y };
    }

  const start = pickPointOnSide(startSide, true);
  const end = pickPointOnSide(endSide, true);

    const img = document.createElement('img');
    img.src = imageList[Math.floor(Math.random() * imageList.length)];
  img.className = 'header-float-img';
    img.alt = '';
    img.style.width = size + 'px';
    img.style.height = size + 'px';
    img.style.position = 'absolute';
    img.style.left = start.x + 'px';
    img.style.top = start.y + 'px';
    img.style.opacity = '0';
    img.style.pointerEvents = 'none';
  img.style.borderRadius = '0';
    img.style.objectFit = 'cover';
    img.style.transform = 'translate(0px, 0px)';

    container.appendChild(img);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);


  const MIN_SPEED = 0.03; 
  const MAX_SPEED = 0.12; 
  const MIN_SIZE = 48;
  const MAX_SIZE = 110;
  const sizeNorm = Math.max(0, Math.min(1, (size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)));
  const speed = MIN_SPEED + sizeNorm * (MAX_SPEED - MIN_SPEED);


  const duration = Math.max(3000, Math.min(18000, Math.round(distance / speed)));

 
  img.style.transition = `transform ${duration}ms linear`;


  img.offsetHeight;
  img.style.opacity = '1';
  img.style.transform = `translate(${dx}px, ${dy}px)`;

    setTimeout(() => {
      if (img && img.parentNode) img.parentNode.removeChild(img);
    }, duration + 300);
  }

  let spawnTimer = null;
  function scheduleNext() {
    const nextIn = 4000;
    spawnTimer = setTimeout(() => {
      spawnFloatingImage();
      scheduleNext();
    }, nextIn);
  }

  scheduleNext();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(spawnTimer);
    } else {
      scheduleNext();
    }
  });
});
