'use client';

import React, { useState, useEffect } from 'react';
import { db, Transaction, Product } from '@/lib/db';

const translations = {
  ti: {
    title: "Cash Track - ናይ ንግዲ ሓጋዚኻ",
    moneyIn: "ኣታዊ (Money In)",
    moneyOut: "ወጻኢ (Money Out)",
    debtsGiven: "ዘለቅሕክዎ (They Owe Me)",
    debtsTaken: "ዕዳይ (I Owe)",
    addTransaction: "+ ሓድሽ መዝግብ",
    dailyReport: "ናይ WhatsApp ጸብጻብ ኣውጽእ",
    inventory: "ሒሳብ ንዋይ (Stock)",
    amount: "መጠናን (Amount)",
    description: "መግለጺ (Note)",
    contact: "ስም ሰብ/ደናበኛ",
    selectLang: "ቋንቋ ሕረይ",
    save: "መዝግብ",
    addStock: "+ ንዋይ ወስኽ",
    productName: "ስም ንዋይ",
    stockQty: "ብዝሒ (Stock)",
    price: "ዋጋ (Price)"
  },
  am: {
    title: "Cash Track - የንግድ ረዳትዎ",
    moneyIn: "ገቢ (Money In)",
    moneyOut: "ወጪ (Money Out)",
    debtsGiven: "ያበደርኩት (They Owe Me)",
    debtsTaken: "ዕዳዬ (I Owe)",
    addTransaction: "+ አዲስ መዝግብ",
    dailyReport: "የ WhatsApp ሪፖርት አውጣ",
    inventory: "የዕቃ ክምችት (Stock)",
    amount: "መጠን (Amount)",
    description: "መግለጫ (Note)",
    contact: "የሰው/የደንበኛ ስም",
    selectLang: "ቋንቋ ይምረጡ",
    save: "መዝግብ",
    addStock: "+ ዕቃ ጨምር",
    productName: "የዕቃ ስም",
    stockQty: "ብዛት (Stock)",
    price: "ዋጋ (Price)"
  },
  lg: {
    title: "Cash Track - Omuwandiisi",
    moneyIn: "Ezayingidde",
    moneyOut: "Ezafulumye",
    debtsGiven: "Ebanja Lyabwe",
    debtsTaken: "Ebanja Lyange",
    addTransaction: "+ Wandiika",
    dailyReport: "Leta Lipoota ya WhatsApp",
    inventory: "Ebyemagero",
    amount: "Omuwendo",
    description: "Nnyonnyola",
    contact: "Erinnya ry'omukwano",
    selectLang: "Londa Lulimi",
    save: "Tereka",
    addStock: "+ Yongera Ebyemagero",
    productName: "Erinnya ly'ekyemagero",
    stockQty: "Obungi",
    price: "Omuwendo"
  },
  en: {
    title: "Cash Track - Smart Business Assistant",
    moneyIn: "Money In",
    moneyOut: "Money Out",
    debtsGiven: "They Owe Me",
    debtsTaken: "I Owe",
    addTransaction: "+ Add Transaction",
    dailyReport: "Generate WhatsApp Report",
    inventory: "Inventory",
    amount: "Amount",
    description: "Description",
    contact: "Contact Name",
    selectLang: "Language",
    save: "Save",
    addStock: "+ Add Product",
    productName: "Product Name",
    stockQty: "Stock Qty",
    price: "Price"
  }
};

export default function CashTrackApp() {
  const [lang, setLang] = useState<'ti' | 'am' | 'lg' | 'en'>('ti');
  const [currency, setCurrency] = useState<string>('UGX');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Transaction Form States
  const [type, setType] = useState<'INCOME' | 'EXPENSE' | 'DEBT_GIVEN' | 'DEBT_TAKEN'>('INCOME');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');

  // Product Form States
  const [pName, setPName] = useState('');
  const [pStock, setPStock] = useState('');
  const [pPrice, setPPrice] = useState('');

  const t = translations[lang];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allTx = await db.transactions.toArray();
    const allProd = await db.products.toArray();
    setTransactions(allTx.reverse());
    setProducts(allProd);
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    await db.transactions.add({
      type,
      amount: Number(amount),
      currency,
      category: 'General',
      description,
      contactName,
      date: new Date().toISOString()
    });

    setAmount('');
    setDescription('');
    setContactName('');
    loadData();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pStock || !pPrice) return;

    await db.products.add({
      name: pName,
      stock: Number(pStock),
      price: Number(pPrice)
    });

    setPName('');
    setPStock('');
    setPPrice('');
    loadData();
  };

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const totalTheyOweMe = transactions.filter(t => t.type === 'DEBT_GIVEN').reduce((acc, curr) => acc + curr.amount, 0);
  const totalIOwe = transactions.filter(t => t.type === 'DEBT_TAKEN').reduce((acc, curr) => acc + curr.amount, 0);

  const generateWhatsAppReport = () => {
    const today = new Date().toLocaleDateString();
    const message = `📊 *CASH TRACK DAILY REPORT* 📊\n📅 Date: ${today}\n\n💰 *${t.moneyIn}:* ${currency} ${totalIncome.toLocaleString()}\n💸 *${t.moneyOut}:* ${currency} ${totalExpense.toLocaleString()}\n🤝 *${t.debtsGiven}:* ${currency} ${totalTheyOweMe.toLocaleString()}\n⚠️ *${t.debtsTaken}:* ${currency} ${totalIOwe.toLocaleString()}\n\n📈 *Net Cash Flow:* ${currency} ${(totalIncome - totalExpense).toLocaleString()}\n\n_Generated automatically via Cash Track PWA_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-900 tracking-tight">{t.title}</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">100% Offline-First • Multi-Currency Accounting</p>
        </div>

        <div className="flex gap-2">
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg bg-white shadow-sm font-bold text-sm focus:outline-none"
          >
            <option value="UGX">UGX (USh)</option>
            <option value="USD">USD ($)</option>
            <option value="KES">KES (KSh)</option>
            <option value="ERN">ERN (Nkf)</option>
            <option value="ETB">ETB (Br)</option>
          </select>

          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as any)}
            className="p-2 border border-slate-300 rounded-lg bg-white shadow-sm font-bold text-sm focus:outline-none"
          >
            <option value="ti">ትግርኛ</option>
            <option value="am">ኣምሓርኛ</option>
            <option value="lg">Luganda</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">{t.moneyIn}</span>
          <p className="text-lg md:text-2xl font-black text-emerald-800 mt-1">{currency} {totalIncome.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl shadow-sm">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">{t.moneyOut}</span>
          <p className="text-lg md:text-2xl font-black text-rose-800 mt-1">{currency} {totalExpense.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">{t.debtsGiven}</span>
          <p className="text-lg md:text-2xl font-black text-amber-800 mt-1">{currency} {totalTheyOweMe.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl shadow-sm">
          <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">{t.debtsTaken}</span>
          <p className="text-lg md:text-2xl font-black text-purple-800 mt-1">{currency} {totalIOwe.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Transaction Entry & WhatsApp */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4">{t.addTransaction}</h2>
            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full mt-1 p-3 border rounded-lg bg-slate-50 font-semibold text-sm"
                >
                  <option value="INCOME">📥 {t.moneyIn}</option>
                  <option value="EXPENSE">📤 {t.moneyOut}</option>
                  <option value="DEBT_GIVEN">🤝 {t.debtsGiven}</option>
                  <option value="DEBT_TAKEN">⚠️ {t.debtsTaken}</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.amount} ({currency})</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1 p-3 border rounded-lg text-lg font-bold"
                  required
                />
              </div>

              {(type === 'DEBT_GIVEN' || type === 'DEBT_TAKEN') && (
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.contact}</label>
                  <input 
                    type="text" 
                    value={contactName} 
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Samuel"
                    className="w-full mt-1 p-3 border rounded-lg text-sm"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.description}</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Daily sales / Rent"
                  className="w-full mt-1 p-3 border rounded-lg text-sm"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-blue-900 text-white font-bold text-sm rounded-lg hover:bg-blue-800 transition"
              >
                {t.save}
              </button>
            </form>

            <button 
              onClick={generateWhatsAppReport}
              className="w-full mt-3 py-3 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-500 transition flex items-center justify-center gap-2"
            >
              💬 {t.dailyReport}
            </button>
          </div>

          {/* Quick Inventory Add */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4">{t.addStock}</h2>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <input 
                type="text" 
                placeholder={t.productName}
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  placeholder={t.stockQty}
                  value={pStock}
                  onChange={(e) => setPStock(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  required
                />
                <input 
                  type="number" 
                  placeholder={t.price}
                  value={pPrice}
                  onChange={(e) => setPPrice(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2 bg-slate-800 text-white font-bold text-xs rounded hover:bg-slate-700"
              >
                + Save Product
              </button>
            </form>
          </div>
        </div>

        {/* Right Section: Transaction History & Inventory Status */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* History */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4">መዝገብ መዓልታዊ ንግዲ (Transactions)</h2>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {transactions.length === 0 ? (
                <p className="text-slate-400 text-sm">ገና ዝተመዝገበ የለን (No records yet)</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-3 border-b hover:bg-slate-50 transition">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800' :
                        tx.type === 'EXPENSE' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.type}
                      </span>
                      <p className="font-semibold text-slate-800 text-sm mt-1">{tx.description || 'General'}</p>
                      {tx.contactName && <p className="text-xs text-slate-500">Contact: {tx.contactName}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{tx.currency} {tx.amount.toLocaleString()}</p>
                      <span className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stock Display */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-3">{t.inventory} ({t.stockItems})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {products.length === 0 ? (
                <p className="text-slate-400 text-sm col-span-full">ንዋይ ኣይተመዝገበን (No products added)</p>
              ) : (
                products.map((p) => (
                  <div key={p.id} className="p-3 border rounded-lg bg-slate-50">
                    <p className="font-bold text-sm text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Stock: <span className="font-bold text-blue-900">{p.stock}</span></p>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">{currency} {p.price.toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
