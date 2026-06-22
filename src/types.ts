/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuestionOption {
  value: string;
  label: string;
  score: number; // For diagnostic score calculation (e.g., 20 points per question for 100 max)
  feedback: string; // Tailored instant feedback for choosing this option
}

export interface DiagnosticQuestion {
  id: string;
  title: string;
  subLabel?: string;
  options: QuestionOption[];
}

export interface TheoryItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  extendedPoints: string[];
}

export interface SubmissionData {
  email: string;
  websiteUrl: string;
  score: number;
  answers: Record<string, string>;
  submittedAt: string;
}

export interface DiagnosticResult {
  score: number;
  level: string; // e.g., "위기 (위험수치)", "경고", "보통"
  colorClass: string;
  title: string;
  summary: string;
  solution: string;
}
