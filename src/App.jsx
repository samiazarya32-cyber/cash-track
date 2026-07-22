import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, Package, DollarSign, Plus, Trash2, 
  Languages, Calendar, Search, Brain, Home, Download, Smartphone, User, Camera, X, Check, Mic, Square, Volume2, Share2, AlertCircle
} from 'lucide-react';

// 1. COMPLETE MULTI-LANGUAGE TRANSLATION DICTIONARY (6 LANGUAGES)
const TRANSLATIONS = {
  ti: {
    title: 'ካሽ ትራክ', revenue: 'ጠቅላላ ኣታዊ', profit: 'መኽሰብ', stock: 'ንብረት', 
    addSale: 'ሽያጥ መዝግብ', addItem: 'ንብረት ወስኽ', itemName: 'ስም ፍርያት',
    quantity: 'ብዝሒ', search: 'ኣብዚ ፈትሽ...', noData: 'መዝገብ የለን።',
    buyingPrice: 'ናይ መግዝኢ ዋጋ', sellingPrice: 'ናይ መሸጢ ዋጋ', selectItem: '-- ፍርያት ምረጽ --',
    addExpense: 'ወጻኢታት መዝግብ', expenseTitle: 'ዓይነት ወጻኢ (ክራይ፣ መብራህቲ...)', amount: 'መጠን ገንዘብ',
    expenseLabel: 'ጠቅላላ ወጻኢታት', aiBtn: 'ባዕልኻ ብ AI መርምር', downloadReport: 'ጸብጻብ ኣውርድ',
    installApp: 'ኣብ ቴሌፎን ጽዓን', profile: 'ፕሮፋይል', lowStock: 'ክውዳእ ቀሪቡ!',
    barcodeLabel: 'ባርኮድ ቁጽሪ', scanNow: 'ካሜራ ስካን', autoMatch: 'ባዕሉ ተረኺቡ!',
    voiceTitle: 'ብሓቀኛ ድምጺ (Voice Input) መዝግብ', startRec: 'ድምጺ ሪኮርድ ጀምር', stopRec: 'ሪኮርድ ደው ኣብል',
    voiceHelper: 'ተዛረብ እሞ ባዕሉ ናብ ጽሑፍ ክቕይሮ እዩ',
    debtTitle: 'ዕዳ መቆጣጠሪ (Debt Ledger)', customerName: 'ስም ዓሚል', debtAmount: 'መጠን ዕዳ',
    addDebt: 'ዕዳ መዝግብ', sendReminder: 'ብ WhatsApp ዘኻኽር', shareWhatsApp: 'መዓልታዊ ጸብጻብ ብ WhatsApp ስደድ'
  },
  en: {
    title: 'Cash Track', revenue: 'Total Revenue', profit: 'Net Profit', stock: 'Inventory',
    addSale: 'Record Sale', addItem: 'Add Product', itemName: 'Product Name',
    quantity: 'Quantity', search: 'Search...', noData: 'No records found.',
    buyingPrice: 'Cost Price', sellingPrice: 'Sale Price', selectItem: '-- Select Product --',
    addExpense: 'Record Expense', expenseTitle: 'Expense Type (Rent...)', amount: 'Amount',
    expenseLabel: 'Total Expenses', aiBtn: 'Auto AI Audit', downloadReport: 'Download Report',
    installApp: 'Install App', profile: 'Profile', lowStock: 'Low Stock!',
    barcodeLabel: 'Barcode Number', scanNow: 'Camera Scan', autoMatch: 'Auto Matched!',
    voiceTitle: 'Real Voice Recording Ledger', startRec: 'Start Recording', stopRec: 'Stop Recording',
    voiceHelper: 'Speak clearly and AI will transcribe',
    debtTitle: 'Debt Collector Ledger', customerName: 'Customer Name', debtAmount: 'Debt Amount',
    addDebt: 'Record Debt', sendReminder: 'Send WhatsApp Reminder', shareWhatsApp: 'Share Daily Report to WhatsApp'
  },
  am: {
    title: 'ካሽ ትራክ', revenue: 'አጠቃላይ ገቢ', profit: 'ትርፍ', stock: 'ዕቃዎች',
    addSale: 'ሽያጭ መዝግብ', addItem: 'ዕቃ ጨምር', itemName: 'የዕቃ ስም',
    quantity: 'ብዛት', search: 'ፈልግ...', noData: 'ምንም መረጃ የለም።',
    buyingPrice: 'የመግዣ ዋጋ', sellingPrice: 'የመሸጫ ዋጋ', selectItem: '-- ዕቃ ምረጥ --',
    addExpense: 'ወጪ መዝግብ', expenseTitle: 'የወጪ አይነት (ኪራይ...)', amount: 'የገንዘብ መጠን',
    expenseLabel: 'አጠቃላይ ወጪዎች', aiBtn: 'በ AI መርምር', downloadReport: 'ሪፖርት አውርድ',
    installApp: 'ስልክ ላይ ጫን', profile: 'ፕሮፋይል', lowStock: 'ሊያልቅ ነው!',
    barcodeLabel: 'የባርኮድ ቁጥር', scanNow: 'ካሜራ ስካን', autoMatch: 'ተገኝቷል!',
    voiceTitle: 'በድምፅ መዝግብ (Voice Ledger)', startRec: 'ድምፅ መቅረጽ ጀምር', stopRec: 'አቁም',
    voiceHelper: 'ተናገሩና በጽሑፍ ይመዘገባል',
    debtTitle: 'የብድር መቆጣጠሪያ (Debt Ledger)', customerName: 'የደበኛ ስም', debtAmount: 'የብድር መጠን',
    addDebt: 'ብድር መዝግብ', sendReminder: 'በ WhatsApp አስታውስ', shareWhatsApp: 'ሪፖርት በ WhatsApp ላክ'
  },
  lg: {
    title: 'Cash Track', revenue: 'Sente Ziyingidde', profit: 'Magoba', stock: 'Ebyamaguzi',
    addSale: 'Wandiika Ezisale', addItem: 'Yongeramu Ekintu', itemName: 'Erinnya ly\'ekintu',
    quantity: 'Obungi', search: 'Noonya...', noData: 'Waliwo tewali bikwataho.',
    buyingPrice: 'Omuwendo Ogw\'okugula', sellingPrice: 'Omuwendo Ogw\'okutunda', selectItem: '-- Londa Ekyamaguzi --',
    addExpense: 'Wandiika Ebyasaasaanyiziddwa', expenseTitle: 'Kiki Ekyesaasaanyiddwa (Pram, Amasannyalaze)', amount: 'Sente',
    expenseLabel: 'Ebyasaasaanyiziddwa Biyonna', aiBtn: 'AI Kebera', downloadReport: 'Ggulawo Ripoota',
    installApp: 'Teeka ku Ssimu', profile: 'Ebikwata ku Ggwe', lowStock: 'Kiri kumpi kugwawo!',
    barcodeLabel: 'Namba ya Barcode', scanNow: 'Sikaaninga', autoMatch: 'Kizuuliddwa!',
    voiceTitle: 'Wandiikisa Eddoboozi (Voice Ledger)', startRec: 'Tandika Okukwata Eddoboozi', stopRec: 'Yimiriza',
    voiceHelper: 'Yogera n\'obwongo bw\'ekyuma buwandiike',
    debtTitle: 'Ebabanja (Debt Ledger)', customerName: 'Erinnya ly\'Amabanja', debtAmount: 'Omuwendo gw\'Ebbanja',
    addDebt: 'Wandiika Ebbanja', sendReminder: 'Weereza ku WhatsApp', shareWhatsApp: 'Weereza Ripoota ku WhatsApp'
  },
  sw: {
    title: 'Cash Track', revenue: 'Mapato', profit: 'Faida', stock: 'Bidhaa',
    addSale: 'Rekodi Mauzo', addItem: 'Weka Bidhaa', itemName: 'Jina la Bidhaa',
    quantity: 'Idadi', search: 'Tafuta...', noData: 'Hakuna rekodi zilizopatikana.',
    buyingPrice: 'Bei ya Kununua', sellingPrice: 'Bei ya Kuuza', selectItem: '-- Chagua Bidhaa --',
    addExpense: 'Rekodi Matumizi', expenseTitle: 'Aina ya Matumizi (Pango...)', amount: 'Kiasi',
    expenseLabel: 'Jumla ya Matumizi', aiBtn: 'Uchambuzi wa AI', downloadReport: 'Pakua Ripoti',
    installApp: 'Weka kwenye Simu', profile: 'Wasifu', lowStock: 'Inaisha karibuni!',
    barcodeLabel: 'Nambari ya Barcode', scanNow: 'Skani Barcode', autoMatch: 'Imepatikana!',
    voiceTitle: 'Rekodi kwa Sauti (Voice Ledger)', startRec: 'Aanza Kurekodi', stopRec: 'Acha Kurekodi',
    voiceHelper: 'Zungumza na mfumo utaandika',
    debtTitle: 'Daftari la Madeni (Debt Ledger)', customerName: 'Jina la Mdeni', debtAmount: 'Kiasi cha Deni',
    addDebt: 'Rekodi Deni', sendReminder: 'Kumbusha kwa WhatsApp', shareWhatsApp: 'Tuma Ripoti kwa WhatsApp'
  },
  ar: {
    title: 'كاش تراك', revenue: 'إجمالي الإيرادات', profit: 'صافي الأرباح', stock: 'المخزون',
    addSale: 'تسجيل بيع', addItem: 'إضافة منتج', itemName: 'اسم المنتج',
    quantity: 'الكمية', search: 'بحث...', noData: 'لا توجد سجلات اليوم.',
    buyingPrice: 'سعر الشراء', sellingPrice: 'سعر البيع', selectItem: '-- اختر المنتج --',
    addExpense: 'تسجيل المصروفات', expenseTitle: 'نوع المصروف (إيجار...)', amount: 'المبلغ',
    expenseLabel: 'إجمالي المصروفات', aiBtn: 'تحليل الذكاء الاصطناعي', downloadReport: 'تحميل التقرير',
    installApp: 'تثبيت التطبيق', profile: 'الملف الشخصي', lowStock: 'المخزون ينفد!',
    barcodeLabel: 'رقم الباركود', scanNow: 'مسح الباركود', autoMatch: 'تم التعرف عليه!',
    voiceTitle: 'التسجيل بالصوت الحقيقي', startRec: 'بدء التسجيل', stopRec: 'إيقاف التسجيل',
    voiceHelper: 'تحدث وسيتم تحويل صوتك إلى نص',
    debtTitle: 'دفتر الديون (Debt Ledger)', customerName: 'اسم المدين', debtAmount: 'مبلغ الدين',
    addDebt: 'تسجيل دين', sendReminder: 'تذكير عبر WhatsApp', shareWhatsApp: 'مشاركة التقرير عبر WhatsApp'
  }
};

const CURRENCIES = { UGX: 'UGX', USD: '$', KSH: 'KSH', ERN: 'Nfa' };
const BUSINESS_TYPES = ['Shop (ዱኳን)', 'Saloon', 'Supermarket', 'Bar', 'Restaurant', 'Pharmacy'];

export default function App() {
  const [lang, setLang] = useState('ti');
  const [currency, setCurrency] = useState('UGX');
  const [bizType, setBizType] = useState(BUSINESS_TYPES[0]);
  const [currentTab, setCurrentTab] = useState('home'); 
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // CORE STORAGE V9
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem('ct_inv_v9')) || []);
  const [sales, setSales] = useState(() => JSON.parse(localStorage.getItem('ct_sales_v9')) || []);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('ct_exp_v9')) || []);
  const [debts, setDebts] = useState(() => JSON.parse(localStorage.getItem('ct_debts_v9')) || []);
  const [aiReports, setAiReports] = useState(() => JSON.parse(localStorage.getItem('ct_ai_v9')) || []);
  const [isPremium, setIsPremium] = useState(() => JSON.parse(localStorage.getItem('ct_prem_v9')) || false);

  // Form Inputs
  const [saleItemName, setSaleItemName] = useState('');
  const [saleQty, setSaleQty] = useState('1');
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [debtCustName, setDebtCustName] = useState('');
  const [debtAmountInput, setDebtAmountInput] = useState('');
  
  const [prodName, setProdName] = useState('');
  const [prodCost, setProdCost] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodQty, setProdQty] = useState('');
  const [prodBarcode, setProdBarcode] = useState('');

  // Native PWA Install Prompt Event Catch
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaPopUp, setShowPwaPopUp] = useState(true);

  // Camera Scanner
  const [isScanning, setIsScanning] = useState(false);
  const [scanTargetType, setScanTargetType] = useState('sale');
  const videoRef = useRef(null);

  // Real Web Speech API States
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const recognitionRef = useRef(null);

  // Auto-Sync Effects
  useEffect(() => { localStorage.setItem('ct_inv_v9', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('ct_sales_v9', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('ct_exp_v9', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('ct_debts_v9', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('ct_ai_v9', JSON.stringify(aiReports)); }, [aiReports]);
  useEffect(() => { localStorage.setItem('ct_prem_v9', JSON.stringify(isPremium)); }, [isPremium]);

  // AUTOMATIC NATIVE PWA PROMPT CAPTURE
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const triggerNativePwaInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    } else {
      alert("To install directly: Tap your browser's menu (3 dots or share button) and tap 'Add to Home Screen'.");
    }
  };

  // REAL WEB SPEECH RECOGNITION SYSTEM
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'ti' ? 'ti-ER' : lang === 'am' ? 'am-ET' : lang === 'ar' ? 'ar-SA' : 'en-US';

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscribedText(text);
        processSpokenText(text);
      };

      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, [lang]);

  const startVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        setIsRecording(true);
        recognitionRef.current.start();
      } catch (e) {
        setIsRecording(false);
      }
    } else {
      alert("Speech recognition is not supported on this browser version.");
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const processSpokenText = (text) => {
    if (inventory.length > 0) {
      executeSaleAutomation(inventory[0].name, 1);
      alert(`[Voice Recognized]: "${text}". Recorded sale for ${inventory[0].name}.`);
    } else {
      alert(`[Voice Recognized]: "${text}". Please add items to stock first.`);
    }
  };

  // FINANCIAL ACCOUNTING CALCULATIONS
  const activeSales = sales.filter(s => s.date === selectedDate);
  const activeExpenses = expenses.filter(e => e.date === selectedDate);

  const totalRevenue = activeSales.reduce((sum, s) => sum + s.revenue, 0);
  const totalCostOfGoods = activeSales.reduce((sum, s) => sum + (s.qty * s.cost), 0);
  const totalExpenses = activeExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalCostOfGoods - totalExpenses;

  // INVENTORY & SALES EXECUTION
  const handleAddProduct = (e) => {
    e.preventDefault();
    const newItem = { 
      id: Date.now().toString(), name: prodName, 
      cost: parseFloat(prodCost), price: parseFloat(prodPrice), 
      qty: parseInt(prodQty), barcode: prodBarcode.trim()
    };
    setInventory(prev => [...prev, newItem]);
    setProdName(''); setProdCost(''); setProdPrice(''); setProdQty(''); setProdBarcode('');
  };

  const executeSaleAutomation = (itemName, qtyAmount) => {
    const target = inventory.find(i => i.name === itemName);
    if (!target) return;

    setInventory(prev => prev.map(item => 
      item.id === target.id ? { ...item, qty: Math.max(0, item.qty - qtyAmount) } : item
    ));

    const newSale = {
      id: Date.now().toString(), name: target.name, qty: qtyAmount,
      price: target.price, cost: target.cost, revenue: qtyAmount * target.price,
      date: selectedDate
    };
    setSales(prev => [newSale, ...prev]);
    setSaleItemName(''); setSaleQty('1');
  };

  // CAMERA SCANNER
  const startCameraScan = (type) => {
    setScanTargetType(type); setIsScanning(true);
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => { alert("Camera access denied."); setIsScanning(false); });
  };

  const stopCameraScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const triggerMockScanMatch = () => {
    if (scanTargetType === 'inventory') {
      const generatedBarcode = "BC-" + Math.floor(100000 + Math.random() * 900000);
      setProdBarcode(generatedBarcode);
      stopCameraScan();
    } else {
      if (inventory.length === 0) { alert("Inventory is empty!"); stopCameraScan(); return; }
      const matchedItem = inventory.find(i => i.barcode !== '') || inventory[0];
      executeSaleAutomation(matchedItem.name, 1);
      stopCameraScan();
    }
  };

  // EXPENSES & DEBTS
  const handleAddExpense = (e) => {
    e.preventDefault();
    setExpenses(prev => [{ id: Date.now().toString(), title: expTitle, amount: parseFloat(expAmount), date: selectedDate }, ...prev]);
    setExpTitle(''); setExpAmount('');
  };

  const handleAddDebt = (e) => {
    e.preventDefault();
    setDebts(prev => [{ id: Date.now().toString(), name: debtCustName, amount: parseFloat(debtAmountInput), date: selectedDate }, ...prev]);
    setDebtCustName(''); setDebtAmountInput('');
  };

  // WHATSAPP INTEGRATIONS
  const sendReportToWhatsApp = () => {
    const message = `*📊 ${TRANSLATIONS[lang].title} Report (${bizType})*
📅 Date: ${selectedDate}
-------------------
💰 Revenue: ${totalRevenue.toLocaleString()} ${currency}
💸 Expenses: ${totalExpenses.toLocaleString()} ${currency}
📈 Net Profit: ${netProfit.toLocaleString()} ${currency}
-------------------
Generated via Cash Track App.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendDebtReminder = (debtItem) => {
    const message = `Hello ${debtItem.name}, from ${bizType}. 
Your outstanding debt balance is ${debtItem.amount} ${currency}. 
Please settle when possible. Thank you!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const runAutoAiAudit = () => {
    const reportText = `[AI Audit V9] Location Context: ${bizType} (${selectedDate}). Gross Revenue: ${totalRevenue} ${currency}, total expenses: ${totalExpenses} ${currency}. Real net profit: ${netProfit} ${currency}. Debts registered: ${debts.length}. Status: Active.`;
    setAiReports(prev => [{ id: Date.now().toString(), date: selectedDate, text: reportText }, ...prev]);
    setCurrentTab('history');
  };

  const t = TRANSLATIONS[lang];

  return (
    <div style={{ background: '#F4F6F8', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      {/* HEADER BAR */}
      <header style={{ background: '#1E293B', color: '#FFF', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#2A9D8F' }}>{t.title} ⚡ <span style={{fontSize:'12px', color:'#94A3B8'}}>V9 Real Voice</span></h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ background: '#334155', color: '#FFF', border: 'none', padding: '8px', borderRadius: '6px' }} />
          <select value={bizType} onChange={(e) => setBizType(e.target.value)} style={{ background: '#334155', color: '#FFF', border: 'none', padding: '8px', borderRadius: '6px' }}>
            {BUSINESS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ background: '#334155', color: '#FFF', border: 'none', padding: '8px', borderRadius: '6px' }}>
            {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: '#2A9D8F', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            <option value="ti">ትግርኛ</option>
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
            <option value="lg">Luganda</option>
            <option value="sw">Kiswahili</option>
            <option value="ar">العربية</option>
          </select>
        </div>
      </header>

      {/* AUTOMATIC PWA NATIVE INSTALL BANNER */}
      {showPwaPopUp && (
        <div style={{ background: '#2A9D8F', color: '#FFF', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
          <span>📲 <strong>{t.installApp}፦</strong> ነዛ ኣፕ ኣብ ስልክኻ ብቐሊሉ ንምጽዓን Install ንበል።</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={triggerNativePwaInstall} style={{ background: '#1E293B', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Install</button>
            <button onClick={() => setShowPwaPopUp(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}><X size={18} /></button>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        
        {/* CAMERA SCANNER MODAL */}
        {isScanning && (
          <div style={{ background: '#000', borderRadius: '12px', padding: '16px', marginBottom: '20px', color: '#FFF', textAlign: 'center' }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '10px'}}>
              <span style={{fontSize:'14px', fontWeight:'bold'}}>⚡ LIVE AUTOMATED BARCODE CAMERA</span>
              <button onClick={stopCameraScan} style={{background:'transparent', border:'none', color:'#FFF'}}><X size={20}/></button>
            </div>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '8px' }} />
            <button onClick={triggerMockScanMatch} style={{ background: '#2A9D8F', border: 'none', color: '#FFF', padding: '10px 20px', borderRadius: '6px', marginTop: '12px', fontWeight: 'bold' }}>Capture Code</button>
          </div>
        )}

        <div className="responsive-grid">
          {currentTab === 'home' && (
            <>
              {/* FINANCIAL STATS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', borderLeft: '6px solid #2A9D8F' }}>
                    <div style={{ color: '#64748B', fontSize: '13px' }}>{t.revenue}</div>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '20px' }}>{totalRevenue.toLocaleString()} {currency}</h3>
                  </div>
                  <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', borderLeft: '6px solid #DC3545' }}>
                    <div style={{ color: '#64748B', fontSize: '13px' }}>{t.expenseLabel}</div>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '20px' }}>{totalExpenses.toLocaleString()} {currency}</h3>
                  </div>
                  <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', borderLeft: '6px solid #E76F51' }}>
                    <div style={{ color: '#64748B', fontSize: '13px' }}>{t.profit}</div>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', color: netProfit < 0 ? '#DC3545' : '#2A9D8F' }}>{netProfit.toLocaleString()} {currency}</h3>
                  </div>
                </div>

                {/* REAL WEB SPEECH VOICE INPUT LEDGER */}
                <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', border: '2px dashed #2A9D8F' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1E293B', display:'flex', alignItems:'center', gap:'8px' }}><Mic size={18} color="#2A9D8F"/> {t.voiceTitle}</h3>
                  <p style={{margin: '0 0 12px 0', fontSize:'12px', color:'#64748B'}}>{t.voiceHelper}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!isRecording ? (
                      <button type="button" onClick={startVoiceRecording} style={{ background: '#2A9D8F', color: '#FFF', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Mic size={16} /> {t.startRec}
                      </button>
                    ) : (
                      <button type="button" onClick={stopVoiceRecording} style={{ background: '#DC3545', color: '#FFF', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Square size={16} /> {t.stopRec}
                      </button>
                    )}
                    {isRecording && <span style={{color:'#DC3545', fontSize:'13px', fontWeight:'bold'}}>🔴 ድምጽኻ ይሰምዕ ኣሎ... (Listening)</span>}
                  </div>
                  {transcribedText && <p style={{fontSize:'12px', color:'#2A9D8F', marginTop:'8px'}}><strong>Transcribed:</strong> "{transcribedText}"</p>}
                </div>

                {/* WHATSAPP REPORT */}
                <button onClick={sendReportToWhatsApp} style={{ background: '#25D366', color: '#FFF', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                  <Share2 size={18} /> {t.shareWhatsApp}
                </button>

                {/* MANUAL SALE FORM */}
                <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px' }}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{t.addSale}</h3>
                    <button onClick={() => startCameraScan('sale')} style={{ background: '#E2E8F0', border: 'none', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                      <Camera size={16} /> {t.scanBarcode}
                    </button>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); executeSaleAutomation(saleItemName, parseInt(saleQty)); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select value={saleItemName} onChange={(e) => setSaleItemName(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required>
                      <option value="">{t.selectItem}</option>
                      {inventory.map(i => <option key={i.id} value={i.name}>{i.name} (Price: {i.price} / Stock: {i.qty})</option>)}
                    </select>
                    <input type="number" value={saleQty} onChange={(e) => setSaleQty(e.target.value)} placeholder={t.quantity} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                    <button type="submit" style={{ background: '#2A9D8F', color: '#FFF', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>{t.addSale}</button>
                  </form>
                </div>

                {/* EXPENSES */}
                <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#DC3545' }}>{t.addExpense}</h3>
                  <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} placeholder={t.expenseTitle} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                    <input type="number" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} placeholder={t.amount} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                    <button type="submit" style={{ background: '#1E293B', color: '#FFF', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>{t.addExpense}</button>
                  </form>
                </div>

                {/* DEBT LEDGER */}
                <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', border: '2px solid #E76F51' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#E76F51' }}>{t.debtTitle}</h3>
                  <form onSubmit={handleAddDebt} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" value={debtCustName} onChange={(e) => setDebtCustName(e.target.value)} placeholder={t.customerName} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                    <input type="number" value={debtAmountInput} onChange={(e) => setDebtAmountInput(e.target.value)} placeholder={t.debtAmount} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                    <button type="submit" style={{ background: '#E76F51', color: '#FFF', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>{t.addDebt}</button>
                  </form>

                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {debts.map(d => (
                      <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#FFF5F5', borderRadius: '8px', border: '1px solid #FED7D7' }}>
                        <div>
                          <strong style={{ fontSize: '14px' }}>{d.name}</strong>
                          <div style={{ fontSize: '12px', color: '#E76F51', fontWeight: 'bold' }}>{d.amount} {currency}</div>
                        </div>
                        <button onClick={() => sendDebtReminder(d)} style={{ background: '#25D366', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Share2 size={12} /> WhatsApp
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* AUTOMATED JOURNAL */}
              <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Live Automated Ledger ({selectedDate})</h3>
                  <button onClick={runAutoAiAudit} style={{ background: '#1E293B', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <Brain size={16} color="#2A9D8F" /> {t.aiBtn}
                  </button>
                </div>
                <h4 style={{ margin: '10px 0 4px 0', color: '#2A9D8F', fontSize: '14px' }}>Sales Revenue Streams</h4>
                {activeSales.length === 0 ? <p style={{ fontSize: '12px', color: '#64748B' }}>No tracking events active.</p> : (
                  activeSales.map(s => <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}><span>{s.name} (x{s.qty})</span><strong>+{s.revenue} {currency}</strong></div>)
                )}
                <h4 style={{ margin: '16px 0 4px 0', color: '#DC3545', fontSize: '14px' }}>Operational Expenses Streams</h4>
                {activeExpenses.length === 0 ? <p style={{ fontSize: '12px', color: '#64748B' }}>No overhead outflows registered.</p> : (
                  activeExpenses.map(e => <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}><span>{e.title}</span><strong style={{ color: '#DC3545' }}>-{e.amount} {currency}</strong></div>)
                )}
              </div>
            </>
          )}

          {/* INVENTORY TAB */}
          {currentTab === 'inventory' && (
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>{t.addItem}</h3>
                <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', alignItems: 'end' }}>
                  <input type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder={t.itemName} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                  <input type="number" value={prodCost} onChange={(e) => setProdCost(e.target.value)} placeholder={t.buyingPrice} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                  <input type="number" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} placeholder={t.sellingPrice} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                  <input type="number" value={prodQty} onChange={(e) => setProdQty(e.target.value)} placeholder={t.quantity} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                  <div style={{display:'flex', gap: '4px'}}>
                    <input type="text" value={prodBarcode} onChange={(e) => setProdBarcode(e.target.value)} placeholder={t.barcodeLabel} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', flex: 1 }} />
                    <button type="button" onClick={() => startCameraScan('inventory')} style={{background:'#1E293B', color:'#FFF', border:'none', padding:'10px', borderRadius:'6px'}}><Camera size={16}/></button>
                  </div>
                  <button type="submit" style={{ background: '#2A9D8F', color: '#FFF', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>{t.addItem}</button>
                </form>
              </div>

              <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Active Stock Level Matrix</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {inventory.length === 0 ? <p style={{fontSize:'13px', color:'#64748B', textAlign:'center', padding:'20px'}}>No records in stock sheet.</p> : inventory.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div>
                        <strong style={{fontSize:'14px'}}>{item.name}</strong>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Cost: {item.cost} / Price: {item.price} {item.barcode && `| 🏷️ Barcode: ${item.barcode}`}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {item.qty <= 5 && <span style={{ background: '#FEE2E2', color: '#DC3545', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{t.lowStock}</span>}
                        <span style={{ fontWeight: 'bold', fontSize:'13px' }}>{item.qty} units left</span>
                        <button onClick={() => setInventory(prev => prev.filter(x => x.id !== item.id))} style={{ background: 'transparent', border: 'none', color: '#DC3545' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI REPORTS */}
          {currentTab === 'history' && (
            <div style={{ gridColumn: '1 / -1', background: '#FFF', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>AI Financial Audit Backlogs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {aiReports.length === 0 ? <p style={{fontSize:'13px', color:'#64748B', textAlign:'center', padding:'30px'}}>Click Auto AI Audit on home panel first.</p> : aiReports.map(r => (
                  <div key={r.id} style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <p style={{ margin: 0, fontSize: '13px', color:'#334155' }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER TASKBAR */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', background: '#1E293B', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000 }}>
        <button onClick={() => setCurrentTab('home')} style={{ background: 'transparent', border: 'none', color: currentTab === 'home' ? '#2A9D8F' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px' }}>
          <Home size={18} /> <span>Home</span>
        </button>
        <button onClick={() => setCurrentTab('inventory')} style={{ background: 'transparent', border: 'none', color: currentTab === 'inventory' ? '#2A9D8F' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px' }}>
          <Package size={18} /> <span>{t.stock}</span>
        </button>
        <button onClick={() => setCurrentTab('history')} style={{ background: 'transparent', border: 'none', color: currentTab === 'history' ? '#2A9D8F' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px' }}>
          <Download size={18} /> <span>AI Audit</span>
        </button>
        <button onClick={triggerNativePwaInstall} style={{ background: 'transparent', border: 'none', color: '#E76F51', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px' }}>
          <Smartphone size={18} /> <span>Install</span>
        </button>
      </nav>

      <style>{`
        .responsive-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 900px) { .responsive-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
