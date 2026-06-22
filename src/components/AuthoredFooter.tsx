/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Award, Shield, FileText, CheckCircle, ArrowUp } from "lucide-react";

export default function AuthoredFooter() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer
      id="authored-footer"
      className="relative bg-brand-charcoal text-brand-offwhite pt-20 pb-12 overflow-hidden border-t border-zinc-900"
    >
      {/* Absolute micro background grid lines */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none select-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #FFF 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Creator Intro Biography Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-zinc-800/60">
          
          {/* Column 1: Core Values and Master Bio */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/15 rounded-md border border-brand-blue/20 text-brand-blue text-xs font-mono font-bold tracking-tight">
              <span>FOUNDER & ANALYST CREDENTIALS</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-sans font-extrabold text-white tracking-tight">
              \"디자인은 예술이 아닙니다.
              <br />
              문제를 정교하고 정직하게 수리하는 도구입니다.\"
            </h3>

            {/* Quote description */}
            <p className="text-sm text-zinc-400 font-sans leading-relaxed max-w-xl">
              어떤 대표님도 마케팅 예산이 남아서 버리시는 것이 아님을 압니다. 추이트레이드(Chui Trade)는 예술가의 자폐적 미적 쾌감 대신, 독자가 어떠한 막힘 없이 이성적 확신을 갖고 신청까지 미끄러져 들어가도록 돕는 전환 설득 학문을 실천합니다.
            </p>

            {/* Bullet achievements list with clean borders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-zinc-900/65 border border-zinc-800/80 flex items-start gap-3">
                <Shield className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider">Experiences</span>
                  <span className="text-sm font-sans font-bold text-white mt-1">기업 누적 광고비 집행 겪음</span>
                  <span className="text-xs text-zinc-400 mt-1">이탈 및 인지 공학 리뉴얼 집행 데이터</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/65 border border-zinc-800/80 flex items-start gap-3">
                <Award className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider">Methodology</span>
                  <span className="text-sm font-sans font-bold text-white mt-1">구매 심리 인지 역치 설계</span>
                  <span className="text-xs text-zinc-400 mt-1">손실 회피 및 마찰력 삭제 중심 설계</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Specific Company Info Block card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800/90 relative">
            
            {/* Minimal decoration */}
            <div className="absolute top-4 right-4 text-xs font-mono text-brand-blue font-bold tracking-widest bg-brand-blue/10 px-2 py-0.5 rounded">
              VERIFIED SENDER
            </div>

            <div className="space-y-4">
              <span className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase font-bold block">Chui Trade Specifications</span>
              
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 font-sans">마스터 개발자 / 핵심 책임 위장</span>
                <span className="text-base font-bold text-white tracking-tight mt-0.5 font-sans">최경하 (Choi Kyeong-ha)</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 font-sans">소속 에이전시 및 브랜드</span>
                <span className="text-base font-bold text-white tracking-tight mt-0.5 font-sans">추이트레이드 (Chui Trade)</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 font-sans">업무 전용 문의처</span>
                <a href="mailto:cuitrade76@gmail.com" className="text-base font-bold text-brand-blue hover:underline tracking-tight mt-0.5 font-mono select-all">
                  cuitrade76@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider">CORE MISSION: VALUE EXTRACTION</span>
              <span className="text-xs font-serif italic text-zinc-400">Since 2024</span>
            </div>

          </div>

        </div>

        {/* Closing Footnote Area with detailed Credit Layout */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo symbol & brand again */}
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-sm tracking-tight text-white">퍼스트페이지</span>
            <span className="text-zinc-600 text-xs">|</span>
            <span className="font-sans text-xs text-zinc-400 font-medium">추이트레이드 Co.</span>
          </div>

          {/* Legal / Copyright details on mono fonts */}
          <div className="flex flex-col md:items-end text-center md:text-right font-mono text-[11px] text-zinc-500 gap-1">
            <p className="leading-none text-zinc-400">
              © 2024 Chui Trade & FirstPage. All rights reserved.
            </p>
            <p className="text-zinc-600">
              Designed dynamically with rigorous cognitive layouts. Built on React & Tailwind CSS.
            </p>
          </div>

          {/* Back to top anchor */}
          <a
            href="#"
            onClick={scrollToTop}
            className="p-2 bg-zinc-900 hover:bg-brand-blue rounded-lg border border-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer focus:outline-none"
            aria-label="Back to top"
            id="back-to-top-btn"
          >
            맨 위로
            <ArrowUp className="w-3.5 h-3.5" />
          </a>

        </div>

      </div>
    </footer>
  );
}
