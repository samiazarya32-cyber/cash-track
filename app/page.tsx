'use client';

import React, { useState, useEffect } from 'react';
import { db, Transaction, Product } from '@/lib/db';

// 1. Multi-Language Dictionary Engine
const translations = {
  ti: {
    title: "Cash Track - ናይ ንግዲ ሓጋዚኻ",
    moneyIn: "ኣታዊ (Money In)",
    moneyOut: "ወጻኢ (Money Out)",
    debtsGiven: "ዘለቅሕክዎ (They Owe Me)",
    debtsTaken: "ዕዳይ (I Owe)",
    addTransaction: "+ ሓድሽ መዝግብ",
    dailyReport: "ናይ WhatsApp ጸብጻብ ኣውጽእ",
    inventory: "ሒሳብ ንብረት (Stock)",
    amount: "መጠናን (Amount)",
    description: "መግለጺ (Note)",
    contact: "ስም ሰብ",
    selectLang: "ቋንቋ ሕረይ",
    save: "መዝግብ",
    stockItems: "ዘለዉ ንብረት"
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
    stockItems: "ያሉ ዕቃዎች"
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
    stockItems: "Ebyemagero Ebibaamu"
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
    stockItems: "Stock Items"
  }
};

export default function CashTrackApp() {
  const [lang, setLang] = useState<'ti' | 'am' | 'lg' | 'en'>('ti');
  const [currency, setCurrency] = useState<string>('UGX');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Form States
  const [type, setType] = useState<'INCOME' | 'EXPENSE' | 'DEBT_GIVEN' | 'DEBT_TAKEN'>('INCOME');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');

  const t = translations[lang];

  // Load Offline Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allTx = await db.transactions.toArray();
    const allProd = await db.products.toArray();
    setTransactions(allTx.reverse());
    setProducts(allProd);
  };

  const handleSave = async (e: React.FormEvent) => {
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

  // Compute Totals
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const totalTheyOweMe = transactions.filter(t => t.type === 'DEBT_GIVEN').reduce((acc, curr) => acc + curr.amount, 0);
  const totalIOwe = transactions.filter(t => t.type === 'DEBT_TAKEN').reduce((acc, curr) => acc + curr.amount, 0);

  // WhatsApp Nightly Summary Generator
  const generateWhatsAppReport = () => {
    const today = new Date().toLocaleDateString();
    const message = `📊 *CASH TRACK DAILY REPORT* 📊\n📅 Date: ${today}\n\n💰 *${t.moneyIn}:* ${currency} ${totalIncome.toLocaleString()}\n💸 *${t.moneyOut}:* ${currency} ${totalExpense.toLocaleString()}\n🤝 *${t.debtsGiven}:* ${currency} ${totalTheyOweMe.toLocaleString()}\n⚠️ *${t.debtsTaken}:* ${currency} ${totalIOwe.toLocaleString()}\n\n📈 *Net Balance:* ${currency} ${(totalIncome - totalExpense).toLocaleString()}\n\n_Sent automatically via Cash Track PWA_`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMsg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      {/* Header Bar */}
      <header className="flex flex-wrap justify-between items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">{t.title}</h1>
          <p className="text-sm text-slate-500">Offline-First Accounting & Cash Flow</p>
        </div>

        {/* Language & Currency Controls */}
        <div className="flex gap-2">
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border rounded-lg bg-white shadow-sm font-semibold"
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
            className="p-2 border rounded-lg bg-white shadow-sm font-semibold"
          >
            <option value="ti">ትግርኛ</option>
            <option value="am">ኣምሓርኛ</option>
            <option value="lg">Luganda</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="text-xs font-bold text-emerald-600 uppercase">{t.moneyIn}</span>
          <p className="text-xl md:text-2xl font-black text-emerald-700 mt-1">{currency} {totalIncome.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
          <span className="text-xs font-bold text-rose-600 uppercase">{t.moneyOut}</span>
          <p className="text-xl md:text-2xl font-black text-rose-700 mt-1">{currency} {totalExpense.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-xs font-bold text-amber-600 uppercase">{t.debtsGiven}</span>
          <p className="text-xl md:text-2xl font-black text-amber-700 mt-1">{currency} {totalTheyOweMe.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <span className="text-xs font-bold text-purple-600 uppercase">{t.debtsTaken}</span>
          <p className="text-xl md:text-2xl font-black text-purple-700 mt-1">{currency} {totalIOwe.toLocaleString()}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Entry Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{t.addTransaction}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">ዓይነት (Type)</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as any)}
                className="w-full mt-1 p-3 border rounded-lg bg-slate-50 font-medium"
              >
                <option value="INCOME">📥 {t.moneyIn}</option>
                <option value="EXPENSE">📤 {t.moneyOut}</option>
                <option value="DEBT_GIVEN">🤝 {t.debtsGiven}</option>
                <option value="DEBT_TAKEN">⚠️ {t.debtsTaken}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">{t.amount} ({currency})</label>
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
                <label className="text-xs font-bold text-slate-500 uppercase">{t.contact}</label>
                <input 
                  type="text" 
                  value={contactName} 
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Samuel / John"
                  className="w-full mt-1 p-3 border rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">{t.description}</label>
              <input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Sales / Shop rent"
                className="w-full mt-1 p-3 border rounded-lg"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition"
            >
              {t.save}
            </button>
          </form>

          <button 
            onClick={generateWhatsAppReport}
            className="w-full mt-4 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition flex items-center justify-center gap-2"
          >
            💬 {t.dailyReport}
          </button>
        </div>

        {/* Transactions History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">መዝገብ መዓልታዊ ንግዲ (Recent History)</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="text-slate-400 text-sm">ገና ዝተመዝገበ የለን (No records yet)</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-3 border-b hover:bg-slate-50">
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800' :
                      tx.type === 'EXPENSE' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tx.type}
                    </span>
                    <p className="font-semibold text-slate-800 mt-1">{tx.description || 'General'}</p>
                    {tx.contactName && <p className="text-xs text-slate-500">Contact: {tx.contactName}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base">{tx.currency} {tx.amount.toLocaleString()}</p>
                    <span className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
