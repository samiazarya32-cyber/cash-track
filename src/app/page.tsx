"use client";

import React, { useState } from "react";
import { useAIAudit } from "@/hooks/useAIAudit";
import {
  Home,
  ArrowDownCircle,
  ArrowUpCircle,
  Package,
  ShoppingCart,
  Brain,
  CreditCard,
  User,
  Edit2,
  Lock,
  MessageSquare,
  Building2,
  Plus,
  Check,
} from "lucide-react";

// --- TYPES & ROLES ---
type Role = "OWNER" | "MANAGER" | "CASHIER";

type BusinessType =
  | "Salon"
  | "Bar & Restaurant"
  | "Mini-Market"
  | "Pharmacy"
  | "Boutique"
  | "Hardware"
  | "Coffee Shop"
  | "Clinic"
  | "Electronics"
  | "Auto Repair"
  | "Rental";

interface Transaction {
  id: string;
  type: "IN" | "OUT";
  amount: number;
  category: string;
  note: string;
  date: string;
  dueDate?: string;
  createdBy: string;
}

export default function SmartBizApp() {
  // Demo IDs (ደሓር ካብ Supabase Auth ዝመጹ)
  const userId = "owner-uuid-123";
  const businessId = "business-uuid-456";

  // AI Guardrail Hook
  const { triggerAudit, loading, auditResult, errorMsg } = useAIAudit(userId, businessId);
  // --- GLOBAL STATES ---
  const [currentRole, setCurrentRole] = useState<Role>("OWNER");
  const [businessType, setBusinessType] = useState<BusinessType>("Mini-Market");
  const [activeTab, setActiveTab] = useState<string>("home");

  // Sample State Data with Inline Edit functionality
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "IN",
      amount: 150000,
      category: "Sales",
      note: "Daily POS Sales",
      date: "2026-08-10",
      createdBy: "Sara (Cashier)",
    },
    {
      id: "2",
      type: "OUT",
      amount: 45000,
      category: "Rent/Supplies",
      note: "Shop Cleaning Materials",
      date: "2026-08-09",
      createdBy: "Admin",
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  // Form input states
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");

  // --- ACTIONS ---
  const handleAddTransaction = (type: "IN" | "OUT") => {
    if (!amount) return;
    const newTx: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category: type === "IN" ? "ኣታዊ (Income)" : "ወጻኢ (Expense)",
      note: note || (type === "IN" ? "General Sale" : "General Expense"),
      date: new Date().toISOString().split("T")[0],
      dueDate: type === "IN" && dueDate ? dueDate : undefined,
      createdBy: currentRole === "CASHIER" ? "Sara (Cashier)" : "Owner",
    };
    setTransactions([newTx, ...transactions]);
    setAmount("");
    setNote("");
    setDueDate("");
  };

  const startEditing = (tx: Transaction) => {
    setEditingId(tx.id);
    setEditForm(tx);
  };

  const saveEdit = (id: string) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? ({ ...t, ...editForm } as Transaction) : t))
    );
    setEditingId(null);
  };

  // --- NAVIGATION ITEMS BY ROLE ---
  const navItems = [
    { id: "home", label: "Home", icon: Home, roles: ["OWNER", "MANAGER", "CASHIER"] },
    { id: "in", label: "ኣታዊ", icon: ArrowDownCircle, roles: ["OWNER", "MANAGER", "CASHIER"] },
    { id: "out", label: "ወጻኢ", icon: ArrowUpCircle, roles: ["OWNER", "MANAGER"] },
    { id: "stock", label: "ንብረት", icon: Package, roles: ["OWNER", "MANAGER", "CASHIER"] },
    { id: "sales", label: "ሽያጥ (POS)", icon: ShoppingCart, roles: ["OWNER", "MANAGER", "CASHIER"] },
    { id: "debt", label: "ዕዳ", icon: CreditCard, roles: ["OWNER", "MANAGER"] },
    { id: "audit", label: "AI ኦዲት", icon: Brain, roles: ["OWNER"] },
    { id: "profile", label: "ፕሮፋይል", icon: User, roles: ["OWNER", "MANAGER", "CASHIER"] },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">SmartBiz AI</h1>
            <span className="text-xs text-blue-400 font-medium">{businessType}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Role Switcher */}
        <div className="pt-4 border-t border-slate-800">
          <label className="text-xs text-slate-500 mb-2 block font-semibold uppercase">
            Role Switcher (Security Demo)
          </label>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as Role)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="OWNER">Owner (Full Access)</option>
            <option value="MANAGER">Manager</option>
            <option value="CASHIER">Cashier (Restricted)</option>
          </select>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOP TASKBAR */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">ዓይነት ንግዲ:</span>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-sm text-blue-400 font-semibold focus:outline-none"
            >
              <option value="Mini-Market">Mini-Market / ሱቕ</option>
              <option value="Salon">Salon / ሳሎን</option>
              <option value="Bar & Restaurant">Bar & Restaurant</option>
              <option value="Pharmacy">Pharmacy / ፋርማሲ</option>
              <option value="Boutique">Boutique / ክዳውንቲ</option>
              <option value="Hardware">Hardware / ሃርድዌር</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-950 text-blue-400 border border-blue-800 rounded-full text-xs font-semibold">
              Role: {currentRole}
            </span>
          </div>
        </header>

        {/* DYNAMIC CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {/* 1. HOME DASHBOARD */}
          {activeTab === "home" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <span className="text-sm text-slate-400">Total Money In (ኣታዊ)</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    UGX {transactions.filter((t) => t.type === "IN").reduce((a, b) => a + b.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <span className="text-sm text-slate-400">Total Money Out (ወጻኢ)</span>
                  <p className="text-2xl font-bold text-rose-400 mt-1">
                    UGX {transactions.filter((t) => t.type === "OUT").reduce((a, b) => a + b.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <span className="text-sm text-slate-400">Net Profit (መክሰብ)</span>
                  <p className="text-2xl font-bold text-blue-400 mt-1">
                    UGX{" "}
                    {(
                      transactions.filter((t) => t.type === "IN").reduce((a, b) => a + b.amount, 0) -
                      transactions.filter((t) => t.type === "OUT").reduce((a, b) => a + b.amount, 0)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* QUICK INLINE ENTRY */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-base font-bold mb-4">ቕልጡፍ መዝገብ (Quick Transaction Entry)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="number"
                    placeholder="መጠናን (Amount UGX)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="መብራህረሂ (Note)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddTransaction("IN")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm rounded-xl py-3 transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> ኣታዊ
                    </button>
                    {currentRole !== "CASHIER" && (
                      <button
                        onClick={() => handleAddTransaction("OUT")}
                        className="flex-1 bg-rose-600 hover:bg-rose-500 font-semibold text-sm rounded-xl py-3 transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> ወጻኢ
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* TRANSACTIONS LIST WITH INLINE EDIT */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6">
                <h3 className="text-base font-bold mb-4">ሕሉፍ መዝገብ (Editable History)</h3>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800/80"
                    >
                      {editingId === tx.id ? (
                        <div className="flex-1 grid grid-cols-3 gap-2 mr-4">
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm({ ...editForm, amount: parseFloat(e.target.value) })
                            }
                            className="bg-slate-800 p-2 text-sm rounded border border-blue-500"
                          />
                          <input
                            type="text"
                            value={editForm.note}
                            onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                            className="bg-slate-800 p-2 text-sm rounded border border-blue-500"
                          />
                          <button
                            onClick={() => saveEdit(tx.id)}
                            className="bg-blue-600 px-3 py-1 rounded text-xs font-bold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                tx.type === "IN"
                                  ? "bg-emerald-950 text-emerald-400"
                                  : "bg-rose-950 text-rose-400"
                              }`}
                            >
                              {tx.type === "IN" ? (
                                <ArrowDownCircle className="w-5 h-5" />
                              ) : (
                                <ArrowUpCircle className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{tx.note}</p>
                              <span className="text-xs text-slate-500">
                                {tx.date} • {tx.createdBy}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`font-bold text-sm ${
                                tx.type === "IN" ? "text-emerald-400" : "text-rose-400"
                              }`}
                            >
                              {tx.type === "IN" ? "+" : "-"} UGX {tx.amount.toLocaleString()}
                            </span>
                            <button
                              onClick={() => startEditing(tx)}
                              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. DEEP AI AUDIT TAB (OWNER ONLY) */}
          
          {activeTab === "audit" && (
           <div className="space-y-6">
           {currentRole === "OWNER" ? (
             <div className="bg-slate-950 p-6 rounded-2xl border border-blue-900/40">
             <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
               <Brain className="w-6 h-6 text-blue-400" />
                <h2 className="text-lg font-bold">Deep AI Financial Audit & Advisory</h2>
          </div>

          {/* AI TRIGGER BUTTON */}
          <button
            onClick={triggerAudit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            {loading ? "AI ኦዲት የካይድ ኣሎ..." : "Run New AI Audit"}
          </button>
        </div>

        {/* COST LIMIT ERROR MESSAGE */}
        {errorMsg && (
          <div className="mb-4 p-4 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        {/* AI AUDIT RESULT */}
        {auditResult ? (
          <div className="p-4 bg-blue-950/20 border border-blue-800/30 rounded-xl space-y-3 text-slate-200 text-sm leading-relaxed">
            <p className="font-semibold text-blue-400">💡 ናይ AI ኦዲት ጸብጻብ (ትግርኛ):</p>
            <p>{auditResult}</p>
          </div>
        ) : (
          !errorMsg && (
            <p className="text-slate-400 text-sm">
              "Run New AI Audit" ዝብል ጠዉቕ እሞ ናይዚ ወርሒ ናይ መክሰብን ወጻኢን AI ትንተና ርአ።
            </p>
          )
        )}
      </div>
    ) : (
      <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center">
        <Lock className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-200">Restricted Access</h3>
        <p className="text-sm text-slate-400 mt-1">
          ናይ AI ኦዲት ገጽ ን Owner ጥራይ ዝተፈቐደ እዩ።
        </p>
      </div>
    )}
  </div>
)}   

          {/* 3. WHATSAPP & DEBT TRACKER */}
          {activeTab === "debt" && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold">Smart Debt & Automated Reminder Hub</h2>
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Daniel Tekle (ለቃሕ)</p>
                  <p className="text-xs text-rose-400">Due Date: 2026-08-12 (2 Days Remaining)</p>
                  <p className="text-sm font-bold text-slate-200 mt-1">UGX 120,000</p>
                </div>
                <button
                  onClick={() =>
                    alert(
                      "WhatsApp Message Prepared:\n'ሰላም Daniel፣ ካብ [SmartBiz] እዩ። እቲ ዝወሰድካዮ UGX 120,000 ዕዳ መከፈሊ ዕለቱ ፅባሕ ስለ ዝኾነ ብስምረት ክትከፍለና ንሕብር።'"
                    )
                  }
                  className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Send WhatsApp Reminder
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
