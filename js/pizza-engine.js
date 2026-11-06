// Interactive Custom Pizza Builder Studio Engine for Khaltchi Khaltchi
class PizzaStudioEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.selectedCrust = 'thin';
    this.selectedSauce = 'marinara';
    this.selectedCheese = 'mozzarella';
    this.selectedToppings = new Set(['pepperoni', 'mushrooms', 'olives']);
    this.sliceCount = 8;
    this.isBaking = false;
    this.bakeProgress = 0; // 0 to 1
    this.customPizzaName = 'بيتزا خلتشي السحرية';
    this.rotAngle = 0;
    this.isDragging = false;
    this.startX = 0;

    // Generated topping positions so they look natural
    this.toppingScatter = {};
    this.generateToppingScatter();

    this.initCanvas();
    this.bindEvents();
    this.render();
  }

  initCanvas() {
    this.canvas.width = 420;
    this.canvas.height = 420;
  }

  generateToppingScatter() {
    const toppingsList = PIZZA_STUDIO_DATA.toppings;
    toppingsList.forEach(t => {
      this.toppingScatter[t.id] = [];
      const count = 14; // Average items per topping
      for (let i = 0; i < count; i++) {
        // Uniform circular distribution
        const r = Math.sqrt(Math.random()) * 135 + 10;
        const theta = Math.random() * Math.PI * 2;
        this.toppingScatter[t.id].push({
          x: Math.cos(theta) * r,
          y: Math.sin(theta) * r,
          scale: 0.85 + Math.random() * 0.3,
          rot: Math.random() * Math.PI * 2
        });
      }
    });
  }

  bindEvents() {
    // Click on canvas to drop new topping at mouse location
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) - this.canvas.width / 2;
      const clickY = (e.clientY - rect.top) - this.canvas.height / 2;
      const dist = Math.hypot(clickX, clickY);

      if (dist < 155) {
        // Drop extra topping
        const activeTops = Array.from(this.selectedToppings);
        if (activeTops.length > 0) {
          const randomTop = activeTops[Math.floor(Math.random() * activeTops.length)];
          if (this.toppingScatter[randomTop]) {
            this.toppingScatter[randomTop].push({
              x: clickX,
              y: clickY,
              scale: 0.9 + Math.random() * 0.25,
              rot: Math.random() * Math.PI * 2
            });
            foodAudio.playToppingPop();
            this.render();
            this.showSprinkleSplash(e.clientX, e.clientY);
          }
        }
      }
    });

    // Mouse drag rotation of the pizza
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.startX;
      this.rotAngle += dx * 0.012;
      this.startX = e.clientX;
      this.render();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }

  showSprinkleSplash(clientX, clientY) {
    const splash = document.createElement('div');
    splash.textContent = '✨';
    splash.style.position = 'fixed';
    splash.style.left = `${clientX}px`;
    splash.style.top = `${clientY}px`;
    splash.style.pointerEvents = 'none';
    splash.style.fontSize = '1.8rem';
    splash.style.zIndex = '9999';
    splash.style.transform = 'translate(-50%, -50%) scale(0.5)';
    splash.style.transition = 'all 0.5s ease-out';
    document.body.appendChild(splash);

    setTimeout(() => {
      splash.style.transform = 'translate(-50%, -80px) scale(1.4)';
      splash.style.opacity = '0';
    }, 20);

    setTimeout(() => splash.remove(), 550);
  }

  setCrust(crustId) {
    this.selectedCrust = crustId;
    foodAudio.playToppingPop();
    this.updateTelemetry();
    this.render();
  }

  setSauce(sauceId) {
    this.selectedSauce = sauceId;
    foodAudio.playToppingPop();
    this.updateTelemetry();
    this.render();
  }

  setCheese(cheeseId) {
    this.selectedCheese = cheeseId;
    foodAudio.playToppingPop();
    this.updateTelemetry();
    this.render();
  }

  toggleTopping(toppingId) {
    if (this.selectedToppings.has(toppingId)) {
      this.selectedToppings.delete(toppingId);
    } else {
      this.selectedToppings.add(toppingId);
      foodAudio.playToppingPop();
    }
    this.updateTelemetry();
    this.render();
  }

  setSlices(count) {
    this.sliceCount = parseInt(count);
    foodAudio.playCrustCrunch();
    this.render();
  }

  bakePizza() {
    if (this.isBaking) return;
    this.isBaking = true;
    foodAudio.startSizzle();

    const pan = document.getElementById('pizzaPanWrapper');
    if (pan) pan.classList.add('baking-oven');

    const btn = document.getElementById('btnBakePizza');
    if (btn) btn.innerHTML = '<i class="fas fa-fire fa-spin"></i> <span>جاري التحمير بالفرن...</span>';

    let step = 0;
    const interval = setInterval(() => {
      step += 0.05;
      this.bakeProgress = Math.min(1, step);
      this.rotAngle += 0.08;
      this.render();

      if (step >= 1) {
        clearInterval(interval);
        foodAudio.stopSizzle();
        foodAudio.playOvenBell();
        if (pan) pan.classList.remove('baking-oven');
        if (btn) btn.innerHTML = '<i class="fas fa-check-circle"></i> <span>البيتزا جاهزة وشهية!</span>';
        this.isBaking = false;

        setTimeout(() => {
          if (btn) btn.innerHTML = '<i class="fas fa-fire"></i> <span>تحمير في الفرن الحجري</span>';
        }, 3000);
      }
    }, 100);
  }

  calculateTotals() {
    const crustData = PIZZA_STUDIO_DATA.crusts.find(c => c.id === this.selectedCrust) || PIZZA_STUDIO_DATA.crusts[0];
    const sauceData = PIZZA_STUDIO_DATA.sauces.find(s => s.id === this.selectedSauce) || PIZZA_STUDIO_DATA.sauces[0];
    const cheeseData = PIZZA_STUDIO_DATA.cheeses.find(ch => ch.id === this.selectedCheese) || PIZZA_STUDIO_DATA.cheeses[0];

    let basePrice = 6.00 + crustData.price + sauceData.price + cheeseData.price;
    let baseCalories = crustData.calories + sauceData.calories + cheeseData.calories;

    this.selectedToppings.forEach(topId => {
      const topData = PIZZA_STUDIO_DATA.toppings.find(t => t.id === topId);
      if (topData) {
        basePrice += topData.price;
        baseCalories += topData.calories;
      }
    });

    return {
      price: basePrice.toFixed(2),
      calories: Math.round(baseCalories)
    };
  }

  updateTelemetry() {
    const totals = this.calculateTotals();
    const priceEl = document.getElementById('studioPizzaPrice');
    const calEl = document.getElementById('studioPizzaCalories');
    const topCountEl = document.getElementById('studioToppingCount');

    if (priceEl) priceEl.textContent = `${totals.price} د.أ`;
    if (calEl) calEl.textContent = `${totals.calories} سعرة`;
    if (topCountEl) topCountEl.textContent = `${this.selectedToppings.size} إضافات`;
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.rotAngle);

    // 1. DOUGH CRUST (Base circle)
    const crustRadius = 185;
    ctx.beginPath();
    ctx.arc(0, 0, crustRadius, 0, Math.PI * 2);

    // Color changes slightly when baked
    const crustColor1 = this.bakeProgress > 0 ? '#b26e25' : '#dcb074';
    const crustColor2 = this.bakeProgress > 0 ? '#7a4413' : '#a97332';

    const crustGrad = ctx.createRadialGradient(0, 0, 140, 0, 0, crustRadius);
    crustGrad.addColorStop(0, crustColor1);
    crustGrad.addColorStop(1, crustColor2);
    ctx.fillStyle = crustGrad;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Stuffed crust rim bubbles
    if (this.selectedCrust === 'stuffed') {
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#c4873b';
      ctx.beginPath();
      ctx.arc(0, 0, crustRadius - 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. SAUCE LAYER
    const sauceData = PIZZA_STUDIO_DATA.sauces.find(s => s.id === this.selectedSauce) || PIZZA_STUDIO_DATA.sauces[0];
    const sauceRadius = 160;
    ctx.beginPath();
    ctx.arc(0, 0, sauceRadius, 0, Math.PI * 2);
    ctx.fillStyle = sauceData.color;
    ctx.fill();

    // 3. MELTED CHEESE LAYER
    const cheeseRadius = 152;
    ctx.beginPath();
    ctx.arc(0, 0, cheeseRadius, 0, Math.PI * 2);

    let cheeseColor = '#ffe394';
    if (this.selectedCheese === 'cheddar') cheeseColor = '#ffad33';
    else if (this.selectedCheese === 'four_cheese') cheeseColor = '#ffd066';
    else if (this.selectedCheese === 'vegan') cheeseColor = '#f0ebe1';

    ctx.fillStyle = cheeseColor;
    ctx.fill();

    // Baked spots on cheese
    if (this.bakeProgress > 0.2) {
      ctx.fillStyle = `rgba(160, 82, 45, ${this.bakeProgress * 0.75})`;
      const bakedDots = [
        { x: -50, y: -40, r: 8 },
        { x: 45, y: -70, r: 12 },
        { x: 80, y: 30, r: 10 },
        { x: -70, y: 60, r: 11 },
        { x: 10, y: 70, r: 9 },
        { x: -10, y: -10, r: 14 }
      ];
      bakedDots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 4. TOPPINGS RENDERING
    this.selectedToppings.forEach(topId => {
      const items = this.toppingScatter[topId] || [];
      items.forEach(item => {
        this.drawSingleTopping(ctx, topId, item.x, item.y, item.scale, item.rot);
      });
    });

    // 5. SLICE LINES (If sliceCount > 0)
    if (this.sliceCount > 0) {
      ctx.strokeStyle = 'rgba(80, 40, 10, 0.45)';
      ctx.lineWidth = 2.5;
      const angleStep = Math.PI / (this.sliceCount / 2);
      for (let i = 0; i < this.sliceCount / 2; i++) {
        const curAngle = i * angleStep;
        ctx.beginPath();
        ctx.moveTo(Math.cos(curAngle) * -crustRadius, Math.sin(curAngle) * -crustRadius);
        ctx.lineTo(Math.cos(curAngle) * crustRadius, Math.sin(curAngle) * crustRadius);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawSingleTopping(ctx, type, x, y, scale, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    if (type === 'pepperoni') {
      // Round spicy pepperoni slice with curled edge
      ctx.fillStyle = '#b3261e';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#791914';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Little fat dots
      ctx.fillStyle = '#f28b82';
      ctx.fillRect(-6, -4, 3, 3);
      ctx.fillRect(4, 5, 2.5, 2.5);
      ctx.fillRect(-2, 7, 2, 2);
    } 
    else if (type === 'mushrooms') {
      // Mushroom slice profile
      ctx.fillStyle = '#e8d8c8';
      ctx.beginPath();
      ctx.arc(0, -2, 12, Math.PI, 0); // Cap
      ctx.lineTo(4, 8); // Stem
      ctx.lineTo(-4, 8);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#a89480';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    else if (type === 'olives') {
      // Black olive ring
      ctx.fillStyle = '#1c1c1e';
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      // Hole in center
      ctx.fillStyle = '#ffad33'; // shows cheese through hole
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (type === 'bellpeppers') {
      // Green pepper strip
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 0.8);
      ctx.stroke();
    }
    else if (type === 'onions') {
      // Purple onion crescent
      ctx.strokeStyle = '#8e24aa';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 0.9);
      ctx.stroke();
    }
    else if (type === 'jalapenos') {
      // Spicy jalapeno ring
      ctx.fillStyle = '#388e3c';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffad33';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      // Seeds
      ctx.fillStyle = '#fff9c4';
      ctx.fillRect(-2, -3, 2, 2);
      ctx.fillRect(2, 2, 2, 2);
    }
    else if (type === 'corn') {
      // Golden sweet corn kernel
      ctx.fillStyle = '#fbc02d';
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (type === 'basil') {
      // Fresh basil green leaf
      ctx.fillStyle = '#1b5e20';
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (type === 'chicken') {
      // Grilled chicken strip
      ctx.fillStyle = '#d7ccc8';
      ctx.beginPath();
      ctx.roundRect(-10, -5, 20, 10, 4);
      ctx.fill();
      // Grill marks
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-5, -5); ctx.lineTo(-2, 5);
      ctx.moveTo(3, -5); ctx.lineTo(6, 5);
      ctx.stroke();
    }
    else if (type === 'tomatoes') {
      // Cherry tomato slice
      ctx.fillStyle = '#e53935';
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b71c1c';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    else {
      // Fallback dot
      ctx.fillStyle = '#d81b60';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  addCustomPizzaToCart() {
    const totals = this.calculateTotals();
    const toppingsNames = Array.from(this.selectedToppings)
      .map(id => {
        const t = PIZZA_STUDIO_DATA.toppings.find(item => item.id === id);
        return t ? t.name : id;
      })
      .join(', ');

    const customItem = {
      id: `custom-pizza-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: this.customPizzaName || 'بيتزا من تصميمي الخاص',
      emoji: '🍕',
      price: parseFloat(totals.price),
      calories: totals.calories,
      desc: `عجينة: ${this.selectedCrust} | صلصة: ${this.selectedSauce} | جبنة: ${this.selectedCheese} | الإضافات: ${toppingsNames || 'جبن فقط'}`
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
    toast.style.background = 'linear-gradient(135deg, #ffb703, #fb8500)';
    toast.style.color = '#121316';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> تم إدخال <strong>${customItem.name}</strong> إلى سلة طلباتك بنجاح! 🍕`;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3200);
  }
}
