/**
 * خلتشي خلتشي - نظام إدارة الملف الشخصي وتخصيص الأجهزة
 * Khaltchi Khaltchi - User Profile & Device Adaptive Engine
 */

(function () {
  'use strict';

  // قائمة الأسماء المحجوزة افتراضياً لمنع التكرار
  const DEFAULT_RESERVED_NAMES = [
    'حنين', 'حنين عادل', 'شيف حنين', 'الشيف حنين',
    'خلتشي', 'خلتشي خلتشي', 'ادمن', 'admin', 'root',
    'مدير', 'شيف', 'chef', 'احمد', 'محمد', 'عمر', 'رغد', 'يزن'
  ];

  const PROFILE_KEY = 'khaltchi_profile';
  const ALL_USERS_KEY = 'khaltchi_registered_users';

  window.KhaltchiUser = {
    // الحصول على الملف الشخصي الحالي
    getProfile: function () {
      try {
        const raw = localStorage.getItem(PROFILE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.error('Error reading profile:', e);
        return null;
      }
    },

    // حفظ أو تحديث الملف الشخصي
    saveProfile: function (profile) {
      try {
        const current = this.getProfile() || {};
        const updated = Object.assign({}, current, profile, {
          updatedAt: new Date().toISOString()
        });
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));

        // إضافة الاسم إلى قائمة المستخدمين المسجلين
        if (updated.name) {
          this.registerUserName(updated.name);
        }

        return updated;
      } catch (e) {
        console.error('Error saving profile:', e);
        return null;
      }
    },

    // تسجيل اسم مستخدم لمنع تكراره مستقبلاً
    registerUserName: function (name) {
      try {
        const trimmed = (name || '').trim().toLowerCase();
        if (!trimmed) return;
        const users = this.getRegisteredUsers();
        if (!users.includes(trimmed)) {
          users.push(trimmed);
          localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
        }
      } catch (e) {
        console.error('Error registering name:', e);
      }
    },

    // الحصول على جميع الأسماء المسجلة
    getRegisteredUsers: function () {
      try {
        const raw = localStorage.getItem(ALL_USERS_KEY);
        const stored = raw ? JSON.parse(raw) : [];
        const set = new Set([...DEFAULT_RESERVED_NAMES.map(n => n.toLowerCase()), ...stored]);
        return Array.from(set);
      } catch (e) {
        return DEFAULT_RESERVED_NAMES.map(n => n.toLowerCase());
      }
    },

    // التحقق هل الاسم مستخدم بالفعل
    isNameTaken: function (name, currentUserName) {
      if (!name) return false;
      const clean = name.trim().toLowerCase();
      // إذا كان الاسم هو نفس اسم المستخدم الحالي فلا نعتبره مكرراً عليه
      if (currentUserName && clean === currentUserName.trim().toLowerCase()) {
        return false;
      }
      const registered = this.getRegisteredUsers();
      return registered.includes(clean);
    },

    // تحديث نوع الجهاز فورياً وتطبيق الـ CSS الخاص به
    setDevice: function (deviceType) {
      const profile = this.getProfile() || {};
      profile.device = deviceType;
      this.saveProfile(profile);
      this.applyDeviceMode(deviceType);
    },

    // تطبيق سمات وتنسيقات الجهاز على الصفحة
    applyDeviceMode: function (device) {
      if (!device) return;
      
      const validDevices = ['ios', 'android', 'ipad', 'laptop', 'pc'];
      validDevices.forEach(d => document.body.classList.remove('device-' + d));
      document.body.classList.add('device-' + device);
      document.documentElement.setAttribute('data-device', device);

      // إذا كان الجهاز هاتفاً (iOS أو Android): نقفل إمكانية التكبير والتصغير لثبات الشاشة
      if (device === 'ios' || device === 'android') {
        let metaViewport = document.querySelector('meta[name="viewport"]');
        if (!metaViewport) {
          metaViewport = document.createElement('meta');
          metaViewport.name = 'viewport';
          document.head.appendChild(metaViewport);
        }
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }

      // حقن زر القائمة في أعلى اليسار للهواتف
      this.injectMobileControls(device);
    },

    // حقن زر 3 شحطات في أعلى اليسار والقائمة الجانبية للشاشات المحمولة
    injectMobileControls: function (device) {
      // إزالة أي عناصر قديمة إن وجدت لتجنب التكرار
      const existingBtn = document.getElementById('khaltchi-topleft-menu-btn');
      const existingDrawer = document.getElementById('khaltchi-mobile-drawer');
      const existingBottomBar = document.getElementById('khaltchi-ios-bottombar');
      if (existingBtn) existingBtn.remove();
      if (existingDrawer) existingDrawer.remove();
      if (existingBottomBar) existingBottomBar.remove();

      const profile = this.getProfile() || { name: 'زائر مميز', device: device || 'mobile' };
      const avatarSrc = profile.avatar || 'images/chef1.jpg';

      // 1. زر 3 شحطات باليسار فوق في كل الصفحات
      const menuBtn = document.createElement('button');
      menuBtn.id = 'khaltchi-topleft-menu-btn';
      menuBtn.className = 'khaltchi-fixed-menu-trigger';
      menuBtn.setAttribute('aria-label', 'فتح القائمة الرئيسية');
      menuBtn.innerHTML = `
        <span class="khaltchi-burger-lines">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <span class="khaltchi-burger-label">القائمة</span>
      `;
      document.body.appendChild(menuBtn);

      // 2. درج القائمة الجانبية (Mobile Drawer)
      const drawer = document.createElement('div');
      drawer.id = 'khaltchi-mobile-drawer';
      drawer.className = 'khaltchi-drawer-overlay';
      drawer.innerHTML = `
        <div class="khaltchi-drawer-content" dir="rtl">
          <div class="khaltchi-drawer-header">
            <div class="drawer-user-info">
              <img src="${avatarSrc}" alt="صورتي" class="drawer-user-avatar" id="drawerUserAvatar" onerror="this.src='images/chef1.jpg'">
              <div>
                <h4 class="drawer-user-name">${profile.name || 'عميل خلتشي خلتشي'}</h4>
                <span class="drawer-device-tag"><i class="fas ${this.getDeviceIcon(device)}"></i> ${this.getDeviceName(device)} • الأردن 🇯🇴</span>
              </div>
            </div>
            <button class="khaltchi-drawer-close" id="khaltchiDrawerClose" aria-label="إغلاق">&times;</button>
          </div>

          <div class="khaltchi-drawer-body">
            <nav class="drawer-nav-list">
              <a href="index.html" class="drawer-link"><i class="fas fa-home"></i> <span>الرئيسية</span></a>
              <a href="menu.html" class="drawer-link"><i class="fas fa-utensils"></i> <span>قائمة الطعام (280+ طبخة)</span></a>
              <a href="search.html" class="drawer-link"><i class="fas fa-search"></i> <span>البحث الفوري الشامل</span></a>
              <a href="pizza-maker.html" class="drawer-link"><i class="fas fa-pizza-slice"></i> <span>صمم بيتزتك بنفسك</span></a>
              <a href="burger-maker.html" class="drawer-link"><i class="fas fa-burger"></i> <span>صمم برجرك بنفسك</span></a>
              <a href="offers.html" class="drawer-link"><i class="fas fa-gift"></i> <span>العروض وعجلة الحظ (كل 5 أيام)</span></a>
              <a href="cart.html" class="drawer-link"><i class="fas fa-shopping-cart"></i> <span>سلة المشتريات</span></a>
              <a href="profile.html" class="drawer-link highlight-profile"><i class="fas fa-id-card"></i> <span>ملفي الشخصي 👑</span></a>
            </nav>

            <div class="drawer-device-switch">
              <span class="drawer-switch-title">تغيير وضع الجهاز المخصص:</span>
              <div class="device-mini-chips">
                <button type="button" class="mini-chip ${device==='ios'?'active':''}" onclick="KhaltchiUser.setDevice('ios')">🍏 iOS</button>
                <button type="button" class="mini-chip ${device==='android'?'active':''}" onclick="KhaltchiUser.setDevice('android')">🤖 أندرويد</button>
                <button type="button" class="mini-chip ${device==='ipad'?'active':''}" onclick="KhaltchiUser.setDevice('ipad')">📱 آيباد</button>
                <button type="button" class="mini-chip ${device==='laptop'?'active':''}" onclick="KhaltchiUser.setDevice('laptop')">💻 لابتوب</button>
                <button type="button" class="mini-chip ${device==='pc'?'active':''}" onclick="KhaltchiUser.setDevice('pc')">🖥️ بيسي</button>
              </div>
            </div>

            <div class="drawer-footer-note">
              <p>👑 مطعم خلتشي خلتشي بإشراف الشيف <strong>حنين عادل</strong></p>
              <p class="service-pill">خدمة التوصيل السريع داخل الأردن فقط 🇯🇴</p>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);

      // ربط فتح وإغلاق القائمة
      menuBtn.addEventListener('click', function () {
        drawer.classList.add('is-open');
        document.body.classList.add('drawer-locked');
      });

      const closeBtn = drawer.querySelector('#khaltchiDrawerClose');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          drawer.classList.remove('is-open');
          document.body.classList.remove('drawer-locked');
        });
      }

      drawer.addEventListener('click', function (e) {
        if (e.target === drawer) {
          drawer.classList.remove('is-open');
          document.body.classList.remove('drawer-locked');
        }
      });

      // 3. إذا كان الجهاز iOS: إضافة شريط ملاحة سفلي فخم بستايل أبل
      if (device === 'ios') {
        const bottomBar = document.createElement('div');
        bottomBar.id = 'khaltchi-ios-bottombar';
        bottomBar.className = 'khaltchi-ios-bottombar';
        bottomBar.innerHTML = `
          <a href="index.html" class="ios-tab ${location.pathname.endsWith('index.html') || location.pathname === '/' ? 'active' : ''}">
            <i class="fas fa-home"></i>
            <span>الرئيسية</span>
          </a>
          <a href="menu.html" class="ios-tab ${location.pathname.endsWith('menu.html') ? 'active' : ''}">
            <i class="fas fa-utensils"></i>
            <span>المنيو</span>
          </a>
          <a href="search.html" class="ios-tab ${location.pathname.endsWith('search.html') ? 'active' : ''}">
            <i class="fas fa-search"></i>
            <span>بحث</span>
          </a>
          <a href="cart.html" class="ios-tab ${location.pathname.endsWith('cart.html') ? 'active' : ''}">
            <i class="fas fa-shopping-bag"></i>
            <span>السلة</span>
          </a>
          <a href="profile.html" class="ios-tab ${location.pathname.endsWith('profile.html') ? 'active' : ''}">
            <i class="fas fa-user"></i>
            <span>حسابي</span>
          </a>
        `;
        document.body.appendChild(bottomBar);
        document.body.classList.add('has-ios-bar');
      }
    },

    getDeviceIcon: function (d) {
      switch (d) {
        case 'ios': return 'fa-mobile-screen-button';
        case 'android': return 'fa-robot';
        case 'ipad': return 'fa-tablet-screen-button';
        case 'laptop': return 'fa-laptop';
        case 'pc': return 'fa-desktop';
        default: return 'fa-mobile-alt';
      }
    },

    getDeviceName: function (d) {
      switch (d) {
        case 'ios': return 'هاتف iOS (آيفون)';
        case 'android': return 'هاتف Android (أندرويد)';
        case 'ipad': return 'آيباد / تابلت (iPad)';
        case 'laptop': return 'لابتوب (Laptop)';
        case 'pc': return 'كمبيوتر مكتبي (PC)';
        default: return 'هاتف ذكي';
      }
    },

    // تسجيل الخروج ومسح الملف للتجربة من جديد
    logout: function () {
      if (confirm('هل أنت متأكد من تسجيل الخروج وإعادة ضبط البيانات؟')) {
        localStorage.removeItem(PROFILE_KEY);
        window.location.href = 'welcome.html';
      }
    },

    // تحديث شريط التنقل في الصفحة لربط الملف الشخصي
    enhanceNavbar: function () {
      const profile = this.getProfile();
      if (!profile) return;

      const navMenu = document.getElementById('navMenu');
      if (navMenu && !document.getElementById('navProfileItem')) {
        const profileLink = document.createElement('a');
        profileLink.id = 'navProfileItem';
        profileLink.href = 'profile.html';
        profileLink.className = 'nav-link' + (location.pathname.endsWith('profile.html') ? ' active' : '');
        profileLink.innerHTML = `<i class="fas fa-user-circle"></i> الملف الشخصي`;
        navMenu.appendChild(profileLink);
      }

      // إضافة ودجت البروفايل في nav-actions
      const navActions = document.querySelector('.nav-actions');
      if (navActions && !document.getElementById('navUserBadgeBtn')) {
        const userBtn = document.createElement('a');
        userBtn.id = 'navUserBadgeBtn';
        userBtn.href = 'profile.html';
        userBtn.className = 'nav-user-badge-btn';
        userBtn.title = 'ملفي الشخصي';
        const avatar = profile.avatar || 'images/chef1.jpg';
        userBtn.innerHTML = `
          <img src="${avatar}" alt="${profile.name}" class="nav-user-avatar" onerror="this.src='images/chef1.jpg'">
          <span class="nav-user-pill-name">${profile.name || 'حسابي'}</span>
        `;
        navActions.insertBefore(userBtn, navActions.firstChild);
      }
    },

    // التحقق المبدئي عند تحميل أي صفحة
    init: function () {
      const isWelcomePage = location.pathname.endsWith('welcome.html');
      const profile = this.getProfile();

      // إذا لم يكمل تسجيله، وكان في صفحة أخرى، نوجهه لصفحة البداية welcome.html
      if (!isWelcomePage) {
        if (!profile || !profile.name || !profile.device || profile.country !== 'الأردن') {
          window.location.href = 'welcome.html';
          return;
        }
      }

      // إذا كان مسجلاً بالكامل ودخل صفحة welcome.html بالخطأ، نوجهه للرئيسية إلا إذا طلب التعديل
      if (isWelcomePage && profile && profile.name && profile.device && profile.country === 'الأردن') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('reconfigure') !== '1') {
          // يمكنه الدخول أو التحويل
        }
      }

      // تطبيق وضع الجهاز
      if (profile && profile.device) {
        this.applyDeviceMode(profile.device);
      } else {
        // فحص تلقائي بدائي إذا لم يكن مسجلاً بعد
        const ua = navigator.userAgent.toLowerCase();
        let guessed = 'pc';
        if (/iphone|ipod/.test(ua)) guessed = 'ios';
        else if (/ipad/.test(ua)) guessed = 'ipad';
        else if (/android/.test(ua)) guessed = 'android';
        else if (/macintosh|windows|linux/.test(ua) && window.innerWidth < 1200) guessed = 'laptop';
        document.body.classList.add('device-' + guessed);
      }

      // تحسين شريط التنقل
      document.addEventListener('DOMContentLoaded', () => {
        this.enhanceNavbar();
      });
      // تجربة فورية إن كانت الصفحة جاهزة
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        this.enhanceNavbar();
      }
    }
  };

  // تشغيل الفحص والتهيئة فورياً
  window.KhaltchiUser.init();
})();
