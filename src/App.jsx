import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, Package, DollarSign, Plus, Trash2, 
  Languages, Calendar, Search, CheckCircle, Menu, X, Brain, 
  Home, Download, ShieldAlert, Smartphone, User, Camera, RefreshCw
} from 'lucide-react';

// 1. LANGUAGES & TRANSLATIONS DICTIONARY (6 Languages)
const TRANSLATIONS = {
  ti: {
    title: 'ካሽ ትራክ', revenue: 'ኣታዊ', profit: 'ረብሓ', stock: 'ንብረት', 
    addSale: 'ሽያጭ መዝግብ', addItem: 'ንብረት ወስኽ', itemName: 'ስም ፍርያት',
    price: 'ዋጋ', quantity: 'ብዝሒ', search: 'በዚ ፈልግ...', noData: 'መዝገብ የለን።',
    buyingPrice: 'ናይ መግዝኢ ዋጋ', sellingPrice: 'ናይ መሸጢ ዋጋ', selectItem: '-- ፍርያት ሕረፅ --',
    paymentTitle: 'ናይ ኣባልነት ክፍሊት', premiumMsg: 'እዛ ኣፕ ንምጥቃም በጃኹም ክፍሊት ፈጽሙ።',
    txInput: 'Transaction ID የእትው', submitTx: 'መታወቂያ ስደድ', active: 'ንጡፍ',
    aiBtn: 'ብ AI መርምር', downloadReport: 'ጸብጻብ ኣውርድ', scanBarcode: 'ባርኮድ ስካን ግበር',
    installApp: 'ኣብ ቴሌፎን ጽዓን', history: 'ታሪኽ ጸብጻባት', profile: 'ፕሮፋይል'
  },
  en: {
    title: 'Cash Track', revenue: 'Revenue', profit: 'Profit', stock: 'Inventory',
    addSale: 'Record Sale', addItem: 'Add Product', itemName: 'Product Name',
    price: 'Price', quantity: 'Quantity', search: 'Search...', noData: 'No records found.',
    buyingPrice: 'Cost Price', sellingPrice: 'Sale Price', selectItem: '-- Select Product --',
    paymentTitle: 'Subscription Payment', premiumMsg: 'Please pay to activate your premium access.',
    txInput: 'Enter Transaction ID', submitTx: 'Submit TXID', active: 'Active',
    aiBtn: 'AI Analyze', downloadReport: 'Download Report', scanBarcode: 'Scan Barcode',
    installApp: 'Install App', history: 'History Logs', profile: 'Profile'
  },
  am: {
    title: 'ካሽ ትራክ', revenue: 'አጠቃላይ ገቢ', profit: 'ትርፍ', stock: 'ዕቃዎች',
    addSale: 'ሽያጭ መዝግብ', addItem: 'ዕቃ ጨምር', itemName: 'የዕቃ ስም',
    price: 'ዋጋ', quantity: 'ብዛት', search: 'ፈልግ...', noData: 'ምንም መረጃ የለም።',
    buyingPrice: 'የመግዣ ዋጋ', sellingPrice: 'የመሸጫ ዋጋ', selectItem: '-- ዕቃ ምረጥ --',
    paymentTitle: 'የደንበኝነት ክፍያ', premiumMsg: 'እባክዎ መተግበሪያውን ለመጠቀም ክፍያ ይፈጽሙ።',
    txInput: 'የግብይት መታወቂያ (TXID) አስገባ', submitTx: 'መታወቂያ ላክ', active: 'ንቁ',
    aiBtn: 'በ AI መርምር', downloadReport: 'ሪፖርት አውርድ', scanBarcode: 'ባርኮድ ስካን አድርግ',
    installApp: 'ስልክ ላይ ጫን', history: 'የቀደሙ ሪፖርቶች', profile: 'ፕሮፋይል'
  },
  lg: {
    title: 'Cash Track', revenue: 'Sente Ziyingidde', profit: 'Magoba', stock: 'Ebyamaguzi',
    addSale: 'Wandiika Ezisale', addItem: 'Yongeramu Ekintu', itemName: 'Erinnya ly\'ekintu',
    price: 'Omuwendo', quantity: 'Obungi', search: 'Noonya...', noData: 'Waliwo tewali bikwataho.',
    buyingPrice: 'Omuwendo Ogw\'okugula', sellingPrice: 'Omuwendo Ogw\'okutunda', selectItem: '-- Londa Ekyamaguzi --',
    paymentTitle: 'Okusasula Okwenyunga', premiumMsg: 'Ssaako sente okusobola okweyambisa app eno.',
    txInput: 'Ingiza Transaction ID', submitTx: ' weereza TXID', active: 'Okukola',
    aiBtn: 'AI Kebera', downloadReport: 'Ggulawo Ripoota', scanBarcode: 'Sikaaninga Barcode',
    installApp: 'Teeka ku Ssimu', history: 'Ebyafaayo Byffe', profile: 'Ebikwata ku Ggwe'
  },
  sw: {
    title: 'Cash Track', revenue: 'Mapato', profit: 'Faida', stock: 'Bidhaa',
    addSale: 'Rekodi Mauzo', addItem: 'Weka Bidhaa', itemName: 'Jina la Bidhaa',
    price: 'Bei', quantity: 'Idadi', search: 'Tafuta...', noData: 'Hakuna rekodi zilizopatikana.',
    buyingPrice: 'Bei ya Kununua', sellingPrice: 'Bei ya Kuuza', selectItem: '-- Chagua Bidhaa --',
    paymentTitle: 'Malipo ya Usajili', premiumMsg: 'Tafadhali lipia ili uweze kutumia huduma zote.',
    txInput: 'Weka ID ya Muamala', submitTx: 'Tuma TXID', active: 'Inafanya kazi',
    aiBtn: 'Uchambuzi wa AI', downloadReport: 'Pakua Ripoti', scanBarcode: 'Skani Barcode',
    installApp: 'Weka kwenye Simu', history: 'Kumbukumbu', profile: 'Wasifu'
  },
  ar: {
    title: 'كاش تراك', revenue: 'إجمالي الإيرادات', profit: 'صافي الأرباح', stock: 'المخزون',
    addSale: 'تسجيل بيع', addItem: 'إضافة منتج', itemName: 'اسم المنتج',
    price: 'السعر', quantity: 'الكمية', search: 'بحث...', noData: 'لا توجد سجلات اليوم.',
    buyingPrice: 'سعر الشراء', sellingPrice: 'سعر البيع', selectItem: '-- اختر المنتج --',
    paymentTitle: 'دفع الاشتراك', premiumMsg: 'يرجى الدفع لتفعيل الحساب المميز الخاص بك.',
    txInput: 'أدخل رقم المعاملة', submitTx: 'إرسال الرقم', active: 'نشط',
    aiBtn: 'تحليل الذكاء الاصطناعي', downloadReport: 'تحميل التقرير', scanBarcode: 'مسح الباركود',
    installApp: 'تثبيت التطبيق', history: 'سجل التقارير', profile: 'الملف الشخصي'
  }
};

// 2. CURRENCIES & BUSINESS TYPES
const CURRENCIES = { UGX: 'UGX', USD: '$', KSH: 'KSH', EURO: '€', ERN: 'Nfa' };

const BUSINESS_TYPES = {
  ti: ['ሳሎን (Saloon)', 'ሱፐርማርኬት', 'ሚኒ ማርኬት', 'ባር (Bar)', 'ቤት መግቢ (Restaurant)', 'ስቱዲዮ (Videography)', 'ዱኳን (Shop)', 'ሆስፒታል', 'ፋርማሲ', 'ካልእ ቢዝነስ'],
  en: ['Saloon', 'Supermarket', 'Mini Market', 'Bar', 'Restaurant', 'Studio (Videography)', 'Retail Shop', 'Hospital', 'Pharmacy', 'Other Business'],
  am: ['ሳሎን', 'ሱፐርማርኬት', 'ሚኒ ማርኬት', 'ባር', 'ሬስቶራንት', 'ቪዲዮ ስቱዲዮ', 'ሱቅ', 'ሆስፒታል', 'ፋርማሲ', 'ሌላ ንግድ'],
  lg: ['Saloon', 'Supermarket', 'Mini Market', 'Bar', 'Restaurant', 'Studio', 'Duuka', 'Edwaliro', 'Pharmacy', 'Ebirala'],
  sw: ['Saluni', 'Supermarket', 'Mini Market', 'Baari', 'Mgahawa', 'Studio', 'Duka', 'Hospitali', 'Famasi', 'Biashara Nyengine'],
  ar: ['صالون', 'سوبرماركت', 'ميني ماركت', 'بار', 'مطعم', 'استوديو تصوير', 'دكان', 'مستشفى', 'صيدلية', 'نشاط آخر']
};

export default function App() {
  // --- STATE CORE ---
  const [lang, setLang] = useState('ti');
  const [currency, setCurrency] = useState('UGX');
  const [bizType, setBizType] = useState('');
  const [currentTab, setCurrentTab] = useState('home'); 
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // 100% Clean Slate Start (Empty Arrays/Objects by Default)
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem('ct_inventory_v2')) || []);
  const [sales, setSales] = useState(() => JSON.parse(localStorage.getItem('ct_sales_v2')) || []);
  const [aiReports, setAiReports] = useState(() => JSON.parse(localStorage.getItem('ct_ai_reports')) || []);

  // Paywall Security State
  const [isPremium, setIsPremium] = useState(() => JSON.parse(localStorage.getItem('ct_premium')) || false);
  const [txIdInput, setTxIdInput] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  // PWA Deferred Prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaPopUp, setShowPwaPopUp] = useState(false);

  // Camera Scanner Simulation
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);

  // Forms Input States
  const [saleItemName, setSaleItemName] = useState('');
  const [saleQty, setSaleQty] = useState('');
  const [saleCustomPrice, setSaleCustomPrice] = useState('');

  const [prodName, setProdName] = useState('');
  const [prodCost, setProdCost] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodQty, setProdQty] = useState('');

  // --- EFFECT SYNCS ---
  useEffect(() => { setBizType(BUSINESS_TYPES[lang][0]); }, [lang]);
  useEffect(() => { localStorage.setItem('ct_inventory_v2', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('ct_sales_v2', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('ct_ai_reports', JSON.stringify(aiReports)); }, [aiReports]);
  useEffect(() => { localStorage.setItem('ct_premium', JSON.stringify(isPremium)); }, [isPremium]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPwaPopUp(true);
    });
  }, []);

  // --- ACTIONS & OPERATIONS ---
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!prodName || !prodCost || !prodPrice || !prodQty) return;

    const newItem = {
      id: Date.now().toString(),
      name: prodName,
      cost: parseFloat(prodCost),
      price: parseFloat(prodPrice),
      qty: parseInt(prodQty)
    };
    setInventory(prev => [...prev, newItem]);
    setProdName(''); setProdCost(''); setProdPrice(''); setProdQty('');
  };

  const handleRecordSale = (e) => {
    e.preventDefault();
    if (!saleItemName || !saleQty) return;

    const selectedProduct = inventory.find(i => i.name === saleItemName);
    const qty = parseInt(saleQty);
    // Use selected item standard price, or customized field if entered
    const finalPrice = saleCustomPrice ? parseFloat(saleCustomPrice) : (selectedProduct ? selectedProduct.price : 0);
    const finalCost = selectedProduct ? selectedProduct.cost : finalPrice * 0.7; // Fallback standard margin if untracked cost

    // Deduct exact amount from stock structure
    if (selectedProduct) {
      setInventory(prev => prev.map(item => 
        item.id === selectedProduct.id ? { ...item, qty: Math.max(0, item.qty - qty) } : item
      ));
    }

    const newSale = {
      id: Date.now().toString(),
      name: saleItemName,
      qty,
      price: finalPrice,
      cost: finalCost,
      totalRevenue: qty * finalPrice,
      totalProfit: (qty * finalPrice) - (qty * finalCost),
      date: selectedDate
    };

    setSales(prev => [newSale, ...prev]);
    setSaleItemName(''); setSaleQty(''); setSaleCustomPrice('');
  };

  // Dynamic Camera Activation
  const startCameraScan = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied or unavailable.");
      setIsScanning(false);
    }
  };

  const stopCameraScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const triggerMockScanSuccess = () => {
    // Simulating auto asset finding on database via barcode match
    if (inventory.length > 0) {
      const randomItem = inventory[Math.floor(Math.random() * inventory.length)];
      setSaleItemName(randomItem.name);
      setSaleQty('1');
      alert(`Scanned Asset Recognized: ${randomItem.name}`);
    } else {
      alert("No products in inventory to match barcode lookup code.");
    }
    stopCameraScan();
  };

  // Trigger Local System File Download (txt file report saving)
  const downloadReportFile = (report) => {
    const element = document.createElement("a");
    const file = new Blob([`Report Date: ${report.date}\n\nAnalysis Text:\n${report.text}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `CashTrack-Report-${report.id}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  // Claude / Client Insights Module
  const runAiAnalysis = () => {
    const todaySales = sales.filter(s => s.date === selectedDate);
    const rev = todaySales.reduce((sum, s) => sum + s.totalRevenue, 0);
    const prof = todaySales.reduce((sum, s) => sum + s.totalProfit, 0);

    const textOutput = `[AI Audit Metrics] On date ${selectedDate} inside your ${bizType}, your store gathered an aggregate revenue of ${rev} ${currency} bringing a real mathematical profit of ${prof} ${currency}. Insights: Ensure to re-stock items dynamically showing fast turnover velocity. Avoid excessive overhead allocations.`;
    
    const newReport = { id: Date.now().toString(), date: selectedDate, text: textOutput };
    setAiReports(prev => [newReport, ...prev]);
    setCurrentTab('history');
  };

  const handleTxSubmit = (e) => {
    e.preventDefault();
    if (!txIdInput.trim()) return;
    setPaymentStatus('Pending manual admin review by Yohannes Kiflay Zera...');
    // Real tracking simulation, safely saved
    localStorage.setItem('pending_txid', txIdInput);
  };

  const triggerPwaInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
    setShowPwaPopUp(false);
  };

  // Compute stats dynamically
  const activeDaySales = sales.filter(s => s.date === selectedDate);
  const dailyRevenue = activeDaySales.reduce((sum, s) => sum + s.totalRevenue, 0);
  const dailyProfit = activeDaySales.reduce((sum, s) => sum + s.totalProfit, 0);

  const t = TRANSLATIONS[lang];

  return (
    <div style={{ background: '#F4F6F8', minHeight: '100vh', paddingBottom: '70px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      {/* HEADER SECTION */}
      <header style={{ background: '#1E293B', color: '#FFF', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package color="#2A9D8F" size={28} />
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{t.title}</h1>
        </div>

        {/* CONTROLS ZONE */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Calendar Selector */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#334155', padding: '6px 10px', borderRadius: '6px' }}>
            <Calendar size={16} style={{ marginRight: '6px', color: '#94A3B8' }} />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#FFF', outline: 'none' }} />
          </div>

          {/* Business Context Select */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#334155', padding: '6px 10px', borderRadius: '6px' }}>
            <select value={bizType} onChange={(e) => setBizType(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#FFF', outline: 'none', cursor: 'pointer' }}>
              {BUSINESS_TYPES[lang]?.map(b => <option key={b} value={b} style={{ color: '#000' }}>{b}</option>)}
            </select>
          </div>

          {/* Currency Preference Picker */}
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ background: '#334155', color: '#FFF', padding: '6px 10px', borderRadius: '6px', border: 'none', outline: 'none' }}>
            {Object.keys(CURRENCIES).map(cur => <option key={cur} value={cur}>{cur}</option>)}
          </select>

          {/* Global Multi-Language Dropdown Selector */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#2A9D8F', padding: '6px 10px', borderRadius: '6px' }}>
            <Languages size={16} style={{ marginRight: '6px' }} />
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#FFF', fontWeight: 'bold', outline: 'none', cursor: 'pointer' }}>
              <option value="ti">ትግርኛ</option>
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
              <option value="lg">Luganda</option>
              <option value="sw">Kiswahili</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </header>

      {/* PWA ALERT POPUP */}
      {showPwaPopUp && (
        <div style={{ background: '#2A9D8F', color: '#FFF', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} />
            <span>{t.installApp} for faster offline management dashboard view.</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={triggerPwaInstall} style={{ background: '#1E293B', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Install</button>
            <button onClick={() => setShowPwaPopUp(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}><X size={18} /></button>
          </div>
        </div>
      )}

      {/* RENDER TAB LOGIC AREA */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
        
        {currentTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* STATS OVERVIEW CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '6px solid #2A9D8F' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '14px', marginBottom: '6px' }}>
                  <span>{t.revenue}</span> <TrendingUp color="#2A9D8F" />
                </div>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#1E293B' }}>{dailyRevenue.toLocaleString()} {CURRENCIES[currency]}</h2>
              </div>

              <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '6px solid #E76F51' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '14px', marginBottom: '6px' }}>
                  <span>{t.profit} (Real Accounting Math)</span> <DollarSign color="#E76F51" />
                </div>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#1E293B' }}>{dailyProfit.toLocaleString()} {CURRENCIES[currency]}</h2>
              </div>
            </div>

            {/* DUAL WORKSPACE FORMS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* OPERATION 1: SALES ENTRY FIELD WITH SELECTION LIST */}
              <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#1E293B' }}>{t.addSale}</h3>
                  <button onClick={startCameraScan} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    <Camera size={16} /> {t.scanBarcode}
                  </button>
                </div>

                {/* LIVE SCANNER MODAL VIEW INTERFACE IF CAMERA CLICKED */}
                {isScanning && (
                  <div style={{ background: '#000', borderRadius: '8px', padding: '10px', marginBottom: '16px', color: '#FFF', textAlign: 'center', position: 'relative' }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '6px' }} />
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '6px 0' }}>Point camera at item code layout</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <button onClick={triggerMockScanSuccess} style={{ background: '#2A9D8F', border: 'none', color: '#FFF', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Simulate Scan</button>
                      <button onClick={stopCameraScan} style={{ background: '#DC3545', border: 'none', color: '#FFF', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Close</button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleRecordSale} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748B' }}>{t.itemName}</label>
                    <select value={saleItemName} onChange={(e) => setSaleItemName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }} required>
                      <option value="">{t.selectItem}</option>
                      {inventory.map(item => <option key={item.id} value={item.name}>{item.name} (In stock: {item.qty})</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '13px', color: '#64748B' }}>{t.quantity}</label>
                      <input type="number" value={saleQty} onChange={(e) => setSaleQty(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }} placeholder="0" required />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', color: '#64748B' }}>Custom Price (Optional)</label>
                      <input type="number" value={saleCustomPrice} onChange={(e) => setSaleCustomPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }} placeholder="Override Price" />
                    </div>
                  </div>
                  <button type="submit" style={{ background: '#2A9D8F', color: '#FFF', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>{t.addSale}</button>
                </form>
              </div>

              {/* JOURNAL LOG VIEW */}
              <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, color: '#1E293B' }}>Journal Logs ({selectedDate})</h3>
                  <button onClick={runAiAnalysis} style={{ background: '#1E293B', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    <Brain size={16} color="#2A9D8F" /> {t.aiBtn}
                  </button>
                </div>

                {activeDaySales.length === 0 ? (
                  <p style={{ color: '#64748B', textAlign: 'center', fontSize: '14px', marginTop: '40px' }}>{t.noData}</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                          <th style={{ padding: '8px' }}>{t.itemName}</th>
                          <th style={{ padding: '8px' }}>Qty</th>
                          <th style={{ padding: '8px' }}>Total</th>
                          <th style={{ padding: '8px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeDaySales.map(s => (
                          <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '10px 8px', fontWeight: '500' }}>{s.name}</td>
                            <td style={{ padding: '10px 8px' }}>{s.qty}</td>
                            <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>{s.totalRevenue} {currency}</td>
                            <td style={{ padding: '10px 8px' }}>
                              <button onClick={() => setSales(prev => prev.filter(x => x.id !== s.id))} style={{ background: 'transparent', border: 'none', color: '#DC3545', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* INVENTORY TAB VIEW */}
        {currentTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#1E293B' }}>{t.addItem}</h3>
              <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#64748B' }}>{t.itemName}</label>
                  <input type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }} placeholder="e.g., Water Bottle" required />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#64748B' }}>{t.buyingPrice} ({currency})</label>
                  <input type="number" value={prodCost} onChange={(e) => setProdCost(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }} placeholder="Cost" required />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#64748B' }}>{t.sellingPrice} ({currency})</label>
                  <input type="number" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }} placeholder="Selling Price" required />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#64748B' }}>{t.quantity}</label>
                  <input type="number" value={prodQty} onChange={(e) => setProdQty(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }} placeholder="Stock count" required />
                </div>
                <button type="submit" style={{ background: '#1E293B', color: '#FFF', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{t.addItem}</button>
              </form>
            </div>

            {/* MASTER INVENTORY TABLE */}
            <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0, color: '#1E293B' }}>{t.stock} Sheet</h3>
                <input type="text" placeholder={t.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }} />
              </div>

              {inventory.length === 0 ? (
                <p style={{ color: '#64748B', textAlign: 'center', fontSize: '14px', marginTop: '30px' }}>No items registered in inventory yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                        <th style={{ padding: '10px' }}>Item Name</th>
                        <th style={{ padding: '10px' }}>Cost</th>
                        <th style={{ padding: '10px' }}>Selling Price</th>
                        <th style={{ padding: '10px' }}>Stock Left</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{item.name}</td>
                          <td style={{ padding: '12px 10px' }}>{item.cost} {currency}</td>
                          <td style={{ padding: '12px 10px', color: '#2A9D8F', fontWeight: '500' }}>{item.price} {currency}</td>
                          <td style={{ padding: '12px 10px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: item.qty <= 3 ? '#FEE2E2' : '#DCFCE7', color: item.qty <= 3 ? '#DC3545' : '#15803D' }}>
                              {item.qty} units
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <button onClick={() => setInventory(prev => prev.filter(x => x.id !== item.id))} style={{ background: 'transparent', border: 'none', color: '#DC3545', cursor: 'pointer' }}><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORY / REPORTS TAB VIEW */}
        {currentTab === 'history' && (
          <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1E293B' }}>{t.history} & AI Logs</h3>
            {aiReports.length === 0 ? (
              <p style={{ color: '#64748B', textAlign: 'center', fontSize: '14px', marginTop: '40px' }}>No audit history found. Click "AI Analyze" on the home panel dashboard first.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {aiReports.map(report => (
                  <div key={report.id} style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '14px' }}>Date Segment: {report.date}</span>
                      <button onClick={() => downloadReportFile(report)} style={{ background: '#2A9D8F', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                        <Download size={14} /> {t.downloadReport}
                      </button>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>{report.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE / PREMIUM GATEWAY TAB */}
        {currentTab === 'profile' && (
          <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}><User /> {t.profile} Setup</h3>
            
            <div style={{ background: isPremium ? '#DCFCE7' : '#FEE2E2', padding: '12px', borderRadius: '8px', marginBottom: '20px', color: isPremium ? '#15803D' : '#B91C1C', fontWeight: 'bold', textAlign: 'center' }}>
              Status: {isPremium ? t.active : 'FREE TRIAL / INACTIVE'}
            </div>

            {/* PAYWALL LOGIC */}
            <div style={{ border: '1px solid #E2E8F0', padding: '16px', borderRadius: '8px', background: '#F8FAFC' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1E293B' }}>{t.paymentTitle}</h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4', margin: '0 0 12px 0' }}>
                To unlock continuous daily syncing, send subscription funds to Mobile Money number:<br />
                <strong style={{ fontSize: '15px', color: '#1E293B' }}>00256743227053</strong><br />
                Registered Owner: <em style={{ fontWeight: 'bold' }}>Yohannes Kiflay Zera</em>
              </p>
              <ul style={{ fontSize: '13px', paddingLeft: '20px', margin: '0 0 16px 0', color: '#475569' }}>
                <li>Monthly Tier: <strong>5,000 UGX</strong></li>
                <li>Yearly Tier (Save 15%): <strong>50,000 UGX</strong></li>
              </ul>

              <form onSubmit={handleTxSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" value={txIdInput} onChange={(e) => setTxIdInput(e.target.value)} placeholder={t.txInput} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} required />
                <button type="submit" style={{ background: '#1E293B', color: '#FFF', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{t.submitTx}</button>
              </form>
              
              {paymentStatus && <p style={{ fontSize: '13px', color: '#2A9D8F', marginTop: '10px', fontWeight: '500' }}>{paymentStatus}</p>}

              {/* Dev Bypass Feature Hook */}
              <button onClick={() => setIsPremium(!isPremium)} style={{ marginTop: '20px', background: 'transparent', color: '#94A3B8', border: '1px dashed #CBD5E1', width: '100%', padding: '6px', fontSize: '11px', cursor: 'pointer' }}>
                [Simulate Admin Verification Toggle]
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER MOBILE TASKBAR MENU COMPONENT */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', background: '#1E293B', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000 }}>
        <button onClick={() => setCurrentTab('home')} style={{ background: 'transparent', border: 'none', color: currentTab === 'home' ? '#2A9D8F' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px' }}>
          <Home size={20} /> <span>Home</span>
        </button>
        <button onClick={() => setCurrentTab('inventory')} style={{ background: 'transparent', border: 'none', color: currentTab === 'inventory' ? '#2A9D8F' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px' }}>
          <Package size={20} /> <span>{t.stock}</span>
        </button>
        <button onClick={() => setCurrentTab('history')} style={{ background: 'transparent', border: 'none', color: currentTab === 'history' ? '#2A9D8F' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px' }}>
          <Download size={20} /> <span>Reports</span>
        </button>
        <button onClick={() => setCurrentTab('profile')} style={{ background: 'transparent', border: 'none', color: currentTab === 'profile' ? '#2A9D8F' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px' }}>
          <User size={20} /> <span>{t.profile}</span>
        </button>
        {deferredPrompt && (
          <button onClick={triggerPwaInstall} style={{ background: 'transparent', border: 'none', color: '#E76F51', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px' }}>
            <Smartphone size={20} /> <span>Install</span>
          </button>
        )}
      </nav>

    </div>
  );
}
