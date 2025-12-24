
import React, { useState } from 'react';
import { ArchivePost } from '../types';
import { generateArchiveEntry, generateSpecimenImage } from '../services/geminiService';
import { Plus, Loader2, Microscope } from 'lucide-react';

interface GenerationPanelProps {
  onPostCreated: (post: ArchivePost) => void;
  nextIndex: number;
}

export const GenerationPanel: React.FC<GenerationPanelProps> = ({ onPostCreated, nextIndex }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const [entry, imageUrl] = await Promise.all([
        generateArchiveEntry(prompt),
        generateSpecimenImage(prompt)
      ]);

      const newPost: ArchivePost = {
        id: crypto.randomUUID(),
        title: entry.title || 'Untitled Specimen',
        observation: entry.observation || 'Analysis pending.',
        coordinates: entry.coordinates || '0.00° N, 0.00° W',
        status: entry.status || 'ARCHIVED',
        imageUrl: imageUrl,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase(),
        index: nextIndex
      };

      onPostCreated(newPost);
      setPrompt('');
    } catch (err) {
      console.error(err);
      setError('Generation failed. Ensure API KEY is valid.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-archive-black border-2 border-archive-rust shadow-2xl p-4 md:p-6 mb-4">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Identify new specimen (e.g., 'Volcanic Moss', 'Rusty Iron Bolt')..."
                className="w-full bg-archive-ink border border-archive-copper text-archive-vellum px-4 py-3 font-mono text-sm focus:outline-none focus:border-archive-rust placeholder:text-archive-copper/50"
                disabled={isGenerating}
              />
              <div className="absolute top-0 right-0 h-full flex items-center pr-3 pointer-events-none text-archive-copper">
                <Microscope className="w-4 h-4" />
              </div>
            </div>
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="bg-archive-rust hover:bg-archive-rust/80 disabled:bg-archive-ink disabled:text-archive-copper text-white font-bold px-8 py-3 flex items-center justify-center gap-2 uppercase tracking-tighter transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Preserve
                </>
              )}
            </button>
          </form>
          {error && <div className="text-archive-rust text-[10px] font-mono mt-2 uppercase">{error}</div>}
        </div>
      </div>
    </div>
  );
};
