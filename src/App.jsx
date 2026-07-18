import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  Plus, 
  Trash2, 
  Languages, 
  Calendar, 
  Search, 
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

// 1. CONSTANTS & THEME
const COLORS = {
  primary: '#2A9D8F',
  secondary: '#264653',
  accent: '#E76F51',
  background: '#F8F9FA',
  paper: '#FFFFFF',
  text: '#212529',
  textLight: '#6C757D',
  border: '#DEE2E6',
  success: '#198754',
  danger: '#DC3545'
};

const LANGUAGES = {
  ti: {
    title: 'ቢዝነስ ካሽ ትራክ',
    revenue: 'ጠቕላላ ኣታዊ',
    profit: 'ረብሓ (ትርፊ)',
    stock: 'ክፍሊ ንብረት',
    addSale: 'ሽያጭ መዝግብ',
    addItem: 'ሓድሽ ንብረት ወስኽ',
    itemName: 'ስም ፍርያት',
    price: 'ዋጋ',
    quantity: 'ብዝሒ',
    category: 'ዓይነት ቢዝነስ',
    search: 'ኣብዚ ፈልግ...',
    noData: 'ዕለታዊ መዝገብ ባዶ እዩ።',
    date: 'ዕለት',
    action: 'ተግባር'
  },
  en: {
    title: 'Business Cash Track',
    revenue: 'Total Revenue',
    profit: 'Net Profit',
    stock: 'Inventory',
    addSale: 'Record Sale',
    addItem: 'Add New Product',
    itemName: 'Product Name',
    price: 'Price',
    quantity: 'Quantity',
    category: 'Business Type',
    search: 'Search here...',
    noData: 'No records found for today.',
    date: 'Date',
    action: 'Action'
  }
};

const BUSINESS_CATEGORIES = [
  'Retail Shop (ዱኳን)', 
  'Cafe & Restaurant (ካፌ/ቤት መግቢ)', 
  'Electronics (ኤሌክትሮኒክስ)', 
  'Clothing & Apparel (ክዳውንቲ)',
  'Services (ኣገልግሎት)'
];

export default function App() {
  // 2. STATE MANAGEMENT (With LocalStorage Backup)
  const [lang, setLang] = useState('ti');
  const [bizType, setBizType] = useState(BUSINESS_CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real dynamic date initialization
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('ct_inventory');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'ሹኮር (Sugar)', price: 120, qty: 50 },
      { id: '2', name: 'ዘይቲ (Oil)', price: 450, qty: 15 }
    ];
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('ct_sales');
    return saved ? JSON.parse(saved) : [];
  });

  // Form Inputs States (100% Functional Now)
  const [saleItem, setSaleItem] = useState('');
  const [saleQty, setSaleQty] = useState('');
  const [salePrice, setSalePrice] = useState('');

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQty, setNewItemQty] = useState('');

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('ct_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('ct_sales', JSON.stringify(sales));
  }, [sales]);

  const t = LANGUAGES[lang];

  // 3. CORE LOGIC FUNCTIONS
  const handleAddSale = (e) => {
    e.preventDefault();
    if (!saleItem || !saleQty || !salePrice) return;

    const qty = parseInt(saleQty);
    const price = parseFloat(salePrice);
    const total = qty * price;

    // Deduct from inventory if item matches
    setInventory(prev => prev.map(item => {
      if (item.name.toLowerCase() === saleItem.toLowerCase()) {
        return { ...item, qty: Math.max(0, item.qty - qty) };
      }
      return item;
    }));

    const newSale = {
      id: Date.now().toString(),
      name: saleItem,
      qty,
      price,
      total,
      date: selectedDate
    };

    setSales(prev => [newSale, ...prev]);
    setSaleItem('');
    setSaleQty('');
    setSalePrice('');
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemQty) return;

    const itemExists = inventory.find(i => i.name.toLowerCase() === newItemName.toLowerCase());
    
    if (itemExists) {
      setInventory(prev => prev.map(i => 
        i.name.toLowerCase() === newItemName.toLowerCase() 
          ? { ...i, qty: i.qty + parseInt(newItemQty), price: parseFloat(newItemPrice) }
          : i
      ));
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: newItemName,
        price: parseFloat(newItemPrice),
        qty: parseInt(newItemQty)
      };
      setInventory(prev => [...prev, newItem]);
    }

    setNewItemName('');
    setNewItemPrice('');
    setNewItemQty('');
  };

  const handleDeleteSale = (id) => {
    setSales(prev => prev.filter(sale => sale.id !== id));
  };

  // Calculations
  const filteredSales = sales.filter(sale => sale.date === selectedDate);
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  // Simple Profit Model: Assuming 25% margin on gross revenue for generic calculation
  const totalProfit = totalRevenue * 0.25; 

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: COLORS.background, minHeight: '100vh', fontFamily: 'sans-serif', color: COLORS.text }}>
      
      {/* HEADER SECTION */}
      <header style={{ backgroundColor: COLORS.secondary, color: '#white', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#FFF' }}>{t.title}</h1>
        
        {/* Preference / Controls Area */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Real Calendar Input */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '6px', color: '#fff' }}>
            <Calendar size={18} style={{ marginRight: '6px' }} />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', cursor: 'pointer' }}
            />
          </div>

          {/* Business Category Dropdown Search Element */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '6px', color: '#fff' }}>
            <Search size={16} style={{ marginRight: '6px' }} />
            <select 
              value={bizType} 
              onChange={(e) => setBizType(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', cursor: 'pointer' }}
            >
              {BUSINESS_CATEGORIES.map(cat => <option key={cat} value={cat} style={{color: '#000'}}>{cat}</option>)}
            </select>
          </div>

          {/* Language Switcher */}
          <button 
            onClick={() => setLang(lang === 'ti' ? 'en' : 'ti')}
            style={{ background: COLORS.primary, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
          >
            <Languages size={16} />
            {lang === 'ti' ? 'English' : 'ትግርኛ'}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER: Responsive layout grid */}
      <main style={{ maxWith: '1200px', margin: '0 auto', padding: '20px', display: 'grid', gridTemplateColumns: 'window.innerWidth > 900 ? "1fr 1fr" : "1fr"', gap: '24px' }} className="main-grid">
        
        {/* LEFT COLUMN: Metrics & Operations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* STATS CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            <div style={{ background: COLORS.paper, padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: `6px solid ${COLORS.primary}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: COLORS.textLight, fontSize: '14px', marginBottom: '8px' }}>
                <span>{t.revenue}</span>
                <TrendingUp size={20} color={COLORS.primary} />
              </div>
              <h3 style={{ margin: 0, fontSize: '22px' }}>{totalRevenue.toLocaleString()} Nfa</h3>
            </div>

            <div style={{ background: COLORS.paper, padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: `6px solid ${COLORS.accent}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: COLORS.textLight, fontSize: '14px', marginBottom: '8px' }}>
                <span>{t.profit}</span>
                <DollarSign size={20} color={COLORS.accent} />
              </div>
              <h3 style={{ margin: 0, fontSize: '22px' }}>{totalProfit.toLocaleString()} Nfa</h3>
            </div>
          </div>

          {/* RECORD SALE FORM */}
          <div style={{ background: COLORS.paper, padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginTop: 0, fontSize: '18px', color: COLORS.secondary, marginBottom: '16px' }}>{t.addSale}</h2>
            <form onSubmit={handleAddSale} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: COLORS.textLight, marginBottom: '4px' }}>{t.itemName}</label>
                <input 
                  type="text" 
                  placeholder="e.g., Sugar"
                  value={saleItem}
                  onChange={(e) => setSaleItem(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: COLORS.textLight, marginBottom: '4px' }}>{t.quantity}</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={saleQty}
                    onChange={(e) => setSaleQty(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: COLORS.textLight, marginBottom: '4px' }}>{t.price} (Nfa)</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>
              <button type="submit" style={{ background: COLORS.primary, color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>
                {t.addSale}
              </button>
            </form>
          </div>

          {/* INVENTORY MANAGEMENT */}
          <div style={{ background: COLORS.paper, padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginTop: 0, fontSize: '18px', color: COLORS.secondary, marginBottom: '16px' }}>{t.addItem}</h2>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                placeholder={t.itemName}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, boxSizing: 'border-box' }}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input 
                  type="number" 
                  placeholder={t.quantity}
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, boxSizing: 'border-box' }}
                  required
                />
                <input 
                  type="number" 
                  placeholder={`${t.price} (Nfa)`}
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <button type="submit" style={{ background: COLORS.secondary, color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                {t.addItem}
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: Logs & Tables */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* DAILY SALES JOURNAL */}
          <div style={{ background: COLORS.paper, padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', minHeight: '280px' }}>
            <h2 style={{ marginTop: 0, fontSize: '18px', color: COLORS.secondary, marginBottom: '16px' }}>ዕለታዊ መዝገብ ሽያጭ ({selectedDate})</h2>
            
            {filteredSales.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: COLORS.textLight, fontSize: '14px' }}>
                {t.noData}
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${COLORS.border}`, color: COLORS.textLight }}>
                      <th style={{ padding: '10px 6px' }}>{t.itemName}</th>
                      <th style={{ padding: '10px 6px' }}>{t.quantity}</th>
                      <th style={{ padding: '10px 6px' }}>ጠቕላላ</th>
                      <th style={{ padding: '10px 6px', textAlign: 'center' }}>{t.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map(sale => (
                      <tr key={sale.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: '12px 6px', fontWeight: '500' }}>{sale.name}</td>
                        <td style={{ padding: '12px 6px' }}>{sale.qty} × {sale.price}</td>
                        <td style={{ padding: '12px 6px', fontWeight: 'bold' }}>{sale.total} Nfa</td>
                        <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                          <button onClick={() => handleDeleteSale(sale.id)} style={{ background: 'transparent', border: 'none', color: COLORS.danger, cursor: 'pointer', padding: '4px' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* STOCK MONITOR LIST */}
          <div style={{ background: COLORS.paper, padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ marginTop: 0, fontSize: '18px', color: COLORS.secondary, margin: 0 }}>{t.stock} ({filteredInventory.length})</h2>
              <input 
                type="text" 
                placeholder={t.search} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, fontSize: '13px' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
              {filteredInventory.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: COLORS.background, borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: COLORS.textLight }}>ዋጋ፦ {item.price} Nfa</div>
                  </div>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    background: item.qty <= 5 ? 'rgba(220,53,69,0.1)' : 'rgba(25,135,84,0.1)',
                    color: item.qty <= 5 ? COLORS.danger : COLORS.success 
                  }}>
                    {item.qty} left
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* Embedded Simple CSS to handle Device Responsiveness perfectly without media queries break */}
      <style>{`
        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 850px) {
          .main-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
