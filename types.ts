// FIX: Add and export the 'Feature' type to resolve the import error in Header.tsx.
export type Feature = 'critique' | 'image' | 'video' | 'search' | 'thinking' | 'audio';

export interface TrendIntelligence {
  trending_topics: string[];
  viral_formats: string[];
  trending_memes?: string[];
  competitor_activity: string;
  cultural_moments?: string[];
  trending_audio: string[];
  opportunity_gaps?: string[];
  risk_alerts?: string[];
  sources?: GroundingChunk[];
}

// New detailed types for the Brutal Truth Engine
export interface Scores {
  brand_fit: number;
  clarity: number;
  visual_quality: number;
  safety: number;
  viral_potential: number;
  overall: number;
}

export interface DetailedBreakdown {
  brand_fit_diagnosis: string;
  clarity_diagnosis: string;
  visual_quality_diagnosis: string;
  safety_diagnosis: string;
  viral_potential_diagnosis: string;
}

export interface CriticalFailure {
  issue: string;
  location: string;
  impact: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
}

export interface CompetitiveAnalysis {
    what_competitors_do_well: string;
    your_differentiation_opportunity: string;
    who_to_study: string;
}

export interface ImmediateChange {
  change: string;
  from: string;
  to: string;
  why: string;
}

export interface StructuralChange {
    change: string;
    from: string;
    to: string;
    why: string;
}

export interface ContentStrategy {
    trending_hook_to_use: string;
    trending_topic_to_reference: string;
    trending_audio_to_use: string;
    meme_format_to_leverage: string;
}

export interface TechnicalSpecs {
    format: string;
    resolution: string;
    duration: string;
    text_specs: string;
    logo_placement: string;
    colors_to_use: string[];
}

export interface DetailedActionPlan {
  immediate_changes: ImmediateChange[];
  structural_changes: StructuralChange[];
  content_strategy: ContentStrategy;
  technical_specs: TechnicalSpecs;
}

export interface BrutalCritiqueResult {
  scores: Scores;
  verdict: "DEPLOY" | "REVISE" | "UNDEPLOYABLE - KILL IT" | "BLOCKED - HUMAN REVIEW" | "ERROR";
  brutal_truth: string;
  detailed_breakdown: DetailedBreakdown;
  critical_failures: CriticalFailure[];
  what_broke: string[];
  viral_tactics_used: string[];
  viral_tactics_missing: string[];
  competitive_analysis: CompetitiveAnalysis;
  fix_it_fast: string;
  detailed_action_plan: DetailedActionPlan;
  regeneration_prompt_for_ai: string;
  if_you_had_30_minutes: string;
  examples_to_study: string[];
  trend_intelligence?: TrendIntelligence;
}


export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}