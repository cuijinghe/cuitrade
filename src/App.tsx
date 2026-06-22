/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PainPoints from "./components/PainPoints";
import ValueProposition from "./components/ValueProposition";
import SolutionSlider from "./components/SolutionSlider";
import DiagnosticForm from "./components/DiagnosticForm";
import AuthoredFooter from "./components/AuthoredFooter";

export default function App() {
  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-charcoal selection:bg-brand-blue selection:text-white overflow-x-hidden antialiased">
      {/* 1. Header Navigation System */}
      <Header />

      {/* Main content flow */}
      <main id="main-content">
        {/* 2. Hero Section: Direct challenge copy */}
        <Hero />

        {/* 3. Pain Points Section: High-density dark contrast grids */}
        <PainPoints />

        {/* 4. Value Proposition Section: Accordions of high-fidelity copywriting */}
        <ValueProposition />

        {/* 5. Solution Slider & Simulator Section */}
        <SolutionSlider />

        {/* 6. Diagnostic Form Section: Interactive z-score wizard */}
        <DiagnosticForm />
      </main>

      {/* 7. Creator & Agency Credits Footer */}
      <AuthoredFooter />
    </div>
  );
}
