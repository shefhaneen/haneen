// Cart & Live Delivery Tracker Engine for Khaltchi Khaltchi
class CartAndTracker {
  constructor() {
    this.items = this.loadCart();
    this.activeCoupon = null;
    this.isTracking = false;
    this.trackingStep = 0;
  }

  loadCart() {
    try {
      const data = localStorage.getItem('khaltchi_cart');
      const cart = data ? JSON.parse(data) : [];
      if (!Array.isArray(cart)) throw new Error('بيانات السلة ليست قائمة');
      return cart.map(item => {
        const { quantity: legacyQuantity, calories: legacyCalories, ...normalizedItem } = item;
        const price = Number(item.price);
        const qty = Number(item.qty ?? legacyQuantity ?? 1);
        if (!Number.isFinite(price) || price < 0 || !Number.isSafeInteger(qty) || qty < 1) {
          throw new Error('يوجد عنصر ببيانات سعر أو كمية غير صالحة');
        }
        return {
          ...normalizedItem,
          price: Math.round(price * 100) / 100,
          qty,
          cal: Number(item.cal ?? legacyCalories ?? 0) || 0
        };
      });
    } catch (e) {
      console.error('تعذر تحميل السلة:', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('khaltchi_cart', JSON.stringify(this.items));
      this.updateNavbarBadge();
    } catch (e) {
      console.error('تعذر حفظ السلة:', e);
      if (typeof showKhaltchiToast === 'function') showKhaltchiToast('تعذر حفظ تغييرات السلة. حاول مجدداً.');
    }
  }

  addItem(foodItem) {
    const price = Number(foodItem.price);
    if (!Number.isFinite(price) || price < 0 || !foodItem.id || !foodItem.name) {
      throw new Error('بيانات الوجبة غير صالحة ولا يمكن إضافتها للسلة');
    }
    foodAudio.playToppingPop();
    const existing = this.items.find(i => i.id === foodItem.id);
    if (existing) {
      existing.qty += 1;
    } else {
      const { calories: legacyCalories, ...itemData } = foodItem;
      delete itemData.quantity;
      this.items.push({
        ...itemData,
        price: Math.round(Number(foodItem.price) * 100) / 100,
        qty: 1,
        cal: Number(foodItem.cal ?? legacyCalories ?? 0) || 0
      });
    }
    this.saveCart();
    this.renderCartUI();
  }

  removeItem(id) {
    foodAudio.playCrustCrunch();
    this.items = this.items.filter(i => i.id !== id);
    this.saveCart();
    this.renderCartUI();
  }

  updateQuantity(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      this.removeItem(id);
    } else {
      foodAudio.playToppingPop();
      this.saveCart();
      this.renderCartUI();
    }
  }

  clearCart() {
    this.items = [];
    this.activeCoupon = null;
    this.saveCart();
    this.renderCartUI();
  }

  applyCoupon(code) {
    const cleanCode = code.trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      const { subtotal } = this.calculateTotals();
      const minimum = Number(PROMO_CODES[cleanCode].minSubtotal || 0);
      if (subtotal < minimum) {
        return { success: false, msg: `يتطلب هذا الكوبون حداً أدنى للطلب قدره ${minimum.toFixed(2)} د.أ.` };
      }
      this.activeCoupon = {
        code: cleanCode,
        ...PROMO_CODES[cleanCode]
      };
      foodAudio.playCelebration();
      this.renderCartUI();
      return { success: true, msg: `تم تفعيل كوبون ${cleanCode}: ${this.activeCoupon.desc}` };
    } else {
      return { success: false, msg: 'عذراً، هذا الكوبون غير صالح أو منتهي الصلاحية.' };
    }
  }

  calculateTotals() {
    let subtotalCents = 0;
    let totalCalories = 0;

    this.items.forEach(i => {
      subtotalCents += Math.round(i.price * 100) * i.qty;
      totalCalories += (i.cal || 0) * i.qty;
    });

    let discount = 0;
    if (this.activeCoupon) {
      const minimumCents = Math.round(Number(this.activeCoupon.minSubtotal || 0) * 100);
      if (subtotalCents >= minimumCents && this.activeCoupon.discountPercent) {
        discount = Math.round(subtotalCents * (this.activeCoupon.discountPercent / 100));
      } else if (subtotalCents >= minimumCents && this.activeCoupon.discountFixed) {
        discount = Math.min(subtotalCents, Math.round(this.activeCoupon.discountFixed * 100));
      }
    }

    const effectiveDelivery = subtotalCents > 1500 ? 0 : subtotalCents === 0 ? 0 : 150;
    const finalTotal = Math.max(0, subtotalCents - discount + effectiveDelivery);

    return {
      subtotal: (subtotalCents / 100).toFixed(2),
      discount: (discount / 100).toFixed(2),
      delivery: (effectiveDelivery / 100).toFixed(2),
      total: (finalTotal / 100).toFixed(2),
      calories: totalCalories,
      itemCount: this.items.reduce((acc, cur) => acc + cur.qty, 0)
    };
  }

  updateNavbarBadge() {
    const badges = document.querySelectorAll('.cart-count-badge');
    const totals = this.calculateTotals();
    badges.forEach(b => {
      b.textContent = totals.itemCount;
    });
  }

  renderCartUI() {
    this.updateNavbarBadge();
    const container = document.getElementById('cartItemsList');
    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 5rem; margin-bottom: 1.2rem; filter: grayscale(0.5);">🛒</div>
          <h3 style="color: #fff; font-size: 1.6rem; margin-bottom: 0.6rem;">سلتك فارغة حالياً!</h3>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">ما جربت خلطات خلتشي الخرافية بعد؟ استكشف المنيو واطلب الآن!</p>
          <a href="menu.html" class="btn-primary" style="display: inline-flex;">
            <i class="fas fa-utensils"></i> <span>تصفح قائمة الطعام</span>
          </a>
        </div>
      `;
      this.updateSummaryUI();
      return;
    }

    let html = '';
    this.items.forEach(item => {
      const itemTotal = (item.price * item.qty).toFixed(2);
      html += `
        <div class="cart-item-row">
          <div class="cart-item-left">
            <span class="cart-item-emoji">${item.emoji || '🍕'}</span>
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p>${item.desc || ''}</p>
              <span style="color: var(--cheddar-gold); font-weight: 800; font-family: var(--font-price);">
                ${Number(item.price).toFixed(2)} د.أ للقطعة
              </span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="cartTracker.updateQuantity('${item.id}', -1)" title="تقليل">-</button>
              <span style="font-weight: 800; min-width: 20px; text-align: center;">${item.qty}</span>
              <button class="qty-btn" onclick="cartTracker.updateQuantity('${item.id}', 1)" title="زيادة">+</button>
            </div>

            <span style="font-size: 1.25rem; font-weight: 900; color: #fff; font-family: var(--font-price); min-width: 80px; text-align: left;">
              ${itemTotal} د.أ
            </span>

            <button class="btn-sound" onclick="cartTracker.removeItem('${item.id}')" title="حذف" style="color: var(--primary-red); border-color: rgba(217, 4, 41, 0.3);">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    this.updateSummaryUI();
  }

  updateSummaryUI() {
    const totals = this.calculateTotals();
    const subEl = document.getElementById('cartSubtotal');
    const discEl = document.getElementById('cartDiscount');
    const delivEl = document.getElementById('cartDelivery');
    const totalEl = document.getElementById('cartFinalTotal');
    const calEl = document.getElementById('cartTotalCalories');

    if (subEl) subEl.textContent = `${totals.subtotal} د.أ`;
    if (discEl) discEl.textContent = `-${totals.discount} د.أ`;
    if (delivEl) delivEl.textContent = totals.delivery === '0.00' ? 'مجاني 🎁' : `${totals.delivery} د.أ`;
    if (totalEl) totalEl.textContent = `${totals.total} د.أ`;
    if (calEl) calEl.textContent = `${totals.calories} سعرة`;
  }

  // Live Order Simulator
  startOrderTracking(customerData) {
    if (this.items.length === 0) {
      alert('الرجاء إضافة وجبات إلى السلة أولاً!');
      return;
    }

    foodAudio.playCashRegister();
    const trackerContainer = document.getElementById('orderTrackerContainer');
    if (!trackerContainer) return;

    trackerContainer.style.display = 'block';
    trackerContainer.scrollIntoView({ behavior: 'smooth' });

    const steps = [
      { id: 1, title: 'تم استلام وتأكيد الطلب 🛎️', desc: 'تم إرسال طلبك لمطبخ خلتشي وجاري مراجعته', pct: 15 },
      { id: 2, title: 'الشيف يجهز العجين واللحم 👨‍🍳', desc: 'فرد العجينة الإيطالية وشواء لحم الأنجوس على الصاج', pct: 40 },
      { id: 3, title: 'في الفرن الحجري الساخن 🔥', desc: 'تحمير البيتزا وتذويب الشيدر والموتزاريلا لدرجة القرمشة الذهبية', pct: 65 },
      { id: 4, title: 'الكابتن انطلق بالدليفري 🛵', desc: 'وجبتك ساخنة في طريقها إليك الآن في أسرع وقت', pct: 88 },
      { id: 5, title: 'وصل طلبك إلى الباب بالهناء والشفاء! 🎉', desc: 'استمتع بألذ طعم مع خلتشي خلتشي!', pct: 100 }
    ];

    let currentStepIdx = 0;
    this.isTracking = true;

    const fillBar = document.getElementById('trackerProgressFill');
    const statusTitle = document.getElementById('trackerStatusTitle');
    const statusDesc = document.getElementById('trackerStatusDesc');
    const etaEl = document.getElementById('trackerEta');

    const advanceStep = () => {
      if (currentStepIdx >= steps.length) {
        foodAudio.playCelebration();
        this.clearCart();
        return;
      }

      const st = steps[currentStepIdx];
      if (fillBar) fillBar.style.width = `${st.pct}%`;
      if (statusTitle) statusTitle.textContent = st.title;
      if (statusDesc) statusDesc.textContent = st.desc;
      if (etaEl) etaEl.textContent = `${Math.max(1, 20 - currentStepIdx * 4)} دقائق`;

      // Update node styles
      for (let i = 1; i <= 5; i++) {
        const node = document.getElementById(`trackerNode${i}`);
        if (!node) continue;
        if (i < st.id) {
          node.className = 'tracker-step-node completed';
          node.innerHTML = '<i class="fas fa-check"></i>';
        } else if (i === st.id) {
          node.className = 'tracker-step-node active';
        } else {
          node.className = 'tracker-step-node';
        }
      }

      if (currentStepIdx === 2) foodAudio.startSizzle();
      else if (currentStepIdx === 3) foodAudio.stopSizzle();
      else if (currentStepIdx === 4) foodAudio.playOvenBell();
      else foodAudio.playToppingPop();

      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setTimeout(advanceStep, 4500);
      } else {
        setTimeout(advanceStep, 3000);
      }
    };

    advanceStep();
  }
}

const cartTracker = new CartAndTracker();
document.addEventListener('DOMContentLoaded', () => {
  cartTracker.renderCartUI();
});
