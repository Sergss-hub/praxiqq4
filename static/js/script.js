document.addEventListener('DOMContentLoaded', () => {
  const state = {
    curvature: 200,
    thickness: 1.5,
    skew: 0,
    verticalPadding: 40,
    lineLength: 54,
    glowSpeed: 4,
    perspective: 0,
  };

  const controls = {
    curvature: document.getElementById('curvature'),
    thickness: document.getElementById('thickness'),
    skew: document.getElementById('skew'),
    verticalPadding: document.getElementById('verticalPadding'),
    lineLength: document.getElementById('lineLength'),
    glowSpeed: document.getElementById('glowSpeed'),
    perspective: document.getElementById('perspective'),
  };

  const elements = {
    mainContainer: document.getElementById('main-content-container'),
    cardsAndHubContainer: document.getElementById('cards-and-hub-container'),
    leftCards: document.getElementById('left-cards'),
    rightCards: document.getElementById('right-cards'),
    staticPathsGroup: document.getElementById('static-paths-group'),
    animatedOrbsGroup: document.getElementById('animated-orbs-group'),
  }

  const SVG_NS = "http://www.w3.org/2000/svg";

  function calculatePaths() {
    const { curvature, skew, verticalPadding, lineLength } = state;

    const MAX_PADDING = 100;
    const MIN_PADDING = 4;
    const horizontalPadding = MAX_PADDING - (lineLength / 100) * (MAX_PADDING - MIN_PADDING);

    const topY = verticalPadding + 120; // card height (96px) / 2
    const bottomY = 615 - verticalPadding - 120;
    const c = curvature;
    const s = skew;

    const plugYTop = 266;
    const plugYMiddle = 300;
    const plugYBottom = 334;
    const plugXLeft = 504;
    const plugXRight = 696;

    const CONTAINER_WIDTH_PX = 3800;
    const CARD_WIDTH_PX = 270;
    const SVG_VIEWBOX_WIDTH = 1200;

    const P_TO_SVG_RATIO = SVG_VIEWBOX_WIDTH / CONTAINER_WIDTH_PX;

    const startXLeftPx = horizontalPadding + CARD_WIDTH_PX;
    const startXRightPx = CONTAINER_WIDTH_PX - horizontalPadding - CARD_WIDTH_PX;

    const startXLeftBase = startXLeftPx * P_TO_SVG_RATIO;
    const startXRightBase = startXRightPx * P_TO_SVG_RATIO;

    const startXLeft = startXLeftBase + s;
    const startXRight = startXRightBase - s;
    const startYMiddle = 300;

    const staticPaths = [
      `M ${startXLeft} ${topY} L ${plugXLeft - c} ${plugYTop} L ${plugXLeft} ${plugYTop}`,
      `M ${startXLeft} ${startYMiddle} L ${plugXLeft} ${plugYMiddle}`,
      `M ${startXLeft} ${bottomY} L ${plugXLeft - c} ${plugYBottom} L ${plugXLeft} ${plugYBottom}`,
      `M ${startXRight} ${topY} L ${plugXRight + c} ${plugYTop} L ${plugXRight} ${plugYTop}`,
      `M ${startXRight} ${startYMiddle} L ${plugXRight} ${plugYMiddle}`,
      `M ${startXRight} ${bottomY} L ${plugXRight + c} ${plugYBottom} L ${plugXRight} ${plugYBottom}`,
    ];

    const animPaths = [
      `M ${plugXLeft} ${plugYTop} L ${plugXLeft - c} ${plugYTop} L ${startXLeft} ${topY}`,
      `M ${plugXLeft} ${plugYMiddle} L ${startXLeft} ${startYMiddle}`,
      `M ${plugXLeft} ${plugYBottom} L ${plugXLeft - c} ${plugYBottom} L ${startXLeft} ${bottomY}`,
      `M ${plugXRight} ${plugYTop} L ${plugXRight + c} ${plugYTop} L ${startXRight} ${topY}`,
      `M ${plugXRight} ${plugYMiddle} L ${startXRight} ${startYMiddle}`,
      `M ${plugXRight} ${plugYBottom} L ${plugXRight + c} ${plugYBottom} L ${startXRight} ${bottomY}`,
    ];

    return { staticPaths, animPaths, horizontalPadding };
  }

  function updateDOM() {
    const { staticPaths, animPaths, horizontalPadding } = calculatePaths();

    // Apply transform styles
    elements.mainContainer.style.transform = `rotateY(${state.perspective}deg)`;
    elements.cardsAndHubContainer.style.paddingLeft = `${horizontalPadding}90px`;
    elements.cardsAndHubContainer.style.paddingRight = `${horizontalPadding}90px`;
    elements.leftCards.style.paddingTop = `${state.verticalPadding}px`;
    elements.leftCards.style.paddingBottom = `${state.verticalPadding}px`;
    elements.rightCards.style.paddingTop = `${state.verticalPadding}px`;
    elements.rightCards.style.paddingBottom = `${state.verticalPadding}px`;

    // Update static paths
    elements.staticPathsGroup.innerHTML = '';
    staticPaths.forEach(d => {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('stroke', '#262626ff');
      path.setAttribute('stroke-width', state.thickness);
      path.setAttribute('fill', 'none');
      elements.staticPathsGroup.appendChild(path);
    });

    // Update animated orbs
    elements.animatedOrbsGroup.innerHTML = '';
    animPaths.forEach((path, i) => {
      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('r', '8');
      circle.setAttribute('fill', 'url(#glow)');
      circle.setAttribute('opacity', '0');

      const animateMotion = document.createElementNS(SVG_NS, 'animateMotion');
      animateMotion.setAttribute('dur', `${state.glowSpeed}s`);
      animateMotion.setAttribute('begin', `${state.glowSpeed / 6 * i}s`);
      animateMotion.setAttribute('repeatCount', 'indefinite');
      animateMotion.setAttribute('path', path);

      const animateR = document.createElementNS(SVG_NS, 'animate');
      animateR.setAttribute('attributeName', 'r');
      animateR.setAttribute('values', '0;8;8;0');
      animateR.setAttribute('keyTimes', '0; 0.1; 0.9; 1');
      animateR.setAttribute('dur', `${state.glowSpeed}s`);
      animateR.setAttribute('begin', `${state.glowSpeed / 6 * i}s`);
      animateR.setAttribute('repeatCount', 'indefinite');

      const animateOpacity = document.createElementNS(SVG_NS, 'animate');
      animateOpacity.setAttribute('attributeName', 'opacity');
      animateOpacity.setAttribute('values', '0;1;1;0');
      animateOpacity.setAttribute('keyTimes', '0; 0.1; 0.9; 1');
      animateOpacity.setAttribute('dur', `${state.glowSpeed}s`);
      animateOpacity.setAttribute('begin', `${state.glowSpeed / 6 * i}s`);
      animateOpacity.setAttribute('repeatCount', 'indefinite');

      circle.appendChild(animateMotion);
      circle.appendChild(animateR);
      circle.appendChild(animateOpacity);
      elements.animatedOrbsGroup.appendChild(circle);
    });
  }

  // Attach event listeners
  for (const key in controls) {
    if (controls[key]) {
      controls[key].addEventListener('input', (e) => {
        state[key] = Number(e.target.value);
        updateDOM();
      });
    }
  }

  // Initial render
  updateDOM();
});

window.addEventListener("scroll", function () {
  const img = document.querySelector(".png2");

  if (window.scrollY > 200) {
    // ներքև շարժվելիս → դանդաղ
    img.style.transition = "transform 2s ease";
    img.style.transform = "translate(-50%, -10%) rotate(0deg)";
  } else {
    // վերև վերադառնալիս → արագ
    img.style.transition = "transform 0.1s ease";
    img.style.transform = "translate(-60%, -30%) rotate(-10deg)";
  }
});

window.addEventListener("scroll", function () {
  const img = document.querySelector(".png3");

  if (window.scrollY > 200) {
    // ներքև շարժվելիս → դանդաղ
    img.style.transition = "transform 2s ease";
    img.style.transform = "translate(-50%, -10%) rotate(0deg)";
  } else {
    // վերև վերադառնալիս → արագ
    img.style.transition = "transform 0.1s ease";
    img.style.transform = "translate(-60%, -30%) rotate(-10deg)";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cartTrigger = document.getElementById("cartTrigger");
  const cartPanel = document.getElementById("cartPanel");
  const closeCart = document.getElementById("closeCart");
  const cartOverlay = document.getElementById("cartOverlay");

  if (cartTrigger && cartPanel && closeCart && cartOverlay) {
    cartTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      cartPanel.classList.add("active");
      cartOverlay.classList.add("active");
    });

    function closeCartPanel() {
      cartPanel.classList.remove("active");
      cartOverlay.classList.remove("active");
    }

    closeCart.addEventListener("click", closeCartPanel);
    cartOverlay.addEventListener("click", closeCartPanel); // սեղմելիս դրսից էլ փակի
  } else {
    console.error("❌ Cart elements not found. Check your HTML IDs!");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".billing-toggle");
  const buttons = document.querySelectorAll(".toggle-btn");
  const prices = document.querySelectorAll(".plan-price");

  function updatePrices(mode) {
    toggle.classList.toggle("yearly", mode === "yearly");

    buttons.forEach(btn => btn.classList.toggle("active", btn.dataset.mode === mode));

    prices.forEach(price => {
      const value = price.dataset[mode];
      price.innerHTML = `${value} <span>ՀՀ դրամ</span>`;
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => updatePrices(btn.dataset.mode));
  });

  updatePrices("monthly");
});

addButton.addEventListener('click', () => {
  const selected = select.value;

  if (!selected) {
    alert('Խնդրում ենք ընտրել պլանը՝ Ամսական կամ Տարեկան');
    return;
  }

  let itemName = 'Սկսնակ փաթեթ';
  let planType = selected === 'monthly' ? 'Ամսական' : 'Տարեկան';
  let price = selected === 'monthly' ? '$10' : '$100';

  // Ջնջել placeholder-ը
  if (cartCount === 0) cartItems.innerHTML = '';

  // 🟢 Ստեղծում ենք item div — գեղցիկ
  const item = document.createElement('div');
  item.classList.add('cart-item');

  item.innerHTML = `
        <div>
            <div class="cart-item-name">${itemName}</div>
            <div class="cart-item-price">${planType} — ${price}</div>
        </div>
        <button class="remove-btn">&times;</button>
    `;

  cartItems.appendChild(item);

  // 🗑️ Ջնջելու Event
  item.querySelector('.remove-btn').addEventListener('click', () => {
    item.remove();
    cartCount--;
    document.querySelector('.menu-bascket').textContent = `Զամբյուղ(${cartCount})`;

    if (cartCount === 0) {
      cartItems.textContent = "Ոչ մի տարր չի գտնվել։";
    }
  });

  cartCount++;
  document.querySelector('.menu-bascket').textContent = `Զամբյուղ(${cartCount})`;
});



