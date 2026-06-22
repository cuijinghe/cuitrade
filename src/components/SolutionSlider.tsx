/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRightLeft, ArrowRight, Play, Clock, Sparkles, Send, Flame, RefreshCw } from "lucide-react";
import { BEFORE_AFTER_DATA } from "../data";

export default function SolutionSlider() {
  // Slider position from 0 to 100
  const [sliderVal, setSliderVal] = useState<number>(50);

  // Derive simulated metrics based on slider sliderVal
  // At 0% (Pure Fancy), conversion is 0.2%, Bounce is 85%
  // At 100% (Pure Psychology), conversion is 7.4%, Bounce is 28%
  const simulatedConversion = (0.2 + (sliderVal / 100) * 7.2).toFixed(1);
  const simulatedBounce = (85 - (sliderVal / 100) * 57).toFixed(0);

  return (
    <section
      id="solution-slider"
      className="relative py-24 bg-zinc-50 border-b border-zinc-200/50 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-charcoal/5 rounded-md border border-brand-charcoal/10 text-brand-charcoal text-xs font-mono font-medium tracking-tight mb-5">
            <ArrowRightLeft className="w-3.5 h-3.5 text-brand-charcoal" />
            <span>INTERACTIVE SIMULATOR & WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-brand-charcoal">
            디자인 중심 vs 구매 심리 중심
            <br />
            당신의 웹사이트는 어디에 머물러 있습니까?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-650 leading-relaxed">
            슬라이더를 좌우로 움직여 보십시오. 화려함 위주의 과시형 디자인과 본질을 꿰뚫는 의무 구매 심리 설계의 대비율이 전환율과 이탈 수치에 어떤 즉각적 영향을 끼치는지 직접 실감할 수 있습니다.
          </p>
        </div>

        {/* Live Interactive Simulator Segment */}
        <div className="max-w-4xl mx-auto bg-white border border-zinc-200 shadow-xl rounded-2xl p-6 sm:p-8 mb-20 relative">
          
          {/* Header Dashboard of Simulator */}
          <div className="grid grid-cols-2 gap-4 border-b border-zinc-150 pb-6 mb-8 text-center bg-zinc-50/50 p-4 rounded-xl">
            <div>
              <span className="font-mono text-xs text-zinc-500 font-bold block uppercase tracking-wider">이탈률 (Bounce Rate)</span>
              <span className="text-2xl sm:text-4xl font-mono font-bold tracking-tight text-brand-orange mt-1 block">
                {simulatedBounce}%
              </span>
              <span className="text-[10px] sm:text-xs text-zinc-400 block mt-1">낮을수록 건강함</span>
            </div>
            
            <div className="border-l border-zinc-200">
              <span className="font-mono text-xs text-zinc-500 font-bold block uppercase tracking-wider">전환율 (Conversion Rate)</span>
              <span className="text-2xl sm:text-4xl font-mono font-bold tracking-tight text-brand-blue mt-1 block">
                {simulatedConversion}%
              </span>
              <span className="text-[10px] sm:text-xs text-zinc-400 block mt-1">높을수록 돈을 범</span>
            </div>
          </div>

          {/* Draggable Area Panel */}
          <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-200/80 mb-6 select-none bg-zinc-950">
            {/* Background 1: FANCY DESIGN (Left / Lower layer) */}
            <div className="absolute inset-0 bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between">
              <div className="max-w-xs text-zinc-400">
                <span className="text-xs font-mono text-brand-orange uppercase font-bold tracking-wider">Design Priority</span>
                <h4 className="text-white text-lg font-bold mt-1">겉만 화려한 미술 지면</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  3D 그래픽 범벅, 철학적인 불명확 카피, 꽁꽁 숨겨진 신청 버튼
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-500">
                SCENE PREVIEW: BOUNCE ACCELERATING
              </div>
            </div>

            {/* Background 2: PURCHASE PSYCHOLOGY (Right / Over layer with dynamic clipping width) */}
            <div 
              className="absolute inset-y-0 left-0 bg-brand-blue border-r-2 border-white p-6 flex flex-col justify-between overflow-hidden transition-all duration-75 select-none"
              style={{ width: `${sliderVal}%` }}
            >
              <div className="min-w-[280px] sm:min-w-[420px] text-brand-offwhite">
                <span className="text-xs font-mono text-white/80 uppercase font-black tracking-widest bg-white/10 px-2 py-0.5 rounded-full inline-block">Psychology Optimized</span>
                <h4 className="text-white text-lg sm:text-xl font-bold mt-2">구매 마인드 정밀 설계</h4>
                <p className="text-xs text-white/90 mt-2 leading-relaxed max-w-sm">
                  첫 스크롤 이탈 방지 메시지, 뇌가 한 번에 삼키는 인지적 유창성, 마찰력 제거 폼
                </p>
              </div>
              <div className="font-mono text-[10px] text-white/70 min-w-[280px]">
                🎯 OPTIMAL CONVERSION METRIC APPLIED
              </div>
            </div>

            {/* Slider visual line */}
            <div 
              className="absolute inset-y-0 pointer-events-none"
              style={{ left: `${sliderVal}%` }}
            >
              <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 w-10 h-10 rounded-full bg-white text-brand-charcoal border-2 border-brand-blue flex items-center justify-center shadow-lg pointer-events-none">
                <ArrowRightLeft className="w-5 h-5 text-brand-blue animate-pulse" />
              </div>
            </div>
          </div>

          {/* Range Slider controller */}
          <div className="flex flex-col gap-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
              id="slider-control"
            />
            <div className="flex justify-between text-xs font-mono text-zinc-400 mt-2">
              <span className="font-bold text-brand-orange flex items-center gap-1">◀ 화려한 이쁜 쓰레기 (0%)</span>
              <span className="font-bold text-brand-blue flex items-center gap-1">구매 심리 완벽 설계 (100%) ▶</span>
            </div>
          </div>

        </div>

        {/* Static Before & After Table Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          {/* BEFORE: Fancy Garbage Card */}
          <div className={`p-8 rounded-2xl ${BEFORE_AFTER_DATA.before.bgClass} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping"></span>
                <h3 className="text-lg sm:text-xl font-sans font-bold text-brand-charcoal">
                  {BEFORE_AFTER_DATA.before.title}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {BEFORE_AFTER_DATA.before.tags.map((tag, idx) => (
                  <span key={idx} className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-md bg-zinc-200 text-zinc-700">
                    {tag}
                  </span>
                ))}
              </div>

              <ul className="space-y-3.5">
                {BEFORE_AFTER_DATA.before.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-zinc-650 text-xs sm:text-sm leading-relaxed">
                    <span className="text-brand-orange font-bold font-mono mt-0.5">·</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 pt-4 border-t border-zinc-200 text-brand-orange font-mono text-xs font-bold tracking-widest">
              RESULT: HIGH BOUNCE & ZERO SALES
            </div>
          </div>

          {/* AFTER: Psychology Optimized Card */}
          <div className={`p-8 rounded-2xl ${BEFORE_AFTER_DATA.after.bgClass} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-ping"></span>
                <h3 className="text-lg sm:text-xl font-sans font-bold text-brand-charcoal">
                  {BEFORE_AFTER_DATA.after.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {BEFORE_AFTER_DATA.after.tags.map((tag, idx) => (
                  <span key={idx} className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-md bg-brand-blue/10 text-brand-blue">
                    {tag}
                  </span>
                ))}
              </div>

              <ul className="space-y-3.5">
                {BEFORE_AFTER_DATA.after.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-zinc-800 text-xs sm:text-sm leading-relaxed">
                    <span className="text-brand-blue font-bold font-mono mt-0.5">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-blue/10 text-brand-blue font-mono text-xs font-bold tracking-widest">
              RESULT: OPTIMIZED RETENTION & HIGH CONVERSION
            </div>
          </div>

        </div>

        {/* Infographic Section: Diagnostic & Workflow steps */}
        <div className="pt-16 border-t border-zinc-200/60">
          <div className="text-center max-w-lg mx-auto mb-12">
            <span className="font-mono text-xs text-brand-blue font-bold tracking-widest uppercase block mb-2">Diagnostic Process</span>
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-brand-charcoal">
              진단 리포트 신청 및 발행 프로세스
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 font-sans">
              자가진단 시점부터 맞춤형 정밀 처방전 수령까지 단 3단계로 이어집니다.
            </p>
          </div>

          {/* 3 Step flex Infographic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-6 bg-white border border-zinc-200/80 rounded-xl relative flex flex-col justify-between">
              <div>
                <span className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-brand-charcoal text-brand-offwhite text-sm font-bold font-mono flex items-center justify-center">
                  01
                </span>
                <div className="mt-2 flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-brand-blue" />
                  <h4 className="font-sans font-bold text-base text-zinc-900">당신의 결핍 진단 단계</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans">
                  하단 자가진단 문항 5개에 걸쳐 솔직하게 지면의 고통 지수를 반영하고 마감 처리를 완료합니다. 단 1분 소요.
                </p>
              </div>
              <div className="mt-6 font-mono text-[9px] text-zinc-400">STATUS: ON-SITE DIAGNOSIS</div>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white border border-zinc-200/80 rounded-xl relative flex flex-col justify-between">
              <div>
                <span className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-brand-blue text-brand-offwhite text-sm font-bold font-mono flex items-center justify-center">
                  02
                </span>
                <div className="mt-2 flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-brand-blue animation-pulse" />
                  <h4 className="font-sans font-bold text-base text-zinc-900">실시간 패턴 연산 및 등급 분류</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans">
                  입력된 데이터의 구매 결핍 고통 수치를 실시간으로 점수화 및 연립 가동하여 심리 오염 단계를 명수합니다.
                </p>
              </div>
              <div className="mt-6 font-mono text-[9px] text-zinc-400">STATUS: REAL-TIME ENGINE RUNNING</div>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white border border-zinc-200/80 rounded-xl relative flex flex-col justify-between">
              <div>
                <span className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-brand-orange text-brand-offwhite text-sm font-bold font-mono flex items-center justify-center">
                  03
                </span>
                <div className="mt-2 flex items-center gap-2 mb-3">
                  <Send className="w-5 h-5 text-brand-orange" />
                  <h4 className="font-sans font-bold text-base text-zinc-900">24시간 내 이메일 심리 메일 발송</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans">
                  최경하 마스터의 진심 어린 진단 및 웹사이트 맞춤 조언이 이메일 사서함으로 긴밀하게 전송됩니다.
                </p>
              </div>
              <div className="mt-6 font-mono text-[9px] text-zinc-400">STATUS: DELIVERY ENQUEUE</div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
