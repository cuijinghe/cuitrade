/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, ArrowRight, Menu, X, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Auth Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of compressed header
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <header
      id="top-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-brand-offwhite/85 backdrop-blur-md border-b border-zinc-200/50 shadow-xs"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand Symbol */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 group focus:outline-none"
            id="brand-logo-btn"
          >
            <div className="w-9 h-9 rounded-md bg-brand-blue flex items-center justify-center text-brand-offwhite shadow-sm transition-transform group-hover:scale-105 duration-200">
              {/* Refined Geometric Symbol */}
              <ShieldCheck className="w-5 h-5 text-brand-offwhite" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold tracking-tight text-brand-charcoal text-base leading-none">
                퍼스트페이지
              </span>
              <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase leading-none mt-1">
                FirstPage
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => scrollToSection("pain-points")}
              className="text-zinc-650 hover:text-brand-blue transition-colors duration-150 cursor-pointer text-left"
              id="nav-pain-points"
            >
              성장 한계 원인
            </button>
            <button
              onClick={() => scrollToSection("value-proposition")}
              className="text-zinc-650 hover:text-brand-blue transition-colors duration-150 cursor-pointer text-left"
              id="nav-value-proposition"
            >
              3대 심리 설계
            </button>
            <button
              onClick={() => scrollToSection("solution-slider")}
              className="text-zinc-650 hover:text-brand-blue transition-colors duration-150 cursor-pointer text-left"
              id="nav-solution-slider"
            >
              화려함 vs 본질
            </button>
            <button
              onClick={() => scrollToSection("diagnostic-form")}
              className="text-zinc-650 hover:text-brand-blue transition-colors duration-150 cursor-pointer text-left"
              id="nav-diagnostic-form"
            >
              자가진단테스트
            </button>
          </nav>

          {/* Header Action CTA & Login Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-zinc-200/50 hover:bg-zinc-200 border border-zinc-200 rounded-full pl-3.5 pr-2.5 py-1.5 transition-colors duration-200">
                <div className="flex items-center gap-1.5 text-zinc-700 text-xs font-semibold">
                  <UserIcon className="w-3.5 h-3.5 text-brand-blue" />
                  <span className="max-w-[120px] truncate" title={user.email || ""}>
                    {user.email?.split("@")[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-full text-zinc-500 hover:text-brand-orange hover:bg-zinc-300/50 transition-colors cursor-pointer"
                  title="로그아웃"
                  id="header-logout-btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth("login")}
                  className="px-4 py-2 text-xs font-bold rounded-full text-zinc-700 hover:text-brand-blue hover:bg-zinc-100 transition-colors duration-200 cursor-pointer"
                  id="header-login-btn"
                >
                  로그인
                </button>
                <button
                  onClick={() => openAuth("signup")}
                  className="px-4 py-2 text-xs font-bold rounded-full text-white bg-brand-blue hover:bg-brand-blue/95 transition-colors duration-200 cursor-pointer"
                  id="header-signup-btn"
                >
                  무료 회원가입
                </button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection("diagnostic-form")}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-brand-charcoal text-brand-offwhite hover:bg-brand-blue transition-colors duration-200 shadow-sm flex items-center gap-1 cursor-pointer"
              id="header-cta-btn"
            >
              무료 진단하기
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-zinc-600 hover:bg-zinc-150 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Glass Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-zinc-200/60 bg-brand-offwhite/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-5 py-4 space-y-3 flex flex-col">
              <button
                onClick={() => scrollToSection("pain-points")}
                className="py-2.5 text-sm font-medium text-zinc-800 border-b border-zinc-100 hover:text-brand-blue text-left w-full"
                id="mob-nav-1"
              >
                성장 한계 원인 (Pain point)
              </button>
              <button
                onClick={() => scrollToSection("value-proposition")}
                className="py-2.5 text-sm font-medium text-zinc-800 border-b border-zinc-100 hover:text-brand-blue text-left w-full"
                id="mob-nav-2"
              >
                3대 심리 설계 (Value)
              </button>
              <button
                onClick={() => scrollToSection("solution-slider")}
                className="py-2.5 text-sm font-medium text-zinc-800 border-b border-zinc-100 hover:text-brand-blue text-left w-full"
                id="mob-nav-3"
              >
                화려함 vs 본질 (Slider)
              </button>
              <button
                onClick={() => scrollToSection("diagnostic-form")}
                className="py-2.5 text-sm font-medium text-zinc-800 border-b border-zinc-100 hover:text-brand-blue text-left w-full"
                id="mob-nav-4"
              >
                자가진단테스트 (Diagnostic)
              </button>

              {/* Mobile Auth options */}
              {user ? (
                <div className="py-2.5 flex items-center justify-between border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-brand-blue" />
                    <span className="text-sm font-medium text-zinc-800 select-all">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-xs font-bold text-brand-orange bg-brand-orange/10 rounded-md cursor-pointer"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => openAuth("login")}
                    className="py-2 text-center text-xs font-bold text-zinc-800 bg-zinc-200/50 hover:bg-zinc-250 rounded-md cursor-pointer inline-flex items-center justify-center gap-1"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    로그인
                  </button>
                  <button
                    onClick={() => openAuth("signup")}
                    className="py-2 text-center text-xs font-bold text-white bg-brand-blue rounded-md cursor-pointer"
                  >
                    회원가입
                  </button>
                </div>
              )}

              <button
                onClick={() => scrollToSection("diagnostic-form")}
                className="w-full py-3 bg-brand-blue text-brand-offwhite text-sm font-semibold rounded-md flex items-center justify-center gap-2 mt-4"
                id="mob-nav-cta"
              >
                무료 자가진단 진입
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal Portal/Subrender container */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            initialMode={authMode}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

