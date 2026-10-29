"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/content/site.config";
import { formatINR, parseINR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AmountPickerProps {
  selectedAmount: number;
  onAmountChange: (amount: number) => void;
}

export function AmountPicker({
  selectedAmount,
  onAmountChange,
}: AmountPickerProps) {
  const { presetAmounts, minimumAmount, maximumAmount } = siteConfig.donation;
  const isCustom = !presetAmounts.includes(selectedAmount);
  const [customInputValue, setCustomInputValue] = useState(
    isCustom ? selectedAmount.toString() : ""
  );

  const handleSelectPreset = (amount: number) => {
    setCustomInputValue("");
    onAmountChange(amount);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = parseINR(raw);
    setCustomInputValue(raw);
    if (parsed >= minimumAmount && parsed <= maximumAmount) {
      onAmountChange(parsed);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans flex items-center justify-between">
        <span>Select Seva Contribution</span>
        <span className="text-[11px] text-gold-dark lowercase font-normal">
          (cultural auspicious amounts)
        </span>
      </label>

      {/* Preset Amount Chips with Framer layoutId pill */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {presetAmounts.map((amt) => {
          const isSelected = selectedAmount === amt;

          return (
            <button
              key={amt}
              type="button"
              onClick={() => handleSelectPreset(amt)}
              className={cn(
                "relative py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer text-center select-none",
                isSelected
                  ? "border-saffron-deep text-cream bg-saffron-deep shadow-sm"
                  : "border-border bg-paper text-ink hover:border-gold hover:bg-sand/40"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="selectedAmountChip"
                  className="absolute inset-0 bg-saffron-deep rounded-xl z-0"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10 tabular-nums">
                {formatINR(amt)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Amount Input Box */}
      <div className="pt-2">
        <div className="relative rounded-xl border border-border bg-paper focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/30 transition-all flex items-center px-3.5 py-1.5">
          <span className="text-muted font-serif font-bold text-lg select-none mr-2">
            ₹
          </span>
          <input
            type="text"
            inputMode="numeric"
            placeholder={`Or enter other amount (min ₹${minimumAmount})`}
            value={customInputValue}
            onChange={handleCustomChange}
            className="w-full bg-transparent text-sm font-semibold text-ink focus:outline-none tabular-nums placeholder:text-muted/60 placeholder:font-normal"
          />
          {selectedAmount > 0 && (
            <span className="text-xs font-medium text-banyan bg-banyan-light px-2 py-0.5 rounded-full shrink-0">
              {formatINR(selectedAmount)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
