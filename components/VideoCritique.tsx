import React, { useState } from 'react';
import { critiqueVideo, getTrendIntelligence } from '../services/geminiService';
import { BrutalCritiqueResult, TrendIntelligence, GroundingChunk, ImmediateChange } from '../types';
import FileUploader from './common/FileUploader';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import ErrorAlert from './common/ErrorAlert';

interface BrandConfigState {
  name: string;
  industry: string;
  platform: string;
  dna: string;
}

const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
    const numericScore = score ?? 0;
    const width = `${(numericScore / 10) * 100}%`;
    const colorClass = numericScore >= 7 ? 'bg-green-500' : numericScore >= 4 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <span className={`text-sm font-bold ${numericScore >= 7 ? 'text-green-400' : numericScore >= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {numericScore.toFixed(1)} / 10
                </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className={`${colorClass} h-2.5 rounded-full`} style={{ width }}></div>
            </div>
        </div>
    );
};

const ActionPlanItem: React.FC<{ item: ImmediateChange, index: number }> = ({ item, index }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h5 className="font-bold text-lg text-brand-secondary mb-2">
            <span className="text-gray-500 mr-2">{index + 1}.</span>{item.change}
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-red-900/30 p-2 rounded">
                <p className="font-semibold text-red-300">FROM:</p>
                <p className="text-gray-400">{item.from}</p>
            </div>
            <div className="bg-green-900/30 p-2 rounded">
                <p className="font-semibold text-green-300">TO:</p>
                <p className="text-gray-400">{item.to}</p>
            </div>
        </div>
        <div className="mt-3 bg-gray-900/50 p-2 rounded">
            <p className="font-semibold text-gray-300">WHY:</p>
            <p className="text-gray-400 text-sm">{item.why}</p>
        </div>
    </div>
);


const VideoCritique: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [brandConfig, setBrandConfig] = useState<BrandConfigState>({
    name: 'Quickburger',
    industry: 'tast food restaurant',
    platform: 'TIKTOK',
    dna: 'Personality: Sassy, budget-friendly, confident Tone: Humc',
  });
  const [result, setResult] = useState<BrutalCritiqueResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string>('');

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBrandConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      setError('Please upload a video file.');
      return;
    }
    if (!brandConfig.name || !brandConfig.platform || !brandConfig.industry) {
      setError('Please provide Brand Name, Industry, and Platform.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      setLoadingMessage("🔍 Gathering real-time market intelligence...");
      const trendData = await getTrendIntelligence(brandConfig.industry, brandConfig.name, brandConfig.platform);

      setLoadingMessage("🤖 Running Brutal Truth Engine...");
      
      const configString = `
Brand Name: ${brandConfig.name}
Industry: ${brandConfig.industry}
Target Platform: ${brandConfig.platform}

Brand DNA & Rules:
${brandConfig.dna}
`;

      const trendString = JSON.stringify(trendData, null, 2);
      
      const critiqueResult = await critiqueVideo(videoFile, configString, trendString);
      
      setResult({ ...critiqueResult, trend_intelligence: trendData });

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An error occurred during the critique process.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };
  
  const getVerdictColor = (verdict: string) => {
    if (!verdict) return 'text-gray-400';
    const lowerVerdict = verdict.toLowerCase();
    if (lowerVerdict.includes('deploy')) return 'text-green-400';
    if (lowerVerdict.includes('revise')) return 'text-yellow-400';
    if (lowerVerdict.includes('kill') || lowerVerdict.includes('blocked') || lowerVerdict.includes('error')) return 'text-red-400';
    return 'text-gray-400';
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">BrandAI: Brutal Truth Engine</h2>
      <p className="text-center text-gray-400">Get a ruthless, actionable critique powered by real-time market data.</p>
       <div className="relative max-w-xs mx-auto">
        <input
            type="text"
            value="gemini-2.5-pro"
            disabled
            readOnly
            className="w-full text-center bg-gray-800/50 border border-gray-700 rounded-md py-1 px-3 text-sm text-gray-300 pointer-events-none"
        />
      </div>
      
      <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">1. Upload Video Creative</h3>
            <FileUploader onFileSelect={setVideoFile} accept="video/*" label="a video creative" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">2. Define Brand DNA</h3>
            <div className="space-y-3">
              <input type="text" name="name" value={brandConfig.name} onChange={handleConfigChange} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition" />
              <input type="text" name="industry" value={brandConfig.industry} onChange={handleConfigChange} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition" />
              <input type="text" name="platform" value={brandConfig.platform} onChange={handleConfigChange} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition" />
              <textarea
                name="dna"
                placeholder="Describe your brand's DNA..."
                value={brandConfig.dna}
                onChange={handleConfigChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition h-24"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
       <button onClick={handleSubmit} disabled={loading || !videoFile} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed text-lg">
        {loading ? 'Analyzing...' : 'GET BRUTAL TRUTH'}
      </button>

      {loading && <LoadingSpinner message={loadingMessage} />}
      {error && <ErrorAlert message={error} />}
      {result && (
        <ResultCard title="BrandAI Brutal Truth Report">
          <div className="space-y-8">
             <div className="text-center p-4 bg-gray-900 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 uppercase tracking-widest">Verdict</p>
                <p className={`text-5xl font-bold ${getVerdictColor(result.verdict)}`}>{result.verdict}</p>
             </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 space-y-4 p-4 bg-gray-900/50 rounded-lg">
                   <h4 className="text-lg font-bold text-white border-b border-gray-700 pb-2 mb-3">Scorecard</h4>
                   <ScoreBar label="Overall" score={result.scores.overall} />
                   <ScoreBar label="Viral Potential" score={result.scores.viral_potential} />
                   <ScoreBar label="Brand Fit" score={result.scores.brand_fit} />
                   <ScoreBar label="Clarity" score={result.scores.clarity} />
                   <ScoreBar label="Visual Quality" score={result.scores.visual_quality} />
                   <ScoreBar label="Safety" score={result.scores.safety} />
                </div>
                <div className="lg:col-span-3 space-y-4 p-4 bg-gray-900/50 rounded-lg flex flex-col justify-around">
                    <div>
                        <h4 className="font-bold text-brand-secondary text-lg">Brutal Truth:</h4>
                        <p className="text-2xl">"{result.brutal_truth}"</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-yellow-400 text-lg">⚡ Fix It Fast:</h4>
                        <p>{result.fix_it_fast}</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-yellow-400 text-lg">⏰ If You Had 30 Minutes:</h4>
                        <p>{result.if_you_had_30_minutes}</p>
                    </div>
                </div>
            </div>
            
            {result.detailed_action_plan?.immediate_changes?.length > 0 && (
                 <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-center">Your Action Plan: Immediate Changes</h3>
                    <div className="space-y-4">
                        {result.detailed_action_plan.immediate_changes.map((item, i) => <ActionPlanItem key={i} item={item} index={i}/>)}
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-red-900/20 rounded-lg">
                    <h4 className="font-bold text-red-400 mb-2">What Broke:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">{result.what_broke?.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>
                <div className="p-4 bg-blue-900/20 rounded-lg">
                    <h4 className="font-bold text-blue-400 mb-2">Viral Tactics Used:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">{result.viral_tactics_used?.length > 0 ? result.viral_tactics_used.map((item, i) => <li key={i}>{item}</li>) : <li>None detected.</li>}</ul>
                </div>
                 <div className="p-4 bg-yellow-900/20 rounded-lg">
                    <h4 className="font-bold text-yellow-400 mb-2">Viral Tactics Missing:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">{result.viral_tactics_missing?.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>
            </div>

             <details className="bg-gray-900/50 rounded-lg p-2">
                <summary className="cursor-pointer font-semibold p-2">Advanced Details & Full JSON</summary>
                <div className="space-y-4 p-2 mt-2 border-t border-gray-700">
                     <div className="p-4 bg-gray-900/50 rounded-lg">
                        <h4 className="font-bold text-brand-secondary">AI Regeneration Prompt:</h4>
                        <pre className="text-xs bg-black p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap">{result.regeneration_prompt_for_ai}</pre>
                    </div>
                    <pre className="text-xs bg-black p-4 rounded-md mt-2 overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
                </div>
            </details>
          </div>
        </ResultCard>
      )}
    </div>
  );
};

export default VideoCritique;