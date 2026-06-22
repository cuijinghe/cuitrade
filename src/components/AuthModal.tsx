/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { X, Mail, Lock, Sparkles, Check, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const { login, signup, loginWithGoogle } = useAuth();
  
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setErrorMsg(null);
    setSuccessMsg(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg("구글 계정으로 로그인 및 동기화에 성공했습니다!");
      setTimeout(() => {
        onClose();
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("로그인 창이 닫혔습니다. 다시 시도해 주세요.");
      } else if (err.code === "auth/blocked-by-popup-blaster" || err.code === "auth/popup-blocked") {
        setErrorMsg("브라우저 팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.");
      } else {
        setErrorMsg(err.message || "구글 로그인 중 에러가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!email || !email.includes("@")) {
      setErrorMsg("정확한 이메일 형식을 입력해 주세요.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setErrorMsg("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        setSuccessMsg("로그인에 성공했습니다! 페이지가 즉시 업데이트됩니다.");
        setTimeout(() => {
          onClose();
          // Reset states
          setEmail("");
          setPassword("");
        }, 1000);
      } else {
        await signup(email, password);
        setSuccessMsg("성공적으로 퍼스트페이지 계정이 생성되었습니다!");
        setTimeout(() => {
          onClose();
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMsg("이미 사용 중인 이메일 주소입니다.");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMsg("유효하지 않은 이메일 형식입니다.");
      } else {
        setErrorMsg(err.message || "인증 처리 중 알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1E1E1C]/80 backdrop-blur-xs cursor-pointer"
      />

      {/* Auth Content Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white border border-zinc-200 w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(#1E1E1C 1px, transparent 1px), linear-gradient(90deg, #1E1E1C 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-brand-blue flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-sm tracking-tight text-brand-charcoal">
                  {mode === "login" ? "퍼스트페이지 로그인" : "퍼스트페이지 멤버십 가입"}
                </span>
                <span className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">
                  {mode === "login" ? "FIRSTPAGE SESSION ACCESS" : "SECURE ENROLLMENT"}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <p className="text-xs text-zinc-600 leading-relaxed font-sans font-medium">
              {mode === "login" 
                ? "계정에 접속하시면, 과거에 진행했던 모든 세밀한 자가진단 이력서와 이메일 제출 이력을 실시간 서버와 안전하게 동기화하여 평생 보존할 수 있습니다."
                : "퍼스트페이지 멤버십에 무료 가입하세요. 단 하나의 이메일 계정으로 자사 랜딩페이지의 자가진단 기록 전체를 영구 보증 및 실시간 연산 보관합니다."}
            </p>
          </div>

          {/* Error and Success Indicators */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 mb-4 rounded-lg bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs flex items-start gap-2 font-medium"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-start gap-2 font-medium"
              >
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                이메일 주소
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="px-4 py-3 rounded-xl border border-zinc-250 bg-zinc-50/50 hover:bg-white focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-xs sm:text-sm font-medium focus:outline-none transition-colors w-full"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                비밀번호 <span className="text-[10px] text-zinc-400 font-mono font-normal">(6자 이상)</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="px-4 py-3 rounded-xl border border-zinc-250 bg-zinc-50/50 hover:bg-white focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-xs sm:text-sm font-medium focus:outline-none transition-colors w-full"
              />
            </div>

            {/* Password Confirm (Sign Up Only) */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  비밀번호 재확인
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  className="px-4 py-3 rounded-xl border border-zinc-250 bg-zinc-50/50 hover:bg-white focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-xs sm:text-sm font-medium focus:outline-none transition-colors w-full"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className={`w-full py-3.5 rounded-xl text-brand-offwhite font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                  loading ? "bg-zinc-400 cursor-not-allowed" : "bg-brand-charcoal hover:bg-brand-blue"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    안전 처방 모듈 인증 중...
                  </>
                ) : mode === "login" ? (
                  <>
                    로그인 및 실시간 로드
                  </>
                ) : (
                  <>
                    멤버십 무료 개설 완료
                  </>
                )}
              </motion.button>
            </div>

          </form>

          {/* OR Divider for SNS login */}
          <div className="relative flex items-center my-5">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink mx-4 text-zinc-400 text-[10px] font-mono tracking-wider uppercase">OR</span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          {/* Google Sign-in Button */}
          <motion.button
            type="button"
            disabled={loading}
            onClick={handleGoogleAuth}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className={`w-full py-3.5 rounded-xl border border-zinc-250 bg-white hover:bg-zinc-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors text-zinc-700 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Google 계정으로 계속하기
          </motion.button>

          {/* Toggle Footer text */}
          <div className="mt-6 pt-4 border-t border-zinc-150 text-center">
            <button
              onClick={handleToggleMode}
              className="text-xs font-sans font-semibold text-zinc-500 hover:text-brand-blue transition-colors focus:outline-none cursor-pointer inline-flex items-center gap-1"
            >
              {mode === "login" ? (
                <>
                  퍼스트페이지 계정이 아직 없으신가요?{" "}
                  <span className="text-brand-blue font-bold hover:underline">회원가입</span>
                </>
              ) : (
                <>
                  이미 회원이신가요?{" "}
                  <span className="text-brand-blue font-bold hover:underline">로그인</span>
                </>
              )}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
