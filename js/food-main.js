// Main Interactive Food Experience & Visual Effects Engine for Khaltchi Khaltchi
// بإشراف الشيف حنين عادل 👩‍🍳

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFoodSparklesCursor();
  init3DCardTilt();
  initSpinWheel();

  // If on menu page, render default items
  if (document.getElementById('fullMenuGrid')) {
    renderMenuCategory('all');
  }

  // If on index page, render featured items
  if (document.getElementById('featuredGrid')) {
    renderFeaturedGrid();
  }

  // Update cart badge initially
  if (typeof updateAllCartBadges === 'function') {
    updateAllCartBadges();
  }
});

// 1. Mobile & Sticky Navbar
function initNavbar() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  // Navbar scroll background
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) {
      if (window.scrollY > 40) {
        nav.style.background = 'rgba(16, 18, 22, 0.96)';
        nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
      } else {
        nav.style.background = 'rgba(16, 18, 22, 0.88)';
        nav.style.boxShadow = 'none';
      }
    }
  });

  // Sound Button
  const soundBtn = document.getElementById('audioToggle');
  if (soundBtn && window.foodAudio) {
    soundBtn.addEventListener('click', () => {
      foodAudio.toggleMute(soundBtn);
    });
  }
}

// 2. Cursor Trail: Flying Food Sparkles & Spices
function initFoodSparklesCursor() {
  const canvas = document.createElement('canvas');
  canvas.id = 'spiceTrailCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9998';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  const emojis = ['✨', '🔥', '🧀', '🍕', '🍔', '🌶️', '🌿'];

  window.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.35) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 12 + 10,
        alpha: 1,
        decay: 0.025
      });
    }
  });

  function renderTrail() {
    ctx.clearRect(0, 0, w, h);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();
    }

    requestAnimationFrame(renderTrail);
  }

  renderTrail();
}

// 3. 3D Card Hover Perspective Tilt
function init3DCardTilt() {
  const cards = document.querySelectorAll('.food-card, .builder-banner-card, .hero-floating-card, .chef-card-home');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// 4. Render Menu Items with Real Photos & "طلب عادي" + "على ذوقك"
function renderMenuCategory(category) {
  const container = document.getElementById('fullMenuGrid');
  if (!container) return;

  const buttons = document.querySelectorAll('.cat-btn');
  buttons.forEach(b => {
    if (b.dataset.category === category) b.classList.add('active');
    else b.classList.remove('active');
  });

  const sourceDb = (typeof SEARCH_DB !== 'undefined' && SEARCH_DB.length) ? SEARCH_DB : FOOD_MENU;
  
  let filtered = sourceDb;
  if (category && category !== 'all') {
    filtered = sourceDb.filter(item => {
      if (item.category === category) return true;
      if (category === 'burgers' && (item.category === 'برجر' || item.category === 'سندويشات')) return true;
      if (category === 'pizzas' && (item.category === 'بيتزا' || item.category === 'معجنات')) return true;
      if (category === 'chicken' && item.category === 'دجاج') return true;
      if (category === 'sides' && (item.category === 'مقبلات' || item.category === 'سناكات')) return true;
      if (category === 'drinks' && item.category === 'مشروبات') return true;
      if (category === 'sweets' && item.category === 'حلويات') return true;
      return false;
    });
  }

  let html = '';
  if (!filtered.length) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.4);">
        <i class="fas fa-utensils" style="font-size: 3rem; margin-bottom: 12px; color: #ffb703;"></i>
        <h3 style="font-size: 1.3rem; margin-bottom: 6px; color: #fff;">لم نجد أطباقاً في هذه الفئة</h3>
        <p style="font-size: 0.9rem;">اختر فئة أخرى أو ابحث باسم الطبخة مباشرة!</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');
    const calories = item.cal || item.calories || 450;
    const catName = item.category || 'أطباق فاخرة';

    html += `
      <div class="food-card" data-category="${catName}" style="display:flex; flex-direction:column; overflow:hidden; border-radius:18px; background:rgba(24, 27, 34, 0.95); border:1px solid rgba(255,183,3,0.18); transition:0.3s;">
        <div style="position:relative; height:190px; overflow:hidden; background:#12141a;">
          <img src="${item.img}" alt="${item.name}" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block; transition:0.4s;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform=''" />
          <span style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); border-radius:12px; padding:3px 10px; font-weight:700; color:#ffb703; border:1px solid rgba(255,183,3,0.3); font-size:0.75rem;">
            ${catName}
          </span>
          <span style="position:absolute; bottom:10px; left:10px; background:rgba(0,0,0,0.75); backdrop-filter:blur(6px); border-radius:12px; padding:4px 10px; font-weight:900; color:#ffb703; border:1px solid rgba(255,183,3,0.3); font-size:0.95rem;">
            ${Number(item.price).toFixed(2)} د.أ
          </span>
        </div>

        <div class="food-card-body" style="padding:16px; display:flex; flex-direction:column; flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
            <h3 class="food-card-title" style="font-size:1.05rem; font-weight:800; color:#fff; line-height:1.3;">${item.name}</h3>
          </div>
          ${item.nameEn ? `<div style="font-size:0.75rem; color:#ffb703; font-weight:600; margin-bottom:6px;">${item.nameEn}</div>` : ''}
          <p class="food-card-desc" style="font-size:0.82rem; color:rgba(255,255,255,0.6); line-height:1.5; margin-bottom:12px; flex:1; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${item.desc}</p>

          <div class="food-card-meta" style="display:flex; gap:12px; font-size:0.75rem; color:rgba(255,255,255,0.45); margin-bottom:14px;">
            <span><i class="fas fa-fire-alt" style="color:#ff5722;"></i> ${calories} سعرة</span>
            <span><i class="fas fa-star" style="color:#ffb703;"></i> 4.9</span>
          </div>

          <!-- DOUBLE BUTTONS: طلب عادي + على ذوقك -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <button onclick="orderNormalItem(${itemJson})" style="
              background: linear-gradient(135deg, #d90429, #ff5722);
              color: #fff;
              border: none;
              padding: 10px 8px;
              border-radius: 12px;
              font-family: 'Cairo', sans-serif;
              font-weight: 800;
              font-size: 0.85rem;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              transition: 0.25s;
              box-shadow: 0 4px 14px rgba(217, 4, 41, 0.3);
            " onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform=''">
              <i class="fas fa-cart-plus"></i> طلب عادي
            </button>

            <button onclick="openCustomizeModal(${itemJson})" style="
              background: rgba(255, 183, 3, 0.12);
              color: #ffb703;
              border: 1px solid rgba(255, 183, 3, 0.35);
              padding: 10px 8px;
              border-radius: 12px;
              font-family: 'Cairo', sans-serif;
              font-weight: 800;
              font-size: 0.85rem;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              transition: 0.25s;
            " onmouseover="this.style.background='rgba(255, 183, 3, 0.22)'" onmouseout="this.style.background='rgba(255, 183, 3, 0.12)'">
              <i class="fas fa-magic"></i> على ذوقك ✨
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  init3DCardTilt();
}

// 5. Featured Items on Homepage: diverse iconic dishes across ALL cuisines!
function renderFeaturedGrid() {
  const container = document.getElementById('featuredGrid');
  if (!container) return;

  const sourceDb = (typeof SEARCH_DB !== 'undefined' && SEARCH_DB.length) ? SEARCH_DB : FOOD_MENU;
  
  // Pick iconic dishes across diverse cuisines
  const featuredIds = ['ar1', 'm1', 'sh1', 'r2', 'b1', 'p1', 'c1', 'it3', 'ar2', 'sea1', 'mx1', 'sw1'];
  let topItems = sourceDb.filter(i => featuredIds.includes(i.id));
  if (topItems.length < 6) {
    topItems = sourceDb.slice(0, 12);
  }

  let html = '';
  topItems.forEach(item => {
    const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');
    const calories = item.cal || item.calories || 500;
    const catName = item.category || 'تخصص الشيف';

    html += `
      <div class="food-card" style="display:flex; flex-direction:column; overflow:hidden; border-radius:18px; background:rgba(24, 27, 34, 0.95); border:1px solid rgba(255,183,3,0.18); transition:0.3s;">
        <div style="position:relative; height:200px; overflow:hidden; background:#12141a;">
          <img src="${item.img}" alt="${item.name}" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block; transition:0.4s;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform=''" />
          <span style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); border-radius:12px; padding:3px 10px; font-weight:700; color:#ffb703; border:1px solid rgba(255,183,3,0.3); font-size:0.75rem;">
            ${catName}
          </span>
          <span style="position:absolute; bottom:10px; left:10px; background:rgba(0,0,0,0.75); backdrop-filter:blur(6px); border-radius:12px; padding:4px 10px; font-weight:900; color:#ffb703; border:1px solid rgba(255,183,3,0.3); font-size:0.95rem;">
            ${Number(item.price).toFixed(2)} د.أ
          </span>
        </div>

        <div class="food-card-body" style="padding:16px; display:flex; flex-direction:column; flex:1;">
          <h3 class="food-card-title" style="font-size:1.05rem; font-weight:800; margin-bottom:6px; color:#fff;">${item.name}</h3>
          <p class="food-card-desc" style="font-size:0.82rem; color:rgba(255,255,255,0.6); line-height:1.5; margin-bottom:12px; flex:1; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${item.desc}</p>

          <div class="food-card-meta" style="display:flex; gap:12px; font-size:0.75rem; color:rgba(255,255,255,0.45); margin-bottom:14px;">
            <span><i class="fas fa-fire-alt" style="color:#ff5722;"></i> ${calories} سعرة</span>
            <span><i class="fas fa-star" style="color:#ffb703;"></i> 4.9</span>
          </div>

          <!-- Buttons -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <button onclick="orderNormalItem(${itemJson})" style="
              background: linear-gradient(135deg, #d90429, #ff5722);
              color: #fff;
              border: none;
              padding: 10px 8px;
              border-radius: 12px;
              font-family: 'Cairo', sans-serif;
              font-weight: 800;
              font-size: 0.85rem;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              transition: 0.25s;
              box-shadow: 0 4px 14px rgba(217, 4, 41, 0.3);
            " onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform=''">
              <i class="fas fa-cart-plus"></i> طلب عادي
            </button>

            <button onclick="openCustomizeModal(${itemJson})" style="
              background: rgba(255, 183, 3, 0.12);
              color: #ffb703;
              border: 1px solid rgba(255, 183, 3, 0.35);
              padding: 10px 8px;
              border-radius: 12px;
              font-family: 'Cairo', sans-serif;
              font-weight: 800;
              font-size: 0.85rem;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              transition: 0.25s;
            " onmouseover="this.style.background='rgba(255, 183, 3, 0.22)'" onmouseout="this.style.background='rgba(255, 183, 3, 0.12)'">
              <i class="fas fa-magic"></i> على ذوقك ✨
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  init3DCardTilt();
}

// 6. Lucky Spin Wheel Engine with 5-DAY COOLDOWN
let isWheelSpinning = false;
let currentWheelRotation = 0;

function initSpinWheel() {
  const canvas = document.getElementById('spinWheelCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 360;
  canvas.width = size;
  canvas.height = size;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 8;

  const prizes = WHEEL_PRIZES;
  const numPrizes = prizes.length;
  const arc = (Math.PI * 2) / numPrizes;

  // Draw the wheel segments
  function drawWheel() {
    ctx.clearRect(0, 0, size, size);

    prizes.forEach((prize, i) => {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = prize.color;
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.lineTo(cx, cy);
      ctx.fill();
      ctx.strokeStyle = '#2a2e3b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Text inside segment
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Tajawal, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(prize.text, radius - 25, 6);
      ctx.restore();
    });
  }

  drawWheel();

  const spinBtn = document.getElementById('btnSpinWheel');
  const resultEl = document.getElementById('spinWheelResult');

  // Setup 5-Day Cooldown
  let spinController = null;
  if (typeof setup5DaySpinWheel === 'function') {
    spinController = setup5DaySpinWheel(spinBtn, resultEl);
  }

  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      if (isWheelSpinning) return;

      // Enforce 5-day lock
      if (spinController && !spinController.canSpin()) {
        showKhaltchiToast('⏳ عجلة الحظ متاحة مرة كل 5 أيام! يرجى الانتظار');
        return;
      }

      isWheelSpinning = true;
      if (window.foodAudio) foodAudio.playWheelTick();

      const extraRotations = 6 + Math.floor(Math.random() * 4);
      const randomStopDeg = Math.floor(Math.random() * 360);
      const totalDeg = extraRotations * 360 + randomStopDeg;
      currentWheelRotation += totalDeg;

      canvas.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.9, 0.25, 1)';
      canvas.style.transform = `rotate(${currentWheelRotation}deg)`;

      // Wheel ticking sound
      let ticks = 0;
      const tickInterval = setInterval(() => {
        ticks++;
        if (window.foodAudio) foodAudio.playWheelTick();
        if (ticks > 28) clearInterval(tickInterval);
      }, 140);

      setTimeout(() => {
        isWheelSpinning = false;
        if (window.foodAudio) foodAudio.playCelebration();

        // Save timestamp in localStorage for 5-day rule
        if (spinController) {
          spinController.recordSpin();
        }

        // Calculate prize
        const actualDeg = (currentWheelRotation % 360);
        const prizeIndex = Math.floor(((360 - actualDeg + 270) % 360) / (360 / numPrizes));
        const wonPrize = prizes[prizeIndex] || prizes[0];

        if (resultEl) {
          resultEl.innerHTML = `
            <div style="background: rgba(255,183,3,0.18); border: 2px solid #ffb703; border-radius: 16px; padding: 1.2rem; text-align: center; margin-top: 1.5rem; animation: pulseNode 0.8s ease;">
              <h3 style="color: #fff; font-size: 1.3rem; margin-bottom: 0.4rem;">🎉 مبروووك! ربحت معنا: <span style="color: #ffb703;">${wonPrize.text}</span></h3>
              ${wonPrize.code ? `
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 0.8rem;">كوبون الخصم: <strong style="color: #ff5722; font-size: 1.2rem; background: #121316; padding: 0.2rem 0.8rem; border-radius: 6px;">${wonPrize.code}</strong></p>
                <button onclick="localStorage.setItem('khaltchi_coupon', '${wonPrize.code}'); window.location.href='cart.html';" style="background:linear-gradient(135deg,#d90429,#ff5722); color:#fff; border:none; padding:10px 20px; border-radius:20px; font-weight:800; cursor:pointer;">
                  حفظ الكوبون وفتح السلة
                </button>
              ` : '<p style="color: rgba(255,255,255,0.6);">جرب حظك بعد 5 أيام!</p>'}
              <div style="margin-top:10px; font-size:0.75rem; color:#ffb703;">🔒 تم قفل العجلة لمدة 5 أيام</div>
            </div>
          `;
        }
      }, 4600);
    });
  }
}
