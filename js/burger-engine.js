// Interactive Custom Burger Builder Lab for Khaltchi Khaltchi
class BurgerLabEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.selectedBun = 'brioche';
    this.selectedPatty = 'angus';
    this.selectedCheese = 'cheddar';
    this.selectedSauce = 'khaltchi_sauce';
    this.selectedExtras = new Set(['bacon', 'caramelized_onions', 'pickles', 'lettuce']);
    this.customBurgerName = 'برجر خلتشي ماكس';

    this.init();
  }

  init() {
    this.renderStack();
    this.updateTelemetry();
  }

  setBun(bunId) {
    this.selectedBun = bunId;
    foodAudio.playToppingPop();
    this.renderStack();
    this.updateTelemetry();
  }

  setPatty(pattyId) {
    this.selectedPatty = pattyId;
    foodAudio.playToppingPop();
    this.renderStack();
    this.updateTelemetry();
  }

  setCheese(cheeseId) {
    this.selectedCheese = cheeseId;
    foodAudio.playToppingPop();
    this.renderStack();
    this.updateTelemetry();
  }

  setSauce(sauceId) {
    this.selectedSauce = sauceId;
    foodAudio.playToppingPop();
    this.renderStack();
    this.updateTelemetry();
  }

  toggleExtra(extraId) {
    if (this.selectedExtras.has(extraId)) {
      this.selectedExtras.delete(extraId);
    } else {
      this.selectedExtras.add(extraId);
      foodAudio.playToppingPop();
    }
    this.renderStack();
    this.updateTelemetry();
  }

  calculateTotals() {
    const bun = BURGER_BUILDER_DATA.buns.find(b => b.id === this.selectedBun) || BURGER_BUILDER_DATA.buns[0];
    const patty = BURGER_BUILDER_DATA.patties.find(p => p.id === this.selectedPatty) || BURGER_BUILDER_DATA.patties[0];
    const cheese = BURGER_BUILDER_DATA.cheeses.find(c => c.id === this.selectedCheese) || BURGER_BUILDER_DATA.cheeses[0];
    const sauce = BURGER_BUILDER_DATA.sauces.find(s => s.id === this.selectedSauce) || BURGER_BUILDER_DATA.sauces[0];

    let price = 2.50 + bun.price + patty.price + cheese.price + sauce.price;
    let calories = bun.calories + patty.calories + cheese.calories + sauce.calories;
    let layerCount = 4; // Bun bottom, sauce, patty, cheese

    this.selectedExtras.forEach(eId => {
      const extra = BURGER_BUILDER_DATA.extras.find(e => e.id === eId);
      if (extra) {
        price += extra.price;
        calories += extra.calories;
        layerCount++;
      }
    });

    const heightCm = Math.round(7 + layerCount * 1.2);

    return {
      price: price.toFixed(2),
      calories: Math.round(calories),
      heightCm,
      layerCount
    };
  }

  updateTelemetry() {
    const totals = this.calculateTotals();
    const priceEl = document.getElementById('labBurgerPrice');
    const calEl = document.getElementById('labBurgerCalories');
    const heightEl = document.getElementById('labBurgerHeight');

    if (priceEl) priceEl.textContent = `${totals.price} د.أ`;
    if (calEl) calEl.textContent = `${totals.calories} سعرة`;
    if (heightEl) heightEl.textContent = `${totals.heightCm} سم`;
  }

  renderStack() {
    const plate = document.getElementById('burgerPlate');
    if (!plate) return;

    // Stack bottom to top
    let html = '';

    // 1. Bottom Bun
    html += `
      <div class="burger-layer-item" style="z-index: 1;">
        <span class="burger-layer-graphic" title="قاعدة الخبز">🍞</span>
      </div>
    `;

    // 2. Sauce
    html += `
      <div class="burger-layer-item" style="z-index: 2; margin-bottom: -20px;">
        <span style="font-size: 40px;" title="الصلصة">🥫</span>
      </div>
    `;

    // 3. Patty
    html += `
      <div class="burger-layer-item" style="z-index: 3;">
        <span class="burger-layer-graphic" title="قطعة اللحم">🥩</span>
      </div>
    `;

    // 4. Cheese (if not none)
    if (this.selectedCheese !== 'none') {
      html += `
        <div class="burger-layer-item" style="z-index: 4; margin-bottom: -18px;">
          <span style="font-size: 55px;" title="الجبنة الذائبة">🧀</span>
        </div>
      `;
    }

    // 5. Extras (Pickles, Onions, Bacon, Tomatoes, Lettuce)
    let zIdx = 5;
    if (this.selectedExtras.has('bacon')) {
      html += `<div class="burger-layer-item" style="z-index: ${zIdx++};"><span style="font-size: 48px;" title="بيكون مقرمش">🥓</span></div>`;
    }
    if (this.selectedExtras.has('caramelized_onions')) {
      html += `<div class="burger-layer-item" style="z-index: ${zIdx++};"><span style="font-size: 44px;" title="بصل مكرمل">🧅</span></div>`;
    }
    if (this.selectedExtras.has('pickles')) {
      html += `<div class="burger-layer-item" style="z-index: ${zIdx++};"><span style="font-size: 44px;" title="خيار مخلل">🥒</span></div>`;
    }
    if (this.selectedExtras.has('tomatoes')) {
      html += `<div class="burger-layer-item" style="z-index: ${zIdx++};"><span style="font-size: 48px;" title="طماطم طازجة">🍅</span></div>`;
    }
    if (this.selectedExtras.has('lettuce')) {
      html += `<div class="burger-layer-item" style="z-index: ${zIdx++};"><span style="font-size: 52px;" title="خس أمريكي فريش">🥬</span></div>`;
    }
    if (this.selectedExtras.has('onion_rings')) {
      html += `<div class="burger-layer-item" style="z-index: ${zIdx++};"><span style="font-size: 46px;" title="حلقات بصل">🧅</span></div>`;
    }
    if (this.selectedExtras.has('fried_egg')) {
      html += `<div class="burger-layer-item" style="z-index: ${zIdx++};"><span style="font-size: 50px;" title="بيض عيون">🍳</span></div>`;
    }

    // 6. Top Bun
    html += `
      <div class="burger-layer-item" style="z-index: ${zIdx};">
        <span class="burger-layer-graphic" title="قمة الخبز المحمص بالسمسم">🍔</span>
      </div>
    `;

    plate.innerHTML = html;
  }

  addCustomBurgerToCart() {
    const totals = this.calculateTotals();
    const extrasList = Array.from(this.selectedExtras)
      .map(id => {
        const item = BURGER_BUILDER_DATA.extras.find(e => e.id === id);
        return item ? item.name : id;
      })
      .join(', ');

    const customItem = {
      id: `custom-burger-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: this.customBurgerName || 'برجر سبيشال من تصميمي',
      emoji: '🍔',
      price: parseFloat(totals.price),
      calories: totals.calories,
      desc: `خبز: ${this.selectedBun} | لحم: ${this.selectedPatty} | جبنة: ${this.selectedCheese} | الإضافات: ${extrasList || 'بدون إضافات'}`
    };

    cartTracker.addItem(customItem);
    foodAudio.playCelebration();

    // Visual Notification
    const toast = document.createElement('div');
    toast.className = 'food-card-badge';
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '0.9rem 2rem';
    toast.style.fontSize = '1.1rem';
    toast.style.zIndex = '9999';
    toast.style.background = 'linear-gradient(135deg, #ff5722, #d90429)';
    toast.style.color = '#fff';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> تم إدخال <strong>${customItem.name}</strong> إلى سلة طلباتك بنجاح! 🍔`;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3200);
  }
}
