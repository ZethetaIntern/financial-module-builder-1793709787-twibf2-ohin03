"use client";

import { useMemo } from "react";
import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";
import { Calculator, TrendingUp } from "lucide-react";

interface FinancialCalculatorBlockProps {
  block: BaseBlock;
}

export default function FinancialCalculatorBlock({
  block,
}: FinancialCalculatorBlockProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const principal = Number(block.content.principal ?? 10000);
  const rate = Number(block.content.rate ?? 8);
  const years = Number(block.content.years ?? 5);
  const frequency = Number(block.content.frequency ?? 12);

  const results = useMemo(() => {
    const validPrincipal = Math.max(0, principal);
    const validRate = Math.max(0, rate);
    const validYears = Math.max(0, years);
    const validFrequency = Math.max(1, frequency);

    const futureValue =
      validRate === 0
        ? validPrincipal
        : validPrincipal *
          Math.pow(
            1 + validRate / 100 / validFrequency,
            validFrequency * validYears
          );

    return {
      futureValue,
      interest: futureValue - validPrincipal,
    };
  }, [principal, rate, years, frequency]);

  function updateContent(key: string, value: number) {
    updateBlock(block.id, {
      content: {
        ...block.content,
        [key]: value,
      },
    });
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  return (
    <div className="space-y-5 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
      <div className="flex items-center gap-2">
        <Calculator size={20} className="text-indigo-400" />
        <h3 className="font-semibold text-white">
          Compound Interest Calculator
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-300">
          Principal Amount ($)
          <input
            type="number"
            min="0"
            value={principal}
            onChange={(event) =>
              updateContent("principal", Math.max(0, Number(event.target.value)))
            }
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
          />
        </label>

        <label className="text-sm text-slate-300">
          Annual Interest Rate (%)
          <input
            type="number"
            min="0"
            step="0.1"
            value={rate}
            onChange={(event) =>
              updateContent("rate", Math.max(0, Number(event.target.value)))
            }
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
          />
        </label>

        <label className="text-sm text-slate-300">
          Duration (Years)
          <input
            type="number"
            min="0"
            step="1"
            value={years}
            onChange={(event) =>
              updateContent("years", Math.max(0, Number(event.target.value)))
            }
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
          />
        </label>

        <label className="text-sm text-slate-300">
          Compounding Frequency
          <select
            value={frequency}
            onChange={(event) =>
              updateContent("frequency", Number(event.target.value))
            }
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
          >
            <option value={1}>Annually</option>
            <option value={2}>Semi-annually</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
            <option value={365}>Daily</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
          <p className="text-xs text-slate-400">Future Value</p>
          <p className="mt-2 text-xl font-bold text-indigo-300">
            {formatter.format(results.futureValue)}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp size={16} />
            <p className="text-xs">Total Interest Earned</p>
          </div>
          <p className="mt-2 text-xl font-bold text-emerald-300">
            {formatter.format(results.interest)}
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        Formula: A = P(1 + r/n)^(nt). This is an educational estimate,
        not a guaranteed investment return.
      </p>
    </div>
  );
}
