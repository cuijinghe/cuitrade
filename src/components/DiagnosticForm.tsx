/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  Mail, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  RotateCcw,
  Plus,
  ArrowRightLeft,
  RefreshCw,
  History,
  Calendar,
  ExternalLink
} from "lucide-react";
import { DIAGNOSTIC_QUESTIONS } from "../data";
import { SubmissionData, DiagnosticResult } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function DiagnosticForm() {
  const { user } = useAuth();
  
  // Navigation index & Answers
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  
  // Submission flows
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmissionData | null>(null);

  // Firestore History state
  const [pastDiagnostics, setPastDiagnostics] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistoryOnly, setShowHistoryOnly] = useState(false);

  // In-app Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Set email when user state changes
  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Load history from Firestore if user is logged in
  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const q = query(
            collection(db, "diagnostics"),
            where("userId", "==", user.uid)
          );
          const snapshot = await getDocs(q);
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort client-side to keep it index-independent
          docs.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          setPastDiagnostics(docs);
        } catch (err) {
          console.error("Error fetching history:", err);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    } else {
      setPastDiagnostics([]);
    }
  }, [user, isSubmitted]);

  // Check localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem("firstpage_diagnostic_submitted_data");
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as SubmissionData;
        setSubmittedData(parsed);
        setIsSubmitted(true);
      } catch (e) {
        // Ignored
      }
    }
  }, []);

  // Sync anonymous diagnostic if user logs in
  useEffect(() => {
    if (user && pastDiagnostics.length >= 0) {
      const cached = localStorage.getItem("firstpage_diagnostic_submitted_data");
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as SubmissionData;
          const hasAlreadySynced = pastDiagnostics.some(
            d => d.submittedAt === parsed.submittedAt && d.score === parsed.score
          );
          if (!hasAlreadySynced) {
            const syncToCloud = async () => {
              try {
                await addDoc(collection(db, "diagnostics"), {
                  ...parsed,
                  userId: user.uid
                });
                triggerToast("💻 이전에 진행했던 로컬 자가진단 항목을 계정에 실시간 동기화했습니다!");
                localStorage.removeItem("firstpage_diagnostic_submitted_data");
                
                // Refresh local history list
                const q = query(collection(db, "diagnostics"), where("userId", "==", user.uid));
                const snapshot = await getDocs(q);
                const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                docs.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
                setPastDiagnostics(docs);
              } catch (err) {
                console.error("Failed auto sync:", err);
              }
            };
            syncToCloud();
          }
        } catch (e) {
          // Ignored
        }
      }
    }
  }, [user, pastDiagnostics.length]);

  const handleLoadPastDiagnostic = (historyItem: any) => {
    setAnswers(historyItem.answers || {});
    setSubmittedData({
      email: historyItem.email,
      websiteUrl: historyItem.websiteUrl,
      score: historyItem.score,
      answers: historyItem.answers,
      submittedAt: historyItem.submittedAt
    });
    setCurrentIdx(DIAGNOSTIC_QUESTIONS.length);
    setIsSubmitted(true);
    setShowHistoryOnly(false);
    triggerToast(`📅 ${new Date(historyItem.submittedAt).toLocaleDateString()} 에 실시했던 진단 결과가 로드되었습니다.`);
  };


  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleSelectOption = (questionId: string, optionValue: string, idx: number) => {
    setSelectedOptionIdx(idx);
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionValue
    }));
  };

  const handleNext = () => {
    if (selectedOptionIdx === null) {
      triggerToast("계속 진행하려면 선택지 중 하나를 꼭 골라주세요.");
      return;
    }
    
    // Clear selection state for next animate
    setSelectedOptionIdx(null);
    setCurrentIdx(prev => prev + 1);
  };

  // Score Calculations
  const calculateTotalScore = (): number => {
    let sum = 0;
    DIAGNOSTIC_QUESTIONS.forEach(q => {
      const selectedVal = answers[q.id];
      if (selectedVal) {
        const opt = q.options.find(o => o.value === selectedVal);
        if (opt) sum += opt.score;
      }
    });
    return sum;
  };

  const getResultLevel = (score: number): DiagnosticResult => {
    if (score <= 40) {
      return {
        score,
        level: "위기 (심각한 수술 요망)",
        colorClass: "text-brand-orange border-brand-orange/30 bg-brand-orange/5",
        title: "🚨 밑 빠진 독에 마케팅비 전액을 기화시키는 중입니다.",
        summary: "현재 웹사이트는 방문자의 시각을 피로하게 하고 공급자 중심의 일방적인 자랑으로 가득 차 무조건적인 즉각 이탈을 부추기고 있습니다. 손실 회피 장치가 완전 부재하여 방문할 합리적 명분을 제공하지 못하고 가치를 환산하기 어렵습니다.",
        solution: "지금 당장 화려한 그래픽을 올리는 행위를 멈추십시오. 1초 만에 눈길을 가둘 수 있는 '초고밀도 아킬레스건 공감 메인 메시지 정렬'과 상담 전환 신청 장치의 마찰력을 최소 2단위 미만으로 낮추어야만 누수를 격리할 수 있습니다."
      };
    } else if (score <= 75) {
      return {
        score,
        level: "경고 (매출 누수가 빈번히 진행중)",
        colorClass: "text-yellow-600 border-yellow-500/30 bg-yellow-500/5",
        title: "⚠️ 느슨한 구매 심리 장치로 인해 잠재 매출의 70%가 흘러나갑니다.",
        summary: "기본적인 가독성은 유지되고 오디언스 분류가 어렴풋이 설계되었으나, 가망 고객의 머뭇거리는 저항을 해소할 '상상 상실 위기감(손실 회피)'을 전혀 각인시키지 못하고 있습니다. 또한, 전환 신청 폼의 미세 마찰이 주의력 한계를 자극하고 있습니다.",
        solution: "타겟 오디언스 군별로 헤드 메시지를 분기하고 신청 버튼의 텍스트와 개수를 유선형 동선 위에 정비하십시오. 기회 비용을 숫자 단위로 증명하는 덤덤한 텍스트 기반 설득 아코디언을 도입하는 것을 권장합니다."
      };
    } else {
      return {
        score,
        level: "임계점 최적화 (건강함)",
        colorClass: "text-brand-blue border-brand-blue/30 bg-brand-blue/5",
        title: "✅ 기초 체력이 건강합니다. 극소 마찰력 제거 시 폭발 가능합니다.",
        summary: "고객 고통 공감 카피와 간단 폼 설계가 영리하게 적용되어 있어, 이미 타 평균 대비 높은 성과를 보고 계실 확률이 높습니다. 하지만 세그먼트 개인화가 한 단계 더 세밀해지면 미세 시냅스 세포가 상업적 기립을 달성할 수 있습니다.",
        solution: "현재 단계에선 1:1 맞춤형 세그먼트 상세 페이지의 정교함 극대화 및 무료 처방 데이터베이스 동기화로 입구를 완전 유선형으로 가공하는 '미세 시선 픽셀 정렬'을 시작할 차례입니다."
      };
    }
  };

  // Reset Diagnostic test
  const handleReset = () => {
    setCurrentIdx(0);
    setAnswers({});
    setSelectedOptionIdx(null);
    setEmail("");
    setWebsiteUrl("");
    setIsSubmitting(false);
    setIsSubmitted(false);
    setSubmittedData(null);
    localStorage.removeItem("firstpage_diagnostic_submitted_data");
    triggerToast("진단 기록이 원상 리셋되어 처음부터 신규 테스트를 개시합니다.");
  };

  // Submit lead form logic
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      triggerToast("올바른 이메일 주소를 입력해 주시기 바랍니다.");
      return;
    }
    if (!websiteUrl) {
      triggerToast("정밀 진단의 대상이 될 웹사이트 주소(URL)를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    const score = calculateTotalScore();
    const finalLead: SubmissionData = {
      email,
      websiteUrl,
      score,
      answers,
      submittedAt: new Date().toISOString()
    };

    try {
      if (user) {
        // Save to cloud if authenticated
        await addDoc(collection(db, "diagnostics"), {
          ...finalLead,
          userId: user.uid
        });
        triggerToast("🎉 클라우드 서버 데이터 주입과 함께 이메일 정밀 처방서 신청이 대기열에 안전 수령 완료되었습니다!");
      } else {
        // Save to browser cache for guests
        localStorage.setItem("firstpage_diagnostic_submitted_data", JSON.stringify(finalLead));
        triggerToast("🎉 정밀 진단 리포트 수령 신청이 브라우저에 가보존되었습니다! 로그인 시 영구 저장됩니다.");
      }
      setSubmittedData(finalLead);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Firestore submit error:", err);
      // Fallback
      localStorage.setItem("firstpage_diagnostic_submitted_data", JSON.stringify(finalLead));
      setSubmittedData(finalLead);
      setIsSubmitted(true);
      triggerToast("원격 노드 통신 마찰로 인해 로컬 스토리지에 세션을 임시 백업했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentIdx];
  const isFinishedAllQuestions = currentIdx >= DIAGNOSTIC_QUESTIONS.length;
  const currentTotalScore = calculateTotalScore();
  const evaluation = getResultLevel(currentTotalScore);

  return (
    <section
      id="diagnostic-form"
      className="relative py-24 bg-brand-offwhite text-brand-charcoal"
    >
      {/* Background visual helpers */}
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Toast Notification Banner Container */}
        <div className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-none">
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="pointer-events-auto p-4 rounded-xl bg-brand-charcoal text-white shadow-xl flex items-start gap-3 border border-zinc-800"
              >
                <Info className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-mono tracking-wider text-brand-blue">NOTIFICATION</span>
                  <span className="text-xs font-medium text-zinc-100 mt-1 leading-relaxed">
                    {toastMessage}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section Heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 rounded-md border border-brand-orange/20 text-brand-orange text-xs font-mono font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>PURCHASE PSYCHOLOGY DEFICIT CALCULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-brand-charcoal">
            무료 자가 종합 결핍 진단기
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto">
            당신의 랜딩페이지가 예쁜 쓰레기 상태인지, 진짜 구매 동선이 완비된 고효율 유입 지면인지 실시간 점수로 확인하고 조언서를 구동하세요.
          </p>
        </div>

        {/* Core Wizard Container Card */}
        <div className="bg-white border border-zinc-200/80 shadow-2xl rounded-2xl p-6 sm:p-10 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Top subtle grid lines only */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(#1E1E1C 1px, transparent 1px), linear-gradient(90deg, #1E1E1C 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>

          <div className="relative z-10 w-full flex flex-col h-full justify-between">
            
            {user && pastDiagnostics.length > 0 && (
              <div className="flex justify-end mb-4 border-b border-zinc-150 pb-3">
                <button
                  type="button"
                  onClick={() => setShowHistoryOnly(!showHistoryOnly)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-brand-blue hover:bg-brand-blue/10 border border-brand-blue/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  {showHistoryOnly ? "진단 분석 페이지로 복귀" : `내 과거 진단 목록 (${pastDiagnostics.length}건)`}
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {showHistoryOnly ? (
                <motion.div
                  key="history-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-brand-charcoal flex items-center gap-2">
                      <History className="w-5 h-5 text-brand-blue" />
                      과거 진단 처방 히스토리
                    </h3>
                    <p className="text-xs text-zinc-505 mt-1 leading-relaxed">
                      이전 진단 제출 시 클라우드 데이터베이스에 연산 저장된 데이터셋입니다. 항목을 클릭하면 당시 획득한 고통 패턴 및 해결 제안서 상세 정보를 원격 로드하여 재확인할 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {pastDiagnostics.map((item, index) => {
                      const dateStr = new Date(item.submittedAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });
                      
                      let scoreColor = "text-brand-orange bg-brand-orange/10 border-brand-orange/20";
                      if (item.score > 40 && item.score <= 75) {
                        scoreColor = "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
                      } else if (item.score > 75) {
                        scoreColor = "text-brand-blue bg-brand-blue/10 border-brand-blue/20";
                      }

                      return (
                        <div
                          key={item.id || index}
                          onClick={() => handleLoadPastDiagnostic(item)}
                          className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                              <Globe className="w-3.5 h-3.5 text-zinc-400" />
                              <span className="truncate max-w-[220px] font-mono text-zinc-800" title={item.websiteUrl}>{item.websiteUrl}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                              <Calendar className="w-3 h-3" />
                              {dateStr}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${scoreColor}`}>
                              {item.score}점
                            </div>
                            <button className="px-3 py-1.5 bg-brand-charcoal hover:bg-brand-blue text-white rounded-lg text-xs font-bold transition-colors cursor-pointer">
                              불러오기
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-zinc-150 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowHistoryOnly(false)}
                      className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                    >
                      목록 닫기
                    </button>
                  </div>
                </motion.div>
              ) : isSubmitted ? (
                <motion.div
                  key="already-submitted"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-sans font-bold text-brand-charcoal">
                      진단 리포트 요청 접수 완료
                    </h3>
                    <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
                      성공적으로 신청된 기록이 이미 존재합니다. 분석관이 접수된 데이터군을 검토하고 처방 조언을 구성하여 답신을 대기열에 올렸습니다.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3.5">
                    <span className="font-mono text-[10px] text-zinc-400 font-bold block tracking-wider uppercase">SUBMISSION REGISTRY DETAILS</span>
                    <div className="flex justify-between items-center text-xs sm:text-sm border-b border-zinc-200/50 pb-2.5">
                      <span className="text-zinc-500 flex items-center gap-1"><Mail className="w-4 h-4" /> 기입 이메일</span>
                      <span className="font-bold text-brand-charcoal select-all">{submittedData?.email}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm border-b border-zinc-200/50 pb-2.5">
                      <span className="text-zinc-500 flex items-center gap-1"><Globe className="w-4 h-4" /> 점검 주소</span>
                      <span className="font-mono font-semibold text-brand-blue hover:underline break-all max-w-[200px]" style={{ direction: "rtl" }}>
                        {submittedData?.websiteUrl}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-zinc-500 flex items-center gap-1"><Sparkles className="w-4 h-4 text-brand-blue" /> 획득한 등급 점수</span>
                      <span className="font-mono font-bold text-brand-blue">
                        {submittedData?.score}점 / 100점 만점
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center">
                    <button
                      onClick={handleReset}
                      className="px-5 py-3 rounded-full text-xs font-semibold text-zinc-500 hover:text-brand-orange border border-zinc-200 hover:border-brand-orange bg-zinc-50 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      기존 기록 파기 및 다시 테스트하기
                    </button>
                  </div>
                </motion.div>
              ) : 

              /* WIZARD QUESTION FLOWS */
              !isFinishedAllQuestions ? (
                <motion.div
                  key={`question-${currentIdx}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  {/* Progress Indicators */}
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <span className="font-mono text-xs font-bold text-brand-blue uppercase tracking-widest">
                      QUESTION {currentIdx + 1} OF {DIAGNOSTIC_QUESTIONS.length}
                    </span>
                    <div className="h-1.5 w-32 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-blue transition-all duration-300"
                        style={{ width: `${((currentIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Question Heading Area */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-sans font-bold text-brand-charcoal tracking-tight leading-snug">
                      {currentQuestion.title}
                    </h3>
                    {currentQuestion.subLabel && (
                      <p className="text-xs text-zinc-500 mt-2 font-sans font-medium flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        {currentQuestion.subLabel}
                      </p>
                    )}
                  </div>

                  {/* Visual Option radio Buttons list */}
                  <div className="space-y-3.5">
                    {currentQuestion.options.map((opt, oIdx) => {
                      const isSelected = answers[currentQuestion.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleSelectOption(currentQuestion.id, opt.value, oIdx)}
                          className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all text-xs sm:text-sm font-medium relative focus:outline-none cursor-pointer ${
                            isSelected
                              ? "bg-brand-blue/5 border-brand-blue border-2 text-brand-charcoal shadow-sm"
                              : "bg-zinc-50 border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-100 text-zinc-700"
                          }`}
                          id={`opt-${currentQuestion.id}-${opt.value}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? "border-brand-blue bg-brand-blue text-white" : "border-zinc-300 bg-white"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                          </div>
                          <span className="leading-relaxed font-sans">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Real-Time Context Feedback Box when selected */}
                  <AnimatePresence>
                    {selectedOptionIdx !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200 flex items-start gap-2.5 text-xs text-zinc-650 leading-relaxed font-sans font-medium">
                          <AlertTriangle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                          <span>
                            {currentQuestion.options[selectedOptionIdx].feedback}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Wizard Footer Controls */}
                  <div className="pt-6 border-t border-zinc-100 flex justify-between items-center">
                    <button
                      onClick={() => {
                        if (currentIdx > 0) {
                          setCurrentIdx(prev => prev - 1);
                          setSelectedOptionIdx(null);
                        }
                      }}
                      disabled={currentIdx === 0}
                      className={`text-xs font-semibold px-4 py-2 rounded-full border ${
                        currentIdx === 0
                          ? "text-zinc-300 border-zinc-250 cursor-not-allowed"
                          : "text-zinc-500 border-zinc-200 hover:bg-zinc-100 cursor-pointer"
                      }`}
                    >
                      이전 단계
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="px-6 py-3 rounded-full bg-brand-charcoal text-brand-offwhite text-xs font-semibold hover:bg-brand-blue flex items-center gap-1.5 cursor-pointer"
                    >
                      {currentIdx === DIAGNOSTIC_QUESTIONS.length - 1 ? "결과 보기" : "다음 문항으로"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : 

              /* DIAGNOSTIC RESULTS & LEAD FORM */
              (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  class-name="space-y-6"
                >
                  <div className="border-b border-zinc-100 pb-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-[10px] text-zinc-400 font-bold tracking-widest uppercase block mb-1">COMPILATION COMPLETE</span>
                      <span className="font-sans font-bold text-xl text-brand-charcoal">
                        고통 패턴 감지 진단 진단서
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-xs font-medium font-sans">최종 진단 점수</span>
                      <div className="px-4 py-1.5 bg-brand-blue text-white font-mono font-extrabold text-lg sm:text-xl rounded-lg">
                        {currentTotalScore}점
                      </div>
                    </div>
                  </div>

                  {/* Level Highlight with border dynamic color */}
                  <div className={`p-5 rounded-2xl border-2 ${evaluation.colorClass} space-y-3`}>
                    <div className="flex items-center gap-2 font-sans font-black text-sm">
                      <span className="px-2 py-0.5 rounded bg-brand-charcoal text-white font-mono text-[10px] font-bold">등급: {evaluation.level}</span>
                    </div>
                    <h4 className="font-sans font-bold text-base sm:text-lg text-zinc-900 leading-snug">
                      {evaluation.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-sans">
                      {evaluation.summary}
                    </p>
                    <div className="pt-2 border-t border-zinc-300/35">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-widest block uppercase">CRITICAL ACTION PRESCRIPTION</span>
                      <p className="text-xs text-brand-blue font-sans font-bold mt-1 leading-relaxed">
                        {evaluation.solution}
                      </p>
                    </div>
                  </div>

                  {/* Bespoke Interactive Lead capture block */}
                  <div className="mt-8 pt-8 border-t border-zinc-150">
                    <div className="mb-6">
                      <span className="font-mono text-[9px] text-brand-orange font-bold tracking-wider uppercase block">OPPORTUNITY AUDITING</span>
                      <h4 className="font-sans font-bold text-base text-zinc-900 mt-1">24시간 내 이메일 정밀 처방 리포트 신청</h4>
                      <p className="text-xs text-zinc-500 font-sans mt-0.5 leading-relaxed">
                        자가진단 점수 기반의 오염 요인 대기 교정 제안서를 이메일로 발행합니다. 스팸 유입이 절대 없음을 서약합니다.
                      </p>
                    </div>

                    <form onSubmit={handleSubmitLead} className="space-y-4">
                      
                      {/* Email fields */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-600 text-xs font-semibold flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          결과를 수령할 이메일 주소 <span className="text-brand-orange font-bold">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="px-4 py-3.5 rounded-xl border border-zinc-250 bg-zinc-50/50 hover:bg-white focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-xs sm:text-sm font-medium text-brand-charcoal focus:outline-none transition-colors w-full"
                          id="lead-email"
                        />
                      </div>

                      {/* URL fields */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-600 text-xs font-semibold flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-zinc-400" />
                          진단받을 자사 웹사이트 링크 <span className="text-brand-orange font-bold">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="px-4 py-3.5 rounded-xl border border-zinc-250 bg-zinc-50/50 hover:bg-white focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-xs sm:text-sm font-medium text-zinc-700 font-mono focus:outline-none transition-colors w-full"
                          id="lead-url"
                        />
                      </div>

                      {/* Form action Button */}
                      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentIdx(0);
                            setAnswers({});
                            setSelectedOptionIdx(null);
                          }}
                          className="text-xs font-semibold text-zinc-500 hover:text-brand-charcoal flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          진단 다시 개시
                        </button>

                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full sm:w-auto px-8 py-4 rounded-xl text-brand-offwhite font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer ${
                            isSubmitting ? "bg-zinc-400 cursor-not-allowed" : "bg-brand-blue hover:bg-brand-blue/90"
                          }`}
                          id="lead-submit-btn"
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-white" />
                              점검 대기 가동 연산 중...
                            </>
                          ) : (
                            <>
                              한정판 분석 처방서 수령 신청
                              <ArrowRight className="w-4 h-4 text-white" />
                            </>
                          )}
                        </motion.button>
                      </div>

                    </form>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
