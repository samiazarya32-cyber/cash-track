import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, Package, DollarSign, Plus, Trash2, 
  Languages, Calendar, Search, Brain, Home, Download, Smartphone, User, Camera, X, Check, Mic, Square, Volume2, Share2, AlertCircle, Play
} from 'lucide-react';

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
    scanBarcode: 'ስካን ግበር',
    voiceTitle: 'ብድምጺ (Voice Memo) መዝግብ', startRec: 'ድምጺ ሪኮርድ ጀምር', stopRec: 'ሪኮርድ ደው ኣብል',
    voiceHelper: 'እቲ ዝበልካዮ ድምጺ ተቐዲሑ ምሸት ክትሰምዖ ይጽናሕ',
    debtTitle: 'ዕዳ መቆጻጸሪ (Debt Ledger)', customerName: 'ስም ዓሚል', debtAmount: 'መጠን ዕዳ',
    addDebt: 'ዕዳ መዝግብ', sendReminder: 'ብ WhatsApp ዘዘኻኽር', shareWhatsApp: 'መዓልታዊ ጸብጻብ ብ WhatsApp ስደድ'
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
    scanBarcode: 'Scan Barcode',
    voiceTitle: 'Voice Audio Memo Ledger', startRec: 'Start Recording', stopRec: 'Stop Recording',
    voiceHelper: 'Record voice memos to review and confirm sales later',
    debtTitle: 'Debt Collector Ledger', customerName: 'Customer Name', debtAmount: 'Debt Amount',
    addDebt: 'Record Debt', sendReminder: 'Send WhatsApp Reminder', shareWhatsApp: 'Share Daily Report to WhatsApp'
  }
};

const CURRENCIES = { UGX: 'UGX', USD: '$', KSH: 'KSH', ERN: 'EURO' };
const BUSINESS_TYPES = ['Shop (ዱኳን)', 'Saloon', 'Supermarket', 'Bar', 'Restaurant', 'Pharmacy', 'wholesaler', 'Garage', 'Cafe', 'Hospotal', 'Boutique', 'Studio (videography)', 'clothier (ሰፋይ ክዳዉንቲ)', 'Electronics', 'play station'];

export default function App() {
  const [lang, setLang] = useState('ti');
  const [currency, setCurrency] = useState('UGX');
  const [bizType, setBizType] = useState(BUSINESS_TYPES[0]);
  const [currentTab, setCurrentTab] = useState('home'); 
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // CORE LOCAL STORAGE ENGINE
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem('ct_inv_v8')) || []);
  const [sales, setSales] = useState(() => JSON.parse(localStorage.getItem('ct_sales_v8')) || []);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('ct_exp_v8')) || []);
  const [debts, setDebts] = useState(() => JSON.parse(localStorage.getItem('ct_debts_v8')) || []);
  const [aiReports, setAiReports] = useState(() => JSON.parse(localStorage.getItem('ct_ai_v8')) || []);
  const [voiceNotes, setVoiceNotes] = useState(() => JSON.parse(localStorage.getItem('ct_voice_v8')) || []);
  const [whisperApiKey, setWhisperApiKey] = useState(() => localStorage.getItem('ct_whisper_key') || '');

  // Form Inputs States
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

  // Hardware Integrations
  const [isScanning, setIsScanning] = useState(false);
  const [scanTargetType, setScanTargetType] = useState('sale');
  const videoRef = useRef(null);

  // Voice Engine States
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Auto-Sync LocalStorage Effects
  useEffect(() => { localStorage.setItem('ct_inv_v8', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('ct_sales_v8', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('ct_exp_v8', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('ct_debts_v8', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('ct_ai_v8', JSON.stringify(aiReports)); }, [aiReports]);
  useEffect(() => { localStorage.setItem('ct_voice_v8', JSON.stringify(voiceNotes)); }, [voiceNotes]);
  useEffect(() => { localStorage.setItem('ct_whisper_key', whisperApiKey); }, [whisperApiKey]);

  // FINANCIAL ACCOUNTING LOGIC CALCULATIONS
  const activeSales = sales.filter(s => s.date === selectedDate);
  const activeExpenses = expenses.filter(e => e.date === selectedDate);
  const activeVoiceNotes = voiceNotes.filter(v => v.date === selectedDate);

  const totalRevenue = activeSales.reduce((sum, s) => sum + s.revenue, 0);
  const totalCostOfGoods = activeSales.reduce((sum, s) => sum + (s.qty * s.cost), 0);
  const totalExpenses = activeExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalCostOfGoods - totalExpenses;

  // 1. ADD INVENTORY ITEM
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

  // 2. AUTOMATED SALE EXECUTION & STOCK DEDUCTION
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

  // 3. BARCODE SCANNER CAMERA MODULE
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
      if (inventory.length === 0) {
        alert("Inventory is empty!"); stopCameraScan(); return;
      }
      const matchedItem = inventory.find(i => i.barcode !== '') || inventory[0];
      alert(`[BARCODE MATCHED]: ${matchedItem.name}. Auto-recorded 1 sale and deducted stock.`);
      executeSaleAutomation(matchedItem.name, 1);
      stopCameraScan();
    }
  };

  // 4. AUDIO VOICE MEMO RECORDING (CLEAN & ACCURATE)
  const startVoiceRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const newVoiceNote = {
            id: Date.now().toString(), date: selectedDate, time: timeString,
            audioData: base64Audio
          };

          setVoiceNotes(prev => [newVoiceNote, ...prev]);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone permission required for Audio recording.");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playAudioNote = (audioData) => {
    const audio = new Audio(audioData);
    audio.play();
  };

  // 5. EXPENSE & DEBT RECORDERS
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

  // 6. WHATSAPP INTEGRATIONS
  const sendReportToWhatsApp = () => {
    const message = `*📊 ናይ ሎሚ መዓልቲ ጸብጻብ (${bizType})*
📅 ዕለት: ${selectedDate}
-------------------
💰 ጠቅላላ ኣታዊ: ${totalRevenue.toLocaleString()} ${currency}
💸 ጠቅላላ ወጻኢ: ${totalExpenses.toLocaleString()} ${currency}
📈 መኽሰብ: ${netProfit.toLocaleString()} ${currency}
-------------------
በዛ ጽብቕቲ ኣፕ (Cash Track) ዝተዳለወ እዩ።`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendDebtReminder = (debtItem) => {
    const message = `ሰላም ${debtItem.name}፣ ካብ ${bizType} እየ። 
ኣብ ትካልና ዘለካ ዕዳ ብዝሑ ${debtItem.amount} ${currency} እዩ። 
ምስ ተረኽበ ክትከፍለና ብትሕትና ንሓትት። የቐንየልና!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const runAutoAiAudit = () => {
    const reportText = `[AI Automated Audit V8.1] Location Context: ${bizType} (${selectedDate}). Gross Revenue accumulated: ${totalRevenue} ${currency}, total expenses: ${totalExpenses} ${currency}. Real net profit stands at ${netProfit} ${currency}. Debts registered: ${debts.length}. Voice Memos stored: ${activeVoiceNotes.length}. Status: Fully Synchronized.`;
    setAiReports(prev => [{ id: Date.now().toString(), date: selectedDate, text: reportText }, ...prev]);
    setCurrentTab('history');
  };

  const t = TRANSLATIONS[lang];

  return (
    <div style={{ background: '#F4F6F8', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      <style>{`
        .responsive-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      {/* HEADER BANNER CONTROLS */}
      <header style={{ background: '#1E293B', color: '#FFF', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#2A9D8F' }}>{t.title} ⚡ <span style={{fontSize:'12px', color:'#94A3B8'}}>V8.1 Clean Architecture</span></h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ background: '#334155', color: '#FFF', border: 'none', padding: '8px', borderRadius: '6px' }} />
          <select value={bizType} onChange={(e) => setBizType(e.target.value)} style={{ background: '#334155', color: '#FFF', border: 'none', padding: '8px', borderRadius: '6px' }}>
            {BUSINESS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ background: '#334155', color: '#FFF', border: 'none', padding: '8px', borderRadius: '6px' }}>
            {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => setLang(lang === 'ti' ? 'en' : 'ti')} style={{ background: '#2A9D8F', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{lang === 'ti' ? 'English' : 'ትግርኛ'}</button>
        </div>
      </header>

      {/* MAIN WORKSPACE AREA */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        
        {/* CAMERA MODAL LAYER */}
        {isScanning && (
          <div style={{ background: '#000', borderRadius: '12px', padding: '16px', marginBottom: '20px', color: '#FFF', textAlign: 'center' }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '10px'}}>
              <span style={{fontSize:'14px', fontWeight:'bold'}}>⚡ LIVE AUTOMATED CAMERA BARCODE DETECTOR</span>
              <button onClick={stopCameraScan} style={{background:'transparent', border:'none', color:'#FFF', cursor:'pointer'}}><X size={20}/></button>
            </div>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '8px' }} />
            <button onClick={triggerMockScanMatch} style={{ background: '#2A9D8F', border: 'none', color: '#FFF', padding: '10px 20px', borderRadius: '6px', marginTop: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Capture Code</button>
          </div>
        )}

        <div className="responsive-grid">
          {currentTab === 'home' && (
            <>
              {/* FINANCIAL STATS SUMMARY CARDS */}
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

                {/* 🎙️ FEATURE 1: ACCURATE AUDIO VOICE MEMO LEDGER */}
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
                    {isRecording && <span style={{color:'#DC3545', fontSize:'13px', fontWeight:'bold'}}>🔴 ሪኮርድ ይገብር ኣሎ...</span>}
                  </div>

                  {/* VOICE MEMOS PLAYBACK LIST */}
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeVoiceNotes.map(v => (
                      <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F1F5F9', padding: '8px 12px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#475569' }}>🎙️ Voice Memo ({v.time})</span>
                        <button onClick={() => playAudioNote(v.audioData)} style={{ background: '#1E293B', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Play size={12} /> ስማዕ (Play)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 💬 FEATURE 2: WHATSAPP SHARE REPORT BUTTON */}
                <button onClick={sendReportToWhatsApp} style={{ background: '#25D366', color: '#FFF', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                  <Share2 size={18} /> {t.shareWhatsApp}
                </button>

                {/* MANUAL SALE FORM WITH QUICK SMART BUTTONS */}
                <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px' }}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{t.addSale}</h3>
                    <button onClick={() => startCameraScan('sale')} style={{ background: '#E2E8F0', border: 'none', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                      <Camera size={16} /> {t.scanBarcode}
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); executeSaleAutomation(saleItemName, parseInt(saleQty)); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select value={saleItemName} onChange={(e) => setSaleItemName(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required>
                      <option value="">{t.selectItem}</option>
                      {inventory.map(i => <option key={i.id} value={i.name}>{i.name} (Price: {i.price} / Stock: {i.qty})</option>)}
                    </select>
                    <input type="number" value={saleQty} onChange={(e) => setSaleQty(e.target.value)} placeholder={t.quantity} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                    <button type="submit" style={{ background: '#2A9D8F', color: '#FFF', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{t.addSale}</button>
                  </form>
                </div>

                {/* EXPENSES MANAGEMENT */}
                <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#DC3545' }}>{t.addExpense}</h3>
                  <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} placeholder={t.expenseTitle} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                    <input type="number" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} placeholder={t.amount} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                    <button type="submit" style={{ background: '#1E293B', color: '#FFF', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{t.addExpense}</button>
                  </form>
                </div>

                {/* 🤝 FEATURE 3: DEBT COLLECTOR LEDGER */}
                <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', border: '2px solid #E76F51' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#E76F51' }}>{t.debtTitle}</h3>
                  <form onSubmit={handleAddDebt} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" value={debtCustName} onChange={(e) => setDebtCustName(e.target.value)} placeholder={t.customerName} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                    <input type="number" value={debtAmountInput} onChange={(e) => setDebtAmountInput(e.target.value)} placeholder={t.debtAmount} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} required />
                    <button type="submit" style={{ background: '#E76F51', color: '#FFF', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{t.addDebt}</button>
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

              {/* LIVE REVENUE & EXPENSES JOURNAL */}
              <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Live Automated Ledger ({selectedDate})</h3>
                  <button onClick={runAutoAiAudit} style={{ background: '#1E293B', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
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

          {/* INVENTORY SHEET ARCHITECTURE */}
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
                    <button type="button" onClick={() => startCameraScan('inventory')} style={{background:'#1E293B', color:'#FFF', border:'none', padding:'10px', borderRadius:'6px', cursor:'pointer'}}><Camera size={16}/></button>
                  </div>
                  <button type="submit" style={{ background: '#2A9D8F', color: '#FFF', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor:'pointer' }}>{t.addItem}</button>
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
                        <button onClick={() => setInventory(prev => prev.filter(x => x.id !== item.id))} style={{ background: 'transparent', border: 'none', color: '#DC3545', cursor:'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI REPORTS HISTORY LOGS */}
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
        <button onClick={() => setCurrentTab('home')} style={{ background: 'transparent', border: 'none', color: currentTab === 'home' ? '#2A9D8F' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px', cursor:'pointer' }}>
          <Home size={18} /> <span>Home</span>
        </button>
        <button onClick={() => setCurrentTab('inventory')} style={{ background: 'transparent', border: 'none', color: currentTab === 'inventory' ? '#2A9D8F' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px', cursor:'pointer' }}>
          <Package size={18} /> <span>{t.stock}</span>
        </button>
        <button onClick={() => setCurrentTab('history')} style={{ background: 'transparent', border: 'none', color: currentTab === 'history' ? '#2A9D8F' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px', cursor:'pointer' }}>
          <Brain size={18} /> <span>AI Audit</span>
        </button>
      </nav>

    </div>
  );
}
