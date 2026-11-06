// ============================================================
// KHATALCHI KHALTCHI — CUSTOMIZER & ORDER ENGINE
// بإشراف ومطبخ الشيف حنين عادل 👨‍🍳
// ============================================================

// Global cart helper: handles adding items smoothly to localStorage
function addKhaltchiCartItem(item) {
  try {
    const storedCart = JSON.parse(localStorage.getItem('khaltchi_cart') || '[]');
    if (!Array.isArray(storedCart)) throw new Error('بيانات السلة غير صالحة');
    const cart = storedCart.map(cartItem => {
      const { quantity: legacyQuantity, calories: legacyCalories, ...normalizedItem } = cartItem;
      const quantity = Number(cartItem.qty ?? legacyQuantity ?? 1);
      const price = Number(cartItem.price);
      if (!Number.isSafeInteger(quantity) || quantity < 1 || !Number.isFinite(price) || price < 0) {
        throw new Error('يوجد عنصر ببيانات غير صالحة في السلة');
      }
      return { ...normalizedItem, qty: quantity, price: Math.round(price * 100) / 100, cal: Number(cartItem.cal ?? legacyCalories ?? 0) || 0 };
    });
    const price = Number(item.price);
    const quantity = Number(item.qty ?? 1);
    if (!item.id || !item.name || !Number.isFinite(price) || price < 0 || !Number.isSafeInteger(quantity) || quantity < 1) {
      throw new Error('بيانات السعر أو الكمية غير صالحة');
    }
    const normalizedItem = {
      id: item.id,
      name: item.name,
      emoji: item.emoji || '🍽️',
      img: item.img || '',
      price: Math.round(price * 100) / 100,
      cal: Number(item.cal ?? item.calories ?? 0) || 0,
      qty: quantity,
      desc: item.desc || ''
    };
    const existing = cart.find(c => c.id === normalizedItem.id);
    if (existing) {
      existing.qty += normalizedItem.qty;
    } else {
      cart.push(normalizedItem);
    }
    localStorage.setItem('khaltchi_cart', JSON.stringify(cart));
    updateAllCartBadges();
    showKhaltchiToast((normalizedItem.emoji || '🍽️') + ' تمت إضافة "' + normalizedItem.name + '" إلى السلة بنجاح!');
    
    // Play sound if available
    if (window.foodAudio && typeof foodAudio.playToppingPop === 'function') {
      foodAudio.playToppingPop();
    }
    
    // Trigger confetti
    triggerCelebrationParticles();
    return true;
  } catch(e) {
    console.error('تعذر تحديث السلة:', e);
    showKhaltchiToast('تعذر إضافة الوجبة. تحقق من بيانات السلة وحاول مجدداً.');
    return false;
  }
}

// Update all navbar badges across the page
function updateAllCartBadges() {
  try {
    const cart = JSON.parse(localStorage.getItem('khaltchi_cart') || '[]');
    if (!Array.isArray(cart)) throw new Error('بيانات السلة غير صالحة');
    const totalCount = cart.reduce((sum, item) => sum + Number(item.qty ?? item.quantity ?? 1), 0);
    document.querySelectorAll('.cart-count, .cart-count-badge, #navCartCount').forEach(badge => {
      badge.textContent = totalCount;
    });
  } catch(e) {
    console.error('تعذر تحديث عدد عناصر السلة:', e);
  }
}

// Toast notification
function showKhaltchiToast(msg) {
  let toast = document.getElementById('khaltchiGlobalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'khaltchiGlobalToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: linear-gradient(135deg, #d90429, #ff5722);
      color: #fff;
      padding: 13px 26px;
      border-radius: 30px;
      font-family: 'Cairo', sans-serif;
      font-weight: 800;
      font-size: 0.95rem;
      z-index: 100000;
      box-shadow: 0 10px 30px rgba(217, 4, 41, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.25);
      transition: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      opacity: 0;
      pointer-events: none;
      direction: rtl;
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle" style="color:#ffb703;"></i> ` + msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  
  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(80px)';
  }, 3200);
}

// Confetti effect
function triggerCelebrationParticles() {
  const emojis = ['🍔', '🍕', '✨', '🔥', '🧀', '🎉', '🌟', '🌶️'];
  for (let i = 0; i < 14; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: -30px;
        font-size: ${1.2 + Math.random() * 0.9}rem;
        z-index: 99999;
        pointer-events: none;
        animation: dropCelebration 2.2s linear forwards;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2300);
    }, i * 65);
  }
}

// Normal 1-Click Order
function orderNormalItem(itemData) {
  let item = typeof itemData === 'string' ? JSON.parse(itemData) : itemData;
  addKhaltchiCartItem({
    id: item.id,
    name: item.name,
    emoji: item.emoji,
    img: item.img,
    price: item.price,
    cal: item.cal || item.calories,
    qty: 1,
    desc: item.desc
  });
}

// CUSTOMIZE MODAL ENGINE (على ذوقك)
let currentCustomItem = null;

function openCustomizeModal(itemData) {
  let item = typeof itemData === 'string' ? JSON.parse(itemData) : itemData;
  currentCustomItem = item;
  
  let modal = document.getElementById('khaltchiCustomizeModal');
  if (!modal) {
    createCustomizeModalDOM();
    modal = document.getElementById('khaltchiCustomizeModal');
  }
  
  // Fill data
  document.getElementById('cstItemImg').src = item.img || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80';
  document.getElementById('cstItemName').textContent = item.name;
  document.getElementById('cstItemDesc').textContent = item.desc || '';
  document.getElementById('cstBasePriceDisplay').textContent = parseFloat(item.price).toFixed(2);
  
  // Reset fields
  document.querySelector('input[name="cstMealSize"][value="normal"]').checked = true;
  document.querySelector('input[name="cstSpiceLevel"][value="mild"]').checked = true;
  document.querySelectorAll('.cst-addon-check').forEach(c => c.checked = false);
  document.querySelectorAll('.cst-exclude-check').forEach(c => c.checked = false);
  document.getElementById('cstNotesInput').value = '';
  
  // Check if item is burger or pizza to show direct 3D builder link
  const isBurger = item.category === 'burgers' || item.category === 'برجر';
  const isPizza = item.category === 'pizzas' || item.category === 'بيتزا';
  const studioBtn = document.getElementById('cstStudioRedirectBtn');
  if (isBurger) {
    studioBtn.style.display = 'inline-flex';
    studioBtn.href = 'burger-maker.html';
    studioBtn.innerHTML = '<i class="fas fa-layer-group"></i> أو افتح مختبر البرجر بالطبقات';
  } else if (isPizza) {
    studioBtn.style.display = 'inline-flex';
    studioBtn.href = 'pizza-maker.html';
    studioBtn.innerHTML = '<i class="fas fa-pizza-slice"></i> أو افتح ستوديو البيتزا على الفحم';
  } else {
    studioBtn.style.display = 'none';
  }
  
  updateCustomizePrice();
  
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('active'), 10);
  document.body.style.overflow = 'hidden';
}

function closeCustomizeModal() {
  const modal = document.getElementById('khaltchiCustomizeModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 250);
  }
}

// Calculate dynamic customized price
function updateCustomizePrice() {
  if (!currentCustomItem) return;
  let base = parseFloat(currentCustomItem.price);
  
  // Size
  const sizeVal = document.querySelector('input[name="cstMealSize"]:checked')?.value || 'normal';
  if (sizeVal === 'large') base += 1.00;
  if (sizeVal === 'combo') base += 1.75;
  
  // Addons
  document.querySelectorAll('.cst-addon-check:checked').forEach(cb => {
    base += parseFloat(cb.dataset.price || 0);
  });
  
  document.getElementById('cstFinalPriceBtn').textContent = base.toFixed(2);
}

// Confirm customized order
function confirmCustomizedOrder() {
  if (!currentCustomItem) return;
  
  const sizeVal = document.querySelector('input[name="cstMealSize"]:checked')?.value || 'normal';
  const sizeLabels = {
    normal: 'حجم عادي',
    large: 'حجم كبير (+1.00 د.أ)',
    combo: 'وجبة كومبو كاملة مع بطاطس ومشروب (+1.75 د.أ)'
  };
  
  const spiceVal = document.querySelector('input[name="cstSpiceLevel"]:checked')?.value || 'mild';
  const spiceLabels = {
    mild: 'عادي 🌿',
    medium: 'سبايسي وسط 🌶️',
    fire: 'حار نااار 🔥'
  };
  
  const addons = [];
  document.querySelectorAll('.cst-addon-check:checked').forEach(cb => {
    addons.push(cb.dataset.name);
  });
  
  const excludes = [];
  document.querySelectorAll('.cst-exclude-check:checked').forEach(cb => {
    excludes.push(cb.dataset.name);
  });
  
  const notes = document.getElementById('cstNotesInput').value.trim();
  const finalPrice = parseFloat(document.getElementById('cstFinalPriceBtn').textContent);
  
  // Build customized description
  let descParts = [sizeLabels[sizeVal], 'حرارة: ' + spiceLabels[spiceVal]];
  if (addons.length > 0) descParts.push('إضافات: ' + addons.join('، '));
  if (excludes.length > 0) descParts.push('بدون: ' + excludes.join('، '));
  if (notes) descParts.push('ملاحظة للشيف: ' + notes);
  
  const customId = currentCustomItem.id + '_custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  
  addKhaltchiCartItem({
    id: customId,
    name: currentCustomItem.name + ' (على ذوقك ✨)',
    emoji: currentCustomItem.emoji || '✨',
    img: currentCustomItem.img,
    price: finalPrice,
    cal: (currentCustomItem.cal || currentCustomItem.calories || 500) + (sizeVal === 'combo' ? 350 : 0),
    qty: 1,
    desc: descParts.join(' • ')
  });
  
  closeCustomizeModal();
}

// Build the Modal DOM structure
function createCustomizeModalDOM() {
  const modal = document.createElement('div');
  modal.id = 'khaltchiCustomizeModal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 100001;
    background: rgba(10, 12, 16, 0.88);
    backdrop-filter: blur(12px);
    align-items: center;
    justify-content: center;
    padding: 16px;
    direction: rtl;
    opacity: 0;
    transition: opacity 0.25s ease;
  `;
  
  modal.innerHTML = `
    <div style="
      background: #151a24;
      border: 1px solid rgba(255, 183, 3, 0.3);
      box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(255, 87, 34, 0.15);
      border-radius: 24px;
      max-width: 620px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      color: #fff;
      font-family: 'Cairo', sans-serif;
      position: relative;
    " onclick="event.stopPropagation()">
      
      <!-- Close button -->
      <button onclick="closeCustomizeModal()" style="
        position: absolute;
        top: 14px;
        left: 14px;
        background: rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.2);
        color: #fff;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        font-size: 1rem;
        transition: 0.2s;
      " onmouseover="this.style.background='#d90429'" onmouseout="this.style.background='rgba(0,0,0,0.5)'">
        <i class="fas fa-times"></i>
      </button>
      
      <!-- Top Dish Banner -->
      <div style="position: relative; height: 180px; overflow: hidden; border-radius: 24px 24px 0 0;">
        <img id="cstItemImg" src="" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, #151a24 0%, transparent 80%);"></div>
        <div style="position: absolute; bottom: 12px; right: 18px;">
          <span style="background: rgba(255, 183, 3, 0.2); color: #ffb703; border: 1px solid rgba(255, 183, 3, 0.4); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800;">
            👩‍🍳 بإشراف الشيف حنين عادل
          </span>
          <h2 id="cstItemName" style="font-size: 1.4rem; font-weight: 900; margin-top: 4px; text-shadow: 0 2px 8px rgba(0,0,0,0.8);"></h2>
        </div>
      </div>
      
      <!-- Modal Body -->
      <div style="padding: 18px 22px 24px;">
        <p id="cstItemDesc" style="color: rgba(255,255,255,0.65); font-size: 0.85rem; line-height: 1.5; margin-bottom: 18px;"></p>
        <div style="color: #ffb703; font-size: 0.85rem; font-weight: 800; margin: -10px 0 18px;">
          السعر الأساسي: <span id="cstBasePriceDisplay">0.00</span> د.أ
        </div>
        
        <!-- SECTION 1: Size & Combo -->
        <div style="margin-bottom: 20px; background: #1c2230; padding: 14px 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);">
          <div style="font-size: 0.95rem; font-weight: 800; color: #ffb703; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-expand-alt"></i> 1. اختر الحجم أو الوجبة
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px;">
            <label style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.82rem;">
              <input type="radio" name="cstMealSize" value="normal" checked onchange="updateCustomizePrice()" />
              <span>فردي عادي (+0.00 د.أ)</span>
            </label>
            <label style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.82rem;">
              <input type="radio" name="cstMealSize" value="large" onchange="updateCustomizePrice()" />
              <span>حجم لارج (+1.00 د.أ)</span>
            </label>
            <label style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.82rem;">
              <input type="radio" name="cstMealSize" value="combo" onchange="updateCustomizePrice()" />
              <span style="color: #ffb703; font-weight: 700;">وجبة كومبو كاملة (+1.75 د.أ)</span>
            </label>
          </div>
        </div>
        
        <!-- SECTION 2: Spice Level -->
        <div style="margin-bottom: 20px; background: #1c2230; padding: 14px 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);">
          <div style="font-size: 0.95rem; font-weight: 800; color: #ff5722; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-pepper-hot"></i> 2. درجة الحدوقية (السبايسي)
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <label style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 8px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem;">
              <input type="radio" name="cstSpiceLevel" value="mild" checked />
              <span>عادي ولطيف 🌿</span>
            </label>
            <label style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 8px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem;">
              <input type="radio" name="cstSpiceLevel" value="medium" />
              <span>حار وسط 🌶️</span>
            </label>
            <label style="background: rgba(217, 4, 41, 0.15); border: 1px solid var(--primary-red); border-radius: 12px; padding: 8px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem;">
              <input type="radio" name="cstSpiceLevel" value="fire" />
              <span style="color: #ff4d6d; font-weight: 800;">حار نااار 🔥🔥</span>
            </label>
          </div>
        </div>
        
        <!-- SECTION 3: Custom Add-ons -->
        <div style="margin-bottom: 20px; background: #1c2230; padding: 14px 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);">
          <div style="font-size: 0.95rem; font-weight: 800; color: #ffb703; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-plus-circle"></i> 3. إضافات على ذوقك (اختر ما تشتهي)
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px;">
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-addon-check" data-price="0.50" data-name="دبل شيدر ذائبة" onchange="updateCustomizePrice()" />
              <span>🧀 دبل شيدر (+0.50 د.أ)</span>
            </label>
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-addon-check" data-price="0.75" data-name="بيكون بقري مدخن" onchange="updateCustomizePrice()" />
              <span>🥓 بيكون مدخن (+0.75 د.أ)</span>
            </label>
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-addon-check" data-price="0.35" data-name="بصل مكرمل ذهبي" onchange="updateCustomizePrice()" />
              <span>🧅 بصل مكرمل (+0.35 د.أ)</span>
            </label>
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-addon-check" data-price="0.50" data-name="مشروم مشوح بالزبدة" onchange="updateCustomizePrice()" />
              <span>🍄 مشروم مشوح (+0.50 د.أ)</span>
            </label>
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-addon-check" data-price="0.30" data-name="صوص خلتشي السري" onchange="updateCustomizePrice()" />
              <span>✨ صوص خلتشي (+0.30 د.أ)</span>
            </label>
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-addon-check" data-price="0.25" data-name="شرائح هالبينو" onchange="updateCustomizePrice()" />
              <span>🌶️ هالبينو حار (+0.25 د.أ)</span>
            </label>
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-addon-check" data-price="0.40" data-name="بيض مقلي عيون" onchange="updateCustomizePrice()" />
              <span>🍳 بيض عيون (+0.40 د.أ)</span>
            </label>
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-addon-check" data-price="0.60" data-name="أفوكادو كريمي" onchange="updateCustomizePrice()" />
              <span>🥑 أفوكادو فريش (+0.60 د.أ)</span>
            </label>
          </div>
        </div>
        
        <!-- SECTION 4: Exclusions -->
        <div style="margin-bottom: 20px; background: #1c2230; padding: 14px 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);">
          <div style="font-size: 0.95rem; font-weight: 800; color: #c5cbd8; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-ban"></i> 4. مكونات بدك نشيلها؟
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 6px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-exclude-check" data-name="بدون بصل" />
              <span>بدون بصل 🧅</span>
            </label>
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 6px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-exclude-check" data-name="بدون مخلل" />
              <span>بدون مخلل 🥒</span>
            </label>
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 6px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-exclude-check" data-name="بدون طماطم" />
              <span>بدون طماطم 🍅</span>
            </label>
            <label style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 6px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
              <input type="checkbox" class="cst-exclude-check" data-name="الصوص على جنب" />
              <span>الصوص على جنب 🥣</span>
            </label>
          </div>
        </div>
        
        <!-- SECTION 5: Notes to Chef Haneen -->
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #ffb703; margin-bottom: 6px;">
            <i class="fas fa-comment-dots"></i> ملاحظات خاصة للشيفة حنين عادل:
          </label>
          <input type="text" id="cstNotesInput" placeholder="مثال: خبز محمص زيادة، قرمشة عالية، إلخ..." style="
            width: 100%;
            background: #1c2230;
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 12px;
            padding: 10px 14px;
            color: #fff;
            font-family: 'Cairo', sans-serif;
            font-size: 0.88rem;
            outline: none;
            transition: 0.3s;
          " onfocus="this.style.borderColor='#ffb703'" onblur="this.style.borderColor='rgba(255,255,255,0.12)'" />
        </div>
        
        <!-- Actions & Price Footer -->
        <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
          <a id="cstStudioRedirectBtn" href="#" style="
            color: #ffb703;
            text-decoration: none;
            font-size: 0.82rem;
            font-weight: 700;
            display: none;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            background: rgba(255,183,3,0.1);
            border-radius: 10px;
            border: 1px solid rgba(255,183,3,0.25);
          "></a>
          
          <button onclick="confirmCustomizedOrder()" style="
            flex: 1;
            min-width: 220px;
            background: linear-gradient(135deg, #d90429, #ff5722);
            color: #fff;
            border: none;
            border-radius: 14px;
            padding: 14px 20px;
            font-family: 'Cairo', sans-serif;
            font-size: 1rem;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(217, 4, 41, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: 0.25s;
          " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform=''">
            <i class="fas fa-magic"></i>
            <span>أضف للسلة على ذوقي</span>
            <span>(<span id="cstFinalPriceBtn">0.00</span> د.أ)</span>
          </button>
        </div>
        
      </div>
    </div>
  `;
  
  modal.onclick = (e) => {
    if (e.target === modal) closeCustomizeModal();
  };
  
  document.body.appendChild(modal);
}

// 5-DAY LUCKY SPIN WHEEL CONTROLLER
// Checks whether the user can spin the wheel, enforces 5-day lock with countdown
function setup5DaySpinWheel(buttonEl, messageEl, onSpinSuccess) {
  const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
  
  function checkCooldown() {
    const lastSpin = localStorage.getItem('khaltchi_last_spin');
    const now = Date.now();
    
    if (lastSpin && (now - parseInt(lastSpin)) < FIVE_DAYS_MS) {
      const remaining = FIVE_DAYS_MS - (now - parseInt(lastSpin));
      const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const mins = Math.floor((remaining % (60 * 60 * 1000)) / 60000);
      
      if (buttonEl) {
        buttonEl.disabled = true;
        buttonEl.style.opacity = '0.55';
        buttonEl.style.cursor = 'not-allowed';
        buttonEl.title = `عجلة الحظ مقفولة — متبقي ${days} يوم و ${hours} ساعة`;
      }
      
      if (messageEl) {
        messageEl.innerHTML = `
          <div style="background: rgba(255, 87, 34, 0.12); border: 1px solid rgba(255, 87, 34, 0.3); border-radius: 12px; padding: 10px 16px; margin-top: 12px; font-size: 0.85rem; color: #fff;">
            ⏳ <strong style="color: #ffb703;">عجلة الحظ متاحة مرة كل 5 أيام!</strong><br>
            يمكنك الدوران مرة أخرى بعد: <strong>${days} يوم و ${hours} ساعة و ${mins} دقيقة</strong>
          </div>
        `;
      }
      return false;
    } else {
      if (buttonEl) {
        buttonEl.disabled = false;
        buttonEl.style.opacity = '1';
        buttonEl.style.cursor = 'pointer';
      }
      if (messageEl && lastSpin) {
        messageEl.innerHTML = `
          <div style="background: rgba(46, 196, 182, 0.15); border: 1px solid #2ec4b6; border-radius: 12px; padding: 8px 16px; margin-top: 10px; font-size: 0.85rem; color: #2ec4b6;">
            ✨ العجلة جاهزة للدوران الآن! جرب حظك!
          </div>
        `;
      }
      return true;
    }
  }
  
  // Initial check
  checkCooldown();
  // Timer check every 30s
  setInterval(checkCooldown, 30000);
  
  return {
    canSpin: checkCooldown,
    recordSpin: function() {
      localStorage.setItem('khaltchi_last_spin', Date.now().toString());
      checkCooldown();
    }
  };
}

// Add animation css for celebration
const animStyle = document.createElement('style');
animStyle.textContent = `
  @keyframes dropCelebration {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
  }
  #khaltchiCustomizeModal.active {
    opacity: 1 !important;
  }
`;
document.head.appendChild(animStyle);

// Auto-init cart badge on DOM load
document.addEventListener('DOMContentLoaded', updateAllCartBadges);
