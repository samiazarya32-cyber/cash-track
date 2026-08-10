"use client";

import React, { useState } from "react";
import { Copy, ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PaymentModal({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "6months" | "annual">("annual");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const myPhoneNumber = "0743227053";
  const accountName = "Yowhannes Kiflay Zera";

  const plans = {
    monthly: { label: "1 ወርሒ", price: "UGX 15,000", rawAmount: 15000, tag: "" },
    "6months": { label: "6 ወርሒ", price: "UGX 90,000", rawAmount: 90000, tag: "ብሉጽ ሕርያ" },
    annual: { label: "1 ዓመት", price: "UGX 125,000", rawAmount: 125000, tag: "Save 30%" },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(myPhoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitTx = async () => {
    if (!transactionId.trim()) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.from("payment_requests").insert([
        {
          user_id: userId,
          plan_selected: selectedPlan,
          amount_ugx: plans[selectedPlan].rawAmount,
          transaction_id: transactionId.trim(),
          status: "PENDING",
        },
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg("ምምዝጋብ ኣይተኻእለን። በጃኹም ደጊምኩም ሙክሩ።");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-950 border border-blue-900/50 rounded-3xl p-6 md:p-8 max-w-lg w-full text-slate-100 shadow-2xl space-y-6">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> 14-Days Free Trial ዛዚሙ ኣሎ
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            SmartBiz PRO ኸፍተካ ቀጽል
          </h2>
          <p className="text-xs text-slate-400">
            ናይ ንግድኻ መክሰብን ወጻኢን ብ AI ንምክትታልን ናይ ሰራሕተኛታት ኣክሰስ ንምቁጽጻርን PRO ኣሕድስ።
          </p>
        </div>

        {/* PLAN SELECTOR */}
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(plans) as Array<keyof typeof plans>).map((planKey) => {
            const plan = plans[planKey];
            const isSelected = selectedPlan === planKey;
            return (
              <button
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`p-3 rounded-2xl border text-center transition-all relative ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {plan.tag && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-[9px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap">
                    {plan.tag}
                  </span>
                )}
                <p className="text-xs font-semibold mt-1">{plan.label}</p>
                <p className="text-xs font-bold text-blue-400 mt-1">{plan.price}</p>
              </button>
            );
          })}
        </div>

        {/* INSTRUCTIONS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span>ክፍሊት እትሰደሉ ሞባይል ማኒ:</span>
            <span className="text-emerald-400 font-medium">Airtel / MTN MoMo</span>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs text-slate-400">ቁጽሪ ስልኪ (Receiver):</p>
              <p className="text-base font-bold text-emerald-400 font-mono">{myPhoneNumber}</p>
              <p className="text-[11px] text-slate-300 font-semibold">{accountName}</p>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 text-slate-200 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed bg-blue-950/30 p-2.5 rounded-lg border border-blue-900/30">
            💡 <strong>ብኸመይ ትከፍል?</strong> ብ Airtel/MTN ን መጠን ክፍሊት <strong>({plans[selectedPlan].price})</strong> ናብቲ ኣብ ላዕሊ ዘሎ ቁጽሪ ስደድ።
          </div>
        </div>

        {/* SUBMISSION FORM */}
        {submitted ? (
          <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm text-emerald-200">ናይ ክፍሊት መረጋገጺ ተቐቢልናዮ ኣለና!</h4>
            <p className="text-xs text-slate-300">
              Transaction ID-ኻ ብኣድማዕነት ተመዝጊቡ ኣሎ። ኣብ ውሽጢ ሕጺር ደቓይቕ ኦዲት ገጽካ PRO ክኸውን እዩ።
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              ዕጸዎ
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
            <label className="text-xs font-semibold text-slate-300 block">
              ክፍሊት ምስ ፈጸምካ ናይ SMS Transaction ID / Ref ኣእቱ:
            </label>
            <input
              type="text"
              placeholder="e.g. 429381029381"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={handleSubmitTx}
              disabled={!transactionId || isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 font-bold text-white py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
            >
              {isSubmitting ? "የረጋግፅ ኣሎ..." : "ክፍሊት ኣረጋግጽ (Activate PRO)"}
              <ArrowRight className="w-4 h-4" />
            </button>
            {/* 3. ኣብዚ ኣብ መወዳእታ ገጽ PAYMENT MODAL */}
      {showPaymentModal && (
        <PaymentModal
          userId={userId}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
          </div>
        )}

      </div>
    </div>
  );
}
