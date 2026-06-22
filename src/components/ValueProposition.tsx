/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Sparkles, CheckCircle2 } from "lucide-react";
import { THEORY_ITEMS } from "../data";

export default function ValueProposition() {
  const [activeId, setActiveId] = useState<string>("theory_01");

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? "" : id);
  };

  return (
    <section
      id="value-proposition"
      className="relative py-24 bg-brand-offwhite text-brand-charcoal border-b border-zinc-200/50"
    >
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/5 rounded-md border border-brand-blue/20 text-brand-blue text-xs font-mono font-medium tracking-tight mb-5">
            <Sparkles className="w-3 h-3 text-brand-blue" />
            <span>THE 3 LAWS OF VISITOR CONVERSION</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-brand-charcoal">
            진짜 지갑을 열게 하는
            <br />
            무소불위 <span className="text-brand-blue">'구매 심리 설계'</span> 3대 핵심 모델
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-650 max-w-xl mx-auto leading-relaxed">
            베이스캠프(Basecamp) 스타일의 고밀도 정렬 설계에 영감을 받아, 독자가 메시지에 압도당하지 않고 한 단계씩 스며들도록 고안된 순차 전환 논리 기법입니다.
          </p>
        </div>

        {/* Interactive Accordion Layout */}
        <div className="space-y-4">
          {THEORY_ITEMS.map((theory) => {
            const isOpen = activeId === theory.id;

            return (
              <div
                key={theory.id}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white border-brand-blue/35 shadow-md shadow-brand-blue/5"
                    : "bg-zinc-200/30 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-200/50"
                }`}
                id={theory.id}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleAccordion(theory.id)}
                  className="w-full p-6 text-left flex items-start sm:items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                  id={`accordion-trigger-${theory.id}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Minimal Core Badge */}
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-brand-charcoal text-brand-offwhite uppercase tracking-wider block shrink-0">
                      {theory.badge}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-sans font-medium text-[13px] sm:text-[14px] text-zinc-500 leading-none mb-1.5 font-mono">
                        {theory.subtitle}
                      </span>
                      <h3 className="font-sans font-bold text-base sm:text-lg md:text-xl text-brand-charcoal tracking-tight leading-tight">
                        {theory.title}
                      </h3>
                    </div>
                  </div>

                  {/* Icon rotation */}
                  <div
                    className={`p-1.5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-brand-blue/10 border-brand-blue/20 text-brand-blue" : "text-zinc-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Smooth expansion content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-zinc-100 bg-zinc-50/50">
                        {/* Summary description paragraph */}
                        <p className="text-sm text-zinc-750 font-sans leading-relaxed mb-6">
                          {theory.description}
                        </p>

                        {/* Extended detail items (rendered beautifully) */}
                        <div className="space-y-3 pt-4 border-t border-zinc-200/60">
                          <span className="font-mono text-[10px] text-zinc-500 tracking-widest font-bold uppercase block mb-2">
                            IMPLEMENTATION PROTOCOL
                          </span>
                          {theory.extendedPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                              <span className="text-xs sm:text-sm text-zinc-800 font-sans leading-relaxed">
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

        {/* Transition statement in middle */}
        <div className="mt-12 text-center p-6 rounded-lg bg-brand-blue/5 border border-brand-blue/10">
          <span className="font-mono text-xs text-brand-blue font-bold tracking-widest block uppercase mb-1">
            Design vs conversion ratio
          </span>
          <span className="text-xs sm:text-sm font-sans font-medium text-zinc-600 block">
            미적 쾌감을 좇는 예술이 아닙니다. 이 방식은 순수한 "매출 유입"을 유인하는 철저하고 합리적인 공학입니다.
          </span>
        </div>

      </div>
    </section>
  );
}
