/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { AlertCircle, HelpCircle, XCircle, ChevronDown } from "lucide-react";

export default function PainPoints() {
  const cards = [
    {
      id: "pain_01",
      number: "01",
      title: "화려하기만 한 '이쁜 쓰레기'의 역설",
      problem: "수천만 원을 들인 고해상도 3D 애니매이션 및 비디오 배경",
      tragedy: "방문자 57%가 화면이 채 열리기도 전인 '초반 3초 수수께끼' 장벽에서 지루함을 느끼고 이탈합니다. 화려한 자극은 뇌를 피로하게 할 뿐, 단 1원어치의 설득력도 제공하지 않습니다.",
      icon: <XCircle className="w-5 h-5 text-brand-orange" />
    },
    {
      id: "pain_02",
      number: "02",
      title: "오직 공급자 마인드로 가득 채운 자기자랑",
      problem: "\"우리는 우수한 핵심 특허 및 뛰어난 팀워크를 가진...\"",
      tragedy: "잠재 방문자는 당신이 얼마나 대단한지에 눈길을 두지 않습니다. 오직 '이 웹사이트가 내 수면 부족과 매출 하락의 기회 비용을 지금 해결해 주는가'에만 냉정하고 침통하게 집중합니다.",
      icon: <HelpCircle className="w-5 h-5 text-brand-orange" />
    },
    {
      id: "pain_03",
      number: "03",
      title: "포기를 부르는 고강도 마찰력(Friction)",
      problem: "회원가입 절차, 전화번호 본인 인증, 주관식 긴 서술 요망",
      tragedy: "어깨를 누르는 복잡한 상담 정보 요구는 공들여 끌고 온 가망 고객의 뇌리에 최고조의 거부 의무와 불쾌감을 조성합니다. 양식이 복잡할수록 전환율은 기하급수적으로 증발합니다.",
      icon: <AlertCircle className="w-5 h-5 text-brand-orange" />
    }
  ];

  return (
    <section
      id="pain-points"
      className="relative py-24 bg-brand-charcoal text-brand-offwhite overflow-hidden"
    >
      {/* Subtle lines on dark canvas */}
      <div className="absolute inset-0 z-0 opacity-10 select-none pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #FBFBF9 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Content Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/15 rounded-md border border-brand-orange/20 text-brand-orange text-xs font-mono font-medium tracking-tight mb-5">
            <span>THE TRAGEDY OF WASTED BUDGET</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
            성형 수술 수준의 디자인 개편 후에도,
            <br />
            왜 상담과 구매 문의는 늘 오매불망 <span className="text-brand-orange">'0건'</span> 일까요?
          </h2>
          <p className="mt-5 text-sm sm:text-base text-zinc-400 font-sans max-w-2xl leading-relaxed">
            비즈니스의 가차 없는 냉혹한 진실을 공유합니다. 가망 고객이 웹사이트에 진입 후 '이탈하기까지' 걸리는 시간은 오직 3초입니다. 화려함 뒤에 숨은 아래의 3가지 결핍은 매일 당신의 귀중한 마케팅 예산을 갉아먹는 범인입니다.
          </p>
        </div>

        {/* High-density layout Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ scale: 1.01, translateY: -4 }}
              className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between"
              id={card.id}
            >
              <div>
                {/* Micro Header numbering */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-zinc-500 text-sm font-semibold tracking-wider">
                    PROBLEM {card.number}
                  </span>
                  {card.icon}
                </div>

                <h3 className="text-lg sm:text-xl font-sans font-bold text-white tracking-tight leading-snug">
                  {card.title}
                </h3>

                {/* Problem line representation */}
                <div className="mt-4 p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/50 flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-mono tracking-wider">TYPICAL STATUS</span>
                  <span className="text-xs text-brand-orange font-medium mt-0.5 line-through decoration-brand-orange decoration-1">
                    {card.problem}
                  </span>
                </div>

                <p className="mt-6 text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                  {card.tragedy}
                </p>
              </div>

              {/* Aesthetic indicator */}
              <div className="mt-8 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>IMPACT: BOUNCE ACCELERATED</span>
                <span className="text-brand-orange">HIGH DANGER</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action transition segment */}
        <div className="mt-16 text-center">
          <p className="text-zinc-500 text-xs sm:text-sm font-sans">
            화려함이라는 거품을 완전히 제거할 때, 비로소 진짜 고객 심리가 선명히 관측되기 시작합니다.
          </p>
          <div className="mt-4 flex justify-center justify-items-center">
            <motion.div 
              animate={{ y: [0, 6, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-8 h-8 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-zinc-400"
            >
              <ChevronDown className="w-4 h-4 cursor-pointer" />
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
