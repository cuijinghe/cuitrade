/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { ShieldAlert, ArrowRight, MousePointerClick } from "lucide-react";

export default function Hero() {
  const scrollToDiagnostic = () => {
    const element = document.getElementById("diagnostic-form");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Stagger configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18
      }
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 bg-brand-offwhite overflow-hidden"
    >
      {/* Decorative Minimal Grid Accents */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] select-none" style={{ backgroundImage: "linear-gradient(#1E1E1C 1px, transparent 1px), linear-gradient(90deg, #1E1E1C 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
      
      {/* Elegant Radial Lighting glow */}
      <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Tagline / Warning Label */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/5 text-brand-orange text-xs font-mono font-medium mb-8 tracking-tight"
            id="hero-badge"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CRITICAL AUDIT: DESIGN VS VERACITY</span>
          </motion.div>

          {/* Main Provocative Typography Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-brand-charcoal leading-[1.15] sm:leading-[1.12]"
            id="hero-heading"
          >
            혹시 수천만 원짜리
            <br />
            <span className="relative inline-block my-1 leading-none">
              <span className="absolute -inset-1 -rotate-1 bg-brand-orange/10 rounded-xs"></span>
              <span className="relative text-brand-orange font-bold px-1.5">"이쁜 쓰레기"</span>
            </span>
            를 만들고 계신가요?
          </motion.h1>

          {/* Core Subtitle Copy */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-base sm:text-lg md:text-xl font-sans font-medium text-zinc-600 max-w-2xl leading-relaxed"
            id="hero-subtext"
          >
            디자인 에이전시에 거금을 쓰고도 전환율이 0%에 수렴하는 비극.
            <br className="hidden sm:inline" />
            화려한 그래픽 장식은 고객을 가두지 못합니다. 지금 필요한 것은
            <br className="hidden sm:inline" />
            인간 본성을 장악하는 철저한 <strong className="text-brand-blue font-semibold">"구매 심리 이성적 정렬"</strong>입니다.
          </motion.p>

          {/* Bulleted High-density Features */}
          <motion.div
            variants={itemVariants}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl px-4 text-left"
            id="hero-bullets"
          >
            <div className="p-3.5 rounded-lg bg-zinc-200/40 border border-zinc-200/50 flex flex-col justify-between">
              <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Insight 01</span>
              <span className="text-zinc-800 text-xs font-medium mt-1">방문 즉시 이탈을 제어하는 초반 3초 시선 안착 구조</span>
            </div>
            <div className="p-3.5 rounded-lg bg-zinc-200/40 border border-zinc-200/50 flex flex-col justify-between">
              <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Insight 02</span>
              <span className="text-zinc-800 text-xs font-medium mt-1">상도 본능의 가책을 일깨우는 기회비용 손실 환기</span>
            </div>
            <div className="p-3.5 rounded-lg bg-zinc-200/40 border border-zinc-200/50 flex flex-col justify-between">
              <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Insight 03</span>
              <span className="text-zinc-800 text-xs font-medium mt-1">제안을 섭취하기 가장 쉬운 마찰력 무강화 입력</span>
            </div>
          </motion.div>

          {/* Primary CTA and Interactive Micro details */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center gap-3 w-full sm:w-auto"
            id="hero-action-container"
          >
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToDiagnostic}
              className="w-full sm:w-auto px-8 py-5 rounded-full bg-brand-blue text-brand-offwhite font-semibold text-sm sm:text-base hover:bg-brand-blue/90 shadow-lg tracking-tight flex items-center justify-center gap-3 transition-colors duration-200 cursor-pointer"
              id="hero-main-cta"
            >
              지금 무료로 '구매 심리 결핍 요소' 진단받기
              <ArrowRight className="w-5 h-5 text-brand-offwhite animate-pulse" />
            </motion.button>
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono mt-1 select-none">
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>진단 소요시간: 단 1분 · 인공지능 즉시 보고서 발행</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Standard geometric background delimiter line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-zinc-200/53"></div>
    </section>
  );
}
