import { GoogleGenAI, Type } from "@google/genai";
import { BRUTAL_TRUTH_PROMPT } from '../constants';
import { TrendIntelligence, BrutalCritiqueResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (result && result.includes(',')) {
        resolve(result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const getTrendIntelligence = async (industry: string, brandName: string, platform: string): Promise<TrendIntelligence> => {
    const trendPrompt = `
Search for current trends in ${industry} on ${platform}.
Find: trending topics, viral meme formats, trending audio, what's working for competitors for ${brandName}.
Output as brief JSON: {
  "trending_topics": [],
  "viral_formats": [],
  "trending_audio": [],
  "competitor_activity": ""
}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: trendPrompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    let text = response.text.trim();
    if (text.startsWith('```') && text.endsWith('```')) {
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        text = text.substring(startIndex, endIndex + 1);
      }
    }

    const trendData = JSON.parse(text);
    trendData.sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return trendData;
}


export const analyzeImage = async (imageFile: File, prompt: string) => {
  const imagePart = await fileToGenerativePart(imageFile);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, { text: prompt }] },
  });
  return response.text;
};

export const analyzeVideo = async (videoFile: File, prompt: string) => {
    const videoPart = await fileToGenerativePart(videoFile);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [videoPart, {text: prompt}] },
    });
    return response.text;
};

export const groundedSearch = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text,
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
  };
};

export const complexQuery = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
    },
  });
  return response.text;
};

export const transcribeAudio = async (audioFile: File) => {
  const audioPart = await fileToGenerativePart(audioFile);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [audioPart, { text: "Transcribe this audio." }] },
  });
  return response.text;
};

export const critiqueVideo = async (videoFile: File, brandConfig: string, trendIntelligenceJson: string): Promise<BrutalCritiqueResult> => {
  const videoPart = await fileToGenerativePart(videoFile);
  
  const promptWithContext = BRUTAL_TRUTH_PROMPT
    .replace('{brand_config}', brandConfig)
    .replace('{trend_intelligence}', trendIntelligenceJson);

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      scores: {
        type: Type.OBJECT,
        properties: {
          brand_fit: { type: Type.NUMBER }, clarity: { type: Type.NUMBER },
          visual_quality: { type: Type.NUMBER }, safety: { type: Type.NUMBER },
          viral_potential: { type: Type.NUMBER }, overall: { type: Type.NUMBER },
        },
      },
      verdict: { type: Type.STRING },
      brutal_truth: { type: Type.STRING },
      detailed_breakdown: {
        type: Type.OBJECT,
        properties: {
          brand_fit_diagnosis: { type: Type.STRING }, clarity_diagnosis: { type: Type.STRING },
          visual_quality_diagnosis: { type: Type.STRING }, safety_diagnosis: { type: Type.STRING },
          viral_potential_diagnosis: { type: Type.STRING },
        },
      },
      critical_failures: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            issue: { type: Type.STRING }, location: { type: Type.STRING },
            impact: { type: Type.STRING }, severity: { type: Type.STRING },
          },
        },
      },
      what_broke: { type: Type.ARRAY, items: { type: Type.STRING } },
      viral_tactics_used: { type: Type.ARRAY, items: { type: Type.STRING } },
      viral_tactics_missing: { type: Type.ARRAY, items: { type: Type.STRING } },
      competitive_analysis: {
          type: Type.OBJECT,
          properties: {
              what_competitors_do_well: { type: Type.STRING },
              your_differentiation_opportunity: { type: Type.STRING },
              who_to_study: { type: Type.STRING },
          }
      },
      fix_it_fast: { type: Type.STRING },
      detailed_action_plan: {
        type: Type.OBJECT,
        properties: {
          immediate_changes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { change: { type: Type.STRING }, from: { type: Type.STRING }, to: { type: Type.STRING }, why: { type: Type.STRING } } } },
          structural_changes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { change: { type: Type.STRING }, from: { type: Type.STRING }, to: { type: Type.STRING }, why: { type: Type.STRING } } } },
          content_strategy: { type: Type.OBJECT, properties: { trending_hook_to_use: { type: Type.STRING }, trending_topic_to_reference: { type: Type.STRING }, trending_audio_to_use: { type: Type.STRING }, meme_format_to_leverage: { type: Type.STRING } } },
          technical_specs: { type: Type.OBJECT, properties: { format: { type: Type.STRING }, resolution: { type: Type.STRING }, duration: { type: Type.STRING }, text_specs: { type: Type.STRING }, logo_placement: { type: Type.STRING }, colors_to_use: { type: Type.ARRAY, items: { type: Type.STRING } } } },
        },
      },
      regeneration_prompt_for_ai: { type: Type.STRING },
      if_you_had_30_minutes: { type: Type.STRING },
      examples_to_study: { type: Type.ARRAY, items: { type: Type.STRING } },
      trend_intelligence: {
        type: Type.OBJECT,
        properties: {
          trending_topics: { type: Type.ARRAY, items: { type: Type.STRING } },
          viral_formats: { type: Type.ARRAY, items: { type: Type.STRING } },
          trending_audio: { type: Type.ARRAY, items: { type: Type.STRING } },
          opportunity_gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: { parts: [videoPart, { text: promptWithContext }] },
    config: {
        responseMimeType: "application/json",
        responseSchema,
    }
  });
  
  const text = response.text.trim();
  return JSON.parse(text);
};