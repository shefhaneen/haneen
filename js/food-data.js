// Data Store for Khaltchi Khaltchi (خلتشي خلتشي)
// بإشراف الشيف حنين عادل 👨‍🍳

const FOOD_MENU = [
  // --- BURGERS ---
  {
    id: 'b1',
    category: 'burgers',
    name: 'برجر خلتشي الأسطوري (Double Smash)',
    emoji: '🍔',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    desc: 'شريحتا أنجوس بلاك بيف مشوية على الصاج الساخن مع دبل شيدر إنجليزي ذائب، بصل مكرمل وصوص خلتشي السري في خبز بريوش بالزبدة.',
    price: 6.50,
    calories: 820,
    isSpicy: false,
    isPopular: true,
    rating: 4.9,
    prepTime: '12 دقيقة'
  },
  {
    id: 'b2',
    category: 'burgers',
    name: 'تريبل تشيز برجر فاير (Triple Fire)',
    emoji: '🍔',
    img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80',
    desc: '3 طبقات من لحم البقر الطازج مع فلفل هالبينو حار، صوص سريراتشا حارق، أصابع شيدر مقرمشة وجبنة بيبر جاك.',
    price: 8.00,
    calories: 1050,
    isSpicy: true,
    isPopular: true,
    rating: 4.8,
    prepTime: '15 دقيقة'
  },
  {
    id: 'b3',
    category: 'burgers',
    name: 'برجر ترافل ماشروم ملكي',
    emoji: '🍔',
    img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',
    desc: 'لحم أنجوس فاخر مغطى بفطر الشيتاكي والمشروم الطازج المشوح بزيت الكمأة (Truffle Oil) وجبنة سويسرية وجرجير إيطالي.',
    price: 7.75,
    calories: 780,
    isSpicy: false,
    isPopular: false,
    rating: 4.9,
    prepTime: '14 دقيقة'
  },
  {
    id: 'b4',
    category: 'burgers',
    name: 'سموكي باربيكيو بيكن برجر',
    emoji: '🍔',
    img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80',
    desc: 'بيكون لحم بقري مقرمش مدخن بحطب القيقب، صوص الباربيكيو الغني، حلقات بصل مقلية مقرمشة مع شيدر مدخن.',
    price: 7.25,
    calories: 890,
    isSpicy: false,
    isPopular: true,
    rating: 4.7,
    prepTime: '13 دقيقة'
  },
  {
    id: 'b5',
    category: 'burgers',
    name: 'برجر دجاج كرسبي شيف حنين',
    emoji: '🍔',
    img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80',
    desc: 'صدر دجاج مقلي ومتبل بخلطة الشيف حنين عادل المقرمشة مع كولسلو بارد وجبنة شيدر وصوص رانش.',
    price: 6.00,
    calories: 720,
    isSpicy: false,
    isPopular: true,
    rating: 4.9,
    prepTime: '11 دقيقة'
  },

  // --- PIZZAS ---
  {
    id: 'p1',
    category: 'pizzas',
    name: 'بيتزا خلتشي بيبروني كوين',
    emoji: '🍕',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    desc: 'عجينة حجرية إيطالية مخمرة 48 ساعة، صلصة طماطم سان مارزانو، بحر من جبنة الموتزاريلا الطبيعية وشرائح بيبروني بقري بقرمشة ذهبية.',
    price: 8.50,
    calories: 1120,
    isSpicy: false,
    isPopular: true,
    rating: 5.0,
    prepTime: '16 دقيقة'
  },
  {
    id: 'p2',
    category: 'pizzas',
    name: 'بيتزا باربيكيو تشيكن رانش',
    emoji: '🍕',
    img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80',
    desc: 'قطع دجاج مشوية بنكهة الباربيكيو، بصل أحمر كرسبي، ذرة حلوة، رذاذ صوص الرانش الغني وجبنة موتزاريلا وشيدر.',
    price: 9.00,
    calories: 1180,
    isSpicy: false,
    isPopular: true,
    rating: 4.8,
    prepTime: '15 دقيقة'
  },
  {
    id: 'p3',
    category: 'pizzas',
    name: 'بيتزا الأجبان الأربعة (Quattro Formaggi)',
    emoji: '🍕',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    desc: 'مزيج فاخر من موتزاريلا إيطالية، شيدر كهرماني معتق، جورجونزولا إيطالية معتقة، ورشة جبن البارميزان مع عسل جبلي.',
    price: 9.50,
    calories: 1250,
    isSpicy: false,
    isPopular: false,
    rating: 4.9,
    prepTime: '14 دقيقة'
  },
  {
    id: 'p4',
    category: 'pizzas',
    name: 'بيتزا مارغريتا نابولي الأصلية',
    emoji: '🍕',
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    desc: 'صلصة طماطم سان مارزانو، موتزاريلا بوفالو طازجة، أوراق ريحان خضراء وزيت زيتون بكر فائق الجودة.',
    price: 7.00,
    calories: 890,
    isSpicy: false,
    isPopular: true,
    rating: 4.9,
    prepTime: '12 دقيقة'
  },
  {
    id: 'p5',
    category: 'pizzas',
    name: 'بيتزا ديافولا الحارة بالهالبينو',
    emoji: '🍕',
    img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    desc: 'لمحبي النكهة الحارقة: صوص طماطم حار، بيبروني، سجق لحم حار، هالبينو طازج ورقائق الفلفل الأحمر الحار المطحون.',
    price: 8.75,
    calories: 1090,
    isSpicy: true,
    isPopular: true,
    rating: 4.7,
    prepTime: '15 دقيقة'
  },

  // --- PASTA ---
  {
    id: 'pa1',
    category: 'pasta',
    name: 'باستا كاربونارا ألفريدو كريمية',
    emoji: '🍝',
    img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80',
    desc: 'فتوتشيني فيتوتشيني مع صوص كريمة غني بالثوم، جبنة بارميزان معتقة، قطع دجاج مشوي وفطر سوتيه.',
    price: 6.50,
    calories: 780,
    isSpicy: false,
    isPopular: true,
    rating: 4.9,
    prepTime: '12 دقيقة'
  },
  {
    id: 'pa2',
    category: 'pasta',
    name: 'سباغيتي بولونيز باللحم المفروم',
    emoji: '🍝',
    img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80',
    desc: 'سباغيتي إيطالية كلاسيكية مغطاة بصلصة طماطم مطهوة ببطء مع لحم أنجوس مفروم وأعشاب ريفية.',
    price: 6.25,
    calories: 720,
    isSpicy: false,
    isPopular: true,
    rating: 4.8,
    prepTime: '13 دقيقة'
  },

  // --- SHAWARMA & CRISPY CHICKEN ---
  {
    id: 'c1',
    category: 'chicken',
    name: 'ساندوتش دجاج خلتشي سوبر كرسبي',
    emoji: '🍗',
    img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80',
    desc: 'صدر دجاج مقلي ومتبل بـ 12 بهار سري فائق القرمشة، سلطة كولسلو منزلية، صوص مايونيز بالثوم الحار، في خبز بريوش.',
    price: 6.25,
    calories: 740,
    isSpicy: false,
    isPopular: true,
    rating: 4.9,
    prepTime: '12 دقيقة'
  },
  {
    id: 'c2',
    category: 'chicken',
    name: 'ستربس الدجاج الذهبي (5 قطع مقرمشة)',
    emoji: '🍗',
    img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80',
    desc: 'أصابع دجاج طازجة بدون عظم مقرمشة للغاية تقدم مع صوص هوني موستارد وصوص خلتشي السري.',
    price: 5.50,
    calories: 620,
    isSpicy: false,
    isPopular: true,
    rating: 4.8,
    prepTime: '10 دقائق'
  },
  {
    id: 'c3',
    category: 'chicken',
    name: 'شاورما دجاج إيطالية شيف حنين',
    emoji: '🌯',
    img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80',
    desc: 'شاورما دجاج متبلة بخلطة الشيف حنين عادل مع ثومية كريمية، مخلل خيار وبطاطس مقرمشة داخل خبز صاج محمّر.',
    price: 3.50,
    calories: 540,
    isSpicy: false,
    isPopular: true,
    rating: 5.0,
    prepTime: '8 دقائق'
  },
  {
    id: 'c4',
    category: 'chicken',
    name: 'أجنحة دجاج بافالو الحارة (8 قطع)',
    emoji: '🍗',
    img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&q=80',
    desc: 'أجنحة دجاج مقلية مقرمشة ومغموسة بصلصة بافالو حارة مع صوص الجبنة الزرقاء أو الرانش.',
    price: 5.00,
    calories: 680,
    isSpicy: true,
    isPopular: true,
    rating: 4.7,
    prepTime: '12 دقيقة'
  },

  // --- SIDES & FRIES ---
  {
    id: 's1',
    category: 'sides',
    name: 'لوديد فرايز خلتشي بالجبنة والبيكون',
    emoji: '🍟',
    img: 'https://images.unsplash.com/photo-1578931489007-6c9ece64b89a?w=600&q=80',
    desc: 'بطاطا مقلية مقرمشة مغطاة بصوص جبنة الشيدر السائل الدافئ، قطع بيكون مقرمشة، بصل أخضر وهالبينو.',
    price: 4.25,
    calories: 580,
    isSpicy: false,
    isPopular: true,
    rating: 4.9,
    prepTime: '8 دقائق'
  },
  {
    id: 's2',
    category: 'sides',
    name: 'أصابع الموتزاريلا الذائبة (6 قطع)',
    emoji: '🧀',
    img: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=600&q=80',
    desc: 'أصابع جبنة موتزاريلا بمطاطية خرافية متبلة بالأعشاب الإيطالية تقدم مع صلصة المارينارا الساخنة.',
    price: 4.50,
    calories: 490,
    isSpicy: false,
    isPopular: true,
    rating: 4.8,
    prepTime: '7 دقائق'
  },
  {
    id: 's3',
    category: 'sides',
    name: 'بطاطس مقلية ذهبية كلاسيك',
    emoji: '🍟',
    img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80',
    desc: 'بطاطا مقلية طازجة ومقرمشة مع رشة بهارات خلتشي السرية وكاتشاب.',
    price: 2.00,
    calories: 340,
    isSpicy: false,
    isPopular: false,
    rating: 4.7,
    prepTime: '5 دقائق'
  },

  // --- DRINKS & DESSERTS ---
  {
    id: 'd1',
    category: 'drinks',
    name: 'ميلك شيك كوكيز & كيندر لافا',
    emoji: '🥤',
    img: 'https://images.unsplash.com/photo-1572490122747-3a7652da6aef?w=600&q=80',
    desc: 'شيك غني بالآيس كريم الفانيليا وقطع شوكولاتة كيندر وبسكويت الأوريو مع كريمة مخفوقة وصوص شوكولاتة.',
    price: 3.75,
    calories: 480,
    isSpicy: false,
    isPopular: true,
    rating: 4.9,
    prepTime: '5 دقائق'
  },
  {
    id: 'd2',
    category: 'drinks',
    name: 'موهيتو التوت والليمون المنعش',
    emoji: '🍹',
    img: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80',
    desc: 'موهيتو مثلج بالتوت المنعش مع أوراق النعناع الفريش وشريحة ليمون ومشروب غازي مثلج.',
    price: 3.00,
    calories: 160,
    isSpicy: false,
    isPopular: true,
    rating: 4.8,
    prepTime: '4 دقائق'
  },
  {
    id: 'ds1',
    category: 'dessert',
    name: 'تشيز كيك التوت شيف حنين',
    emoji: '🍰',
    img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
    desc: 'تشيز كيك نيويورك مخبوز بقوام كريمي حريري مغطى بصلصة التوت البري الطازج من إعداد الشيف حنين.',
    price: 4.50,
    calories: 420,
    isSpicy: false,
    isPopular: true,
    rating: 5.0,
    prepTime: '4 دقائق'
  },
  {
    id: 'ds2',
    category: 'dessert',
    name: 'مولتن شوكولاتة لافا ساخن',
    emoji: '🎂',
    img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80',
    desc: 'كيك الشوكولاتة البلجيكية الدافئ مع قلب من الشوكولاتة السائلة الذائبة يقدم مع بولة آيس كريم فانيليا.',
    price: 4.75,
    calories: 520,
    isSpicy: false,
    isPopular: true,
    rating: 4.9,
    prepTime: '8 دقائق'
  }
];

// DATA FOR CUSTOM PIZZA STUDIO
const PIZZA_STUDIO_DATA = {
  crusts: [
    { id: 'thin', name: 'عجينة رقيقة مقرمشة (Thin Crust)', emoji: '🫓', price: 0.00, calories: 500, desc: 'على الطريقة الإيطالية الأصيلة' },
    { id: 'stuffed', name: 'محشية أطراف بالجبنة (Stuffed Crust)', emoji: '🧀', price: 2.00, calories: 750, desc: 'حافة مليئة بالموتزاريلا الذائبة' },
    { id: 'pan', name: 'عجينة مقلاة سميكة وهشة (Pan Crust)', emoji: '🍕', price: 1.00, calories: 650, desc: 'طرية من الداخل ومقرمشة من الخارج' },
    { id: 'chicago', name: 'شيكاغو ديب ديش (Deep Dish)', emoji: '🥧', price: 3.00, calories: 900, desc: 'حوض عجين عميق مليء بالصلصة والجبن' }
  ],
  sauces: [
    { id: 'marinara', name: 'مارينارا سان مارزانو الكلاسيكية', emoji: '🍅', price: 0.00, color: '#c1121f', calories: 60 },
    { id: 'bbq', name: 'صوص الباربيكيو المدخن الفاحم', emoji: '🍯', price: 0.50, color: '#780000', calories: 110 },
    { id: 'ranch', name: 'صوص الرانش الكريمي بالأعشاب', emoji: '🥛', price: 0.75, color: '#fdf0d5', calories: 150 },
    { id: 'pesto', name: 'بيستو الريحان الإيطالي بالصنوبر', emoji: '🌿', price: 1.00, color: '#2d6a4f', calories: 140 },
    { id: 'garlic', name: 'صوص الثوم البارميزان الغني', emoji: '🧄', price: 0.75, color: '#f4e9cd', calories: 160 }
  ],
  cheeses: [
    { id: 'mozzarella', name: 'موتزاريلا طبيعية كلاسيكية', emoji: '🧀', price: 1.50, calories: 250 },
    { id: 'cheddar', name: 'جبنة شيدر حمراء ذائبة', emoji: '🧀', price: 1.75, calories: 280 },
    { id: 'four_cheese', name: 'ميكس الأجبان الأربعة الخارق', emoji: '🧀', price: 2.50, calories: 360 },
    { id: 'vegan', name: 'جبن نباتي خالي من اللاكتوز', emoji: '🌱', price: 2.00, calories: 200 }
  ],
  toppings: [
    { id: 'pepperoni', name: 'بيبروني بقري حلال', emoji: '🥩', price: 1.25, calories: 130 },
    { id: 'chicken', name: 'دجاج مشوي متبل', emoji: '🍗', price: 1.50, calories: 110 },
    { id: 'mushrooms', name: 'فطر طازج مشوح', emoji: '🍄', price: 0.75, calories: 25 },
    { id: 'olives', name: 'زيتون كالاماتا أسود', emoji: '🫒', price: 0.60, calories: 45 },
    { id: 'bellpeppers', name: 'فلفل رومي ملون', emoji: '🫑', price: 0.50, calories: 20 },
    { id: 'onions', name: 'بصل أحمر مكرمل', emoji: '🧅', price: 0.50, calories: 30 },
    { id: 'jalapenos', name: 'هالبينو حار نار', emoji: '🌶️', price: 0.60, calories: 15 },
    { id: 'corn', name: 'ذرة حلوة ذهبية', emoji: '🌽', price: 0.50, calories: 50 },
    { id: 'basil', name: 'أوراق ريحان طازجة', emoji: '🌿', price: 0.50, calories: 10 },
    { id: 'tomatoes', name: 'طماطم كرزية مشوية', emoji: '🍅', price: 0.60, calories: 20 },
    { id: 'sausage', name: 'سجق إيطالي حار', emoji: '🌭', price: 1.50, calories: 140 },
    { id: 'pineapple', name: 'أناناس استوائي مشوي', emoji: '🍍', price: 0.75, calories: 45 }
  ]
};

// DATA FOR BURGER BUILDER LAB
const BURGER_BUILDER_DATA = {
  buns: [
    { id: 'brioche', name: 'خبز بريوش بالزبدة', emoji: '🍞', price: 1.00, calories: 240 },
    { id: 'potato', name: 'خبز البطاطس فائق الطراوة', emoji: '🥔', price: 1.25, calories: 220 },
    { id: 'sesame', name: 'خبز السمسم الكلاسيكي', emoji: '🥯', price: 0.75, calories: 200 },
    { id: 'lettuce_wrap', name: 'غلاف خس صحي (Keto)', emoji: '🥬', price: 0.50, calories: 30 }
  ],
  patties: [
    { id: 'angus', name: 'لحم أنجوس بيف طازج (150غ)', emoji: '🥩', price: 3.50, calories: 350 },
    { id: 'double_beef', name: 'دبل لحم أنجوس (300غ)', emoji: '🥩', price: 5.50, calories: 700 },
    { id: 'crispy_chicken', name: 'صدر دجاج مقرمش سبايسي', emoji: '🍗', price: 3.25, calories: 320 },
    { id: 'grilled_chicken', name: 'دجاج مشوي على الفحم', emoji: '🍗', price: 3.00, calories: 240 },
    { id: 'veggie', name: 'برجر نباتي ومشروم بورتوبيلو', emoji: '🍄', price: 3.00, calories: 210 }
  ],
  cheeses: [
    { id: 'cheddar', name: 'شيدر إنجليزي ذائب', emoji: '🧀', price: 0.75, calories: 110 },
    { id: 'swiss', name: 'جبنة سويسرية', emoji: '🧀', price: 0.90, calories: 105 },
    { id: 'pepperjack', name: 'بيبر جاك حار', emoji: '🧀', price: 0.85, calories: 115 },
    { id: 'none', name: 'بدون جبنة', emoji: '🚫', price: 0.00, calories: 0 }
  ],
  sauces: [
    { id: 'khaltchi_sauce', name: 'صوص خلتشي السري الخاص', emoji: '✨', price: 0.50, calories: 90 },
    { id: 'truffle_mayo', name: 'مايونيز الترافل الفاخر', emoji: '🍄', price: 0.75, calories: 120 },
    { id: 'spicy_sriracha', name: 'صوص سريراتشا الحارق', emoji: '🔥', price: 0.50, calories: 70 },
    { id: 'smoky_bbq', name: 'باربيكيو مدخن', emoji: '🍖', price: 0.40, calories: 80 }
  ],
  extras: [
    { id: 'bacon', name: 'بيكون بقري مقرمش', emoji: '🥓', price: 1.25, calories: 90 },
    { id: 'caramelized_onions', name: 'بصل مكرمل ذهبي', emoji: '🧅', price: 0.60, calories: 50 },
    { id: 'pickles', name: 'خيار مخلل مقرمش', emoji: '🥒', price: 0.40, calories: 15 },
    { id: 'lettuce', name: 'خس أمريكي فريش', emoji: '🥬', price: 0.30, calories: 10 },
    { id: 'tomatoes', name: 'شرائح طماطم طازجة', emoji: '🍅', price: 0.40, calories: 15 },
    { id: 'onion_rings', name: 'حلقات بصل مقلية داخل البرجر', emoji: '🧅', price: 0.80, calories: 95 },
    { id: 'fried_egg', name: 'بيض مقلي عيون (Sunny Side)', emoji: '🍳', price: 0.80, calories: 85 }
  ]
};

// DISCOUNTS & PROMO CODES
const PROMO_CODES = {
  'KHALTCHI50': { discountPercent: 50, desc: 'خصم 50% كود خلتشي الملكي' },
  'FREEPIZZA': { discountFixed: 8.50, minSubtotal: 15, desc: 'خصم قيمة بيتزا بيبروني مجانية للطلبات فوق 15 د.أ' },
  'BURGERLOVER': { discountPercent: 25, desc: 'خصم 25% على الطلب' },
  'WELCOME': { discountPercent: 15, desc: 'خصم ترحيبي 15%' },
  'FREESHAKE': { discountFixed: 3.75, desc: 'خصم قيمة ميلك شيك مجاني' },
  'FREEMOZZ': { discountFixed: 4.50, desc: 'خصم قيمة أصابع موتزاريلا مجانية' },
  'FREEFRIES': { discountFixed: 4.25, desc: 'خصم قيمة بطاطا لوديد مجانية' }
};

// LUCKY WHEEL PRIZES
const WHEEL_PRIZES = [
  { text: 'خصم 50%', code: 'KHALTCHI50', color: '#d90429' },
  { text: 'بيتزا مجانية', code: 'FREEPIZZA', color: '#ffb703' },
  { text: 'خصم 25%', code: 'BURGERLOVER', color: '#ff5722' },
  { text: 'ميلك شيك مجاني', code: 'FREESHAKE', color: '#2ec4b6' },
  { text: 'أصابع موتزاريلا', code: 'FREEMOZZ', color: '#fb8500' },
  { text: 'خصم 15%', code: 'WELCOME', color: '#6a040f' },
  { text: 'بطاطا لوديد مجانية', code: 'FREEFRIES', color: '#3a86ff' },
  { text: 'حظاً أوفر غداً', code: null, color: '#4a4e69' }
];

window.FOOD_MENU = FOOD_MENU;
window.PIZZA_STUDIO_DATA = PIZZA_STUDIO_DATA;
window.BURGER_BUILDER_DATA = BURGER_BUILDER_DATA;
window.PROMO_CODES = PROMO_CODES;
window.WHEEL_PRIZES = WHEEL_PRIZES;
