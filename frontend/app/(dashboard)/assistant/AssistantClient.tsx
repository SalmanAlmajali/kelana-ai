"use client";

import { useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { SparklesIcon, ArrowUpIcon, FileTextIcon, AlertCircleIcon } from 'lucide-react';
import { AssistantService, AssistantResponse } from '@/services/assistantService';

export default function AssistantClient() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AssistantResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await AssistantService.askQuestion(query);
      if (res.status && res.data) {
        setResponse(res.data);
      } else {
        throw new Error(res.message || 'Failed to get a response');
      }
    } catch (err) {
      setError(AssistantService.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const extractFilename = (uri?: string) => {
    if (!uri) return 'document';
    return uri.split('/').pop() || 'document';
  };

  return (
    <div className="flex-1 flex flex-col items-center min-h-[calc(100vh-80px)] w-full max-w-4xl mx-auto py-8 sm:py-12 animate-fade-in text-center px-4">

      {/* Central Orb / Graphic */}
      <div className="mb-8 relative w-24 h-24">
        <div className="absolute inset-0 bg-linear-to-tr from-teal-500 to-emerald-400 rounded-full blur-2xl opacity-60 animate-pulse" />
        <div className="relative w-full h-full bg-linear-to-tr from-teal-400 to-emerald-500 rounded-full shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
          <div className="absolute top-2 right-4 w-6 h-6 bg-white/40 rounded-full blur-sm" />
          <SparklesIcon className="w-8 h-8 text-white relative z-10" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-6 sm:mb-10 tracking-tight text-center">
        Ask KelanaAI<br />
        <span className="text-zinc-400 text-lg sm:text-2xl mt-2 block">Powered by your trusted travel documents</span>
      </h1>

      <div className="w-full max-w-2xl relative transition-all duration-500">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl focus-within:border-teal-500/50 focus-within:bg-zinc-900 transition-all">
          <div className="flex items-center gap-2 sm:gap-3 px-2">
            <SparklesIcon className="w-5 h-5 text-teal-400 shrink-0" />
            <input
              type="text"
              placeholder="Can I bring medication into Japan?"
              className="flex-1 bg-transparent border-none text-white text-base sm:text-lg placeholder:text-zinc-500 focus:outline-none focus:ring-0 min-w-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAsk();
              }}
              disabled={loading}
            />
            <Button
              variant="primary"
              className="shrink-0 text-black bg-teal-400 hover:bg-teal-500"
              size="sm"
              isPending={loading}
              onPress={handleAsk}
            >
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : <ArrowUpIcon className="w-4 h-4" />}
                  {isPending ? "Thinking..." : "Ask"}
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-left animate-fade-in">
            <AlertCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-8 bg-[#2C6E63] text-white rounded-xl overflow-hidden shadow-2xl animate-fade-in text-left border border-white/10">
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-bold text-sm tracking-wider uppercase text-white/90 mb-3">AI Answer</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  {response.response.content?.text || 'No relevant answer found in your documents.'}
                </p>
              </div>

              <div className="h-px w-full bg-white/20" />

              <div>
                <h3 className="font-bold text-sm tracking-wider uppercase text-white/90 mb-3">Source</h3>
                <div className="flex items-center gap-2 text-white/90">
                  <FileTextIcon className="w-5 h-5" />
                  <span className="font-mono text-sm sm:text-base">
                    {extractFilename(response.response.location?.s3Location?.uri)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-zinc-500 text-sm">
          Answers are grounded in your uploaded documents.
        </div>
      </div>
    </div>
  );
}
