
import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Send, Loader2, Sparkles, Plus, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { polishMessage, savePostcard, getCurrentUser } from '../services/postcardService';
import { Postcard, Recipient } from '../types';

interface PostcardFormProps {
  onSuccess: () => void;
}

const FAMILY_MEMBERS = ['Tracey', 'Francis', 'Lucy', 'Orla', 'Ruby', 'Julian'];

const compressImage = (base64: string, maxWidth = 800, quality = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
      } else {
        if (height > maxWidth) { width *= maxWidth / height; height = maxWidth; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No context');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
  });
};

export const PostcardForm: React.FC<PostcardFormProps> = ({ onSuccess }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState('Detecting...');
  const [availableRecipients] = useState<string[]>(FAMILY_MEMBERS);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(['Family']);
  const [isSending, setIsSending] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sender = getCurrentUser();

  useEffect(() => {
    detectLocation();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressed = await compressImage(reader.result as string);
          setImage(compressed);
        } catch (err) {
          setImage(reader.result as string);
        } finally {
          setIsCompressing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E`),
      () => setLocation('Private Grounds')
    );
  };

  const handlePolish = async () => {
    if (!message) return;
    setIsSending(true);
    try {
      const polished = await polishMessage(message);
      setMessage(polished);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const toggleRecipient = (name: string) => {
    setSelectedRecipients(prev => 
      prev.includes(name) ? prev.filter(r => r !== name) : [...prev, name]
    );
  };

  const selectEveryone = () => {
    if (selectedRecipients.length === FAMILY_MEMBERS.length + 1) {
      setSelectedRecipients(['Family']);
    } else {
      setSelectedRecipients(['Family', ...FAMILY_MEMBERS]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !message || selectedRecipients.length === 0 || isSending) return;

    setIsSending(true);
    const newPost: Postcard = {
      id: crypto.randomUUID(),
      sender,
      recipients: selectedRecipients,
      message,
      location,
      imageUrl: image,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()
    };

    try {
      savePostcard(newPost);
      setTimeout(() => {
        setIsSending(false);
        onSuccess();
      }, 800);
    } catch (err) {
      alert("Storage full.");
      setIsSending(false);
    }
  };

  return (
    <div className="bg-archive-vellum p-8 border-l-[15px] border-archive-rust shadow-2xl max-w-2xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 border-b-2 border-l-2 border-archive-ink/5 border-dashed pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-archive-ink font-bold text-3xl uppercase tracking-tighter">New Dispatch</h2>
          <p className="font-mono text-[10px] text-archive-rust uppercase font-bold">Author: {sender}</p>
        </div>
        <div className="bg-archive-ink text-archive-vellum px-3 py-1 font-mono text-[9px] uppercase tracking-widest">
          Postcard v2.4
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div 
          onClick={() => !isCompressing && fileInputRef.current?.click()}
          className="aspect-[4/3] bg-archive-ink/5 border-2 border-dashed border-archive-ink/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
        >
          {isCompressing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin text-archive-ink/30 mb-2" />
              <span className="font-mono text-[10px] text-archive-ink/50 uppercase">Developing Negative</span>
            </div>
          ) : image ? (
            <img src={image} className="w-full h-full object-cover grayscale sepia-[0.2]" />
          ) : (
            <>
              <Camera className="w-12 h-12 text-archive-ink/30 mb-2" />
              <span className="font-mono text-xs text-archive-ink/50 uppercase">Capture Observation</span>
            </>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] text-archive-rust font-bold uppercase tracking-widest">Message Text</label>
          <div className="relative">
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 90))}
              className="w-full bg-transparent border-b-2 border-archive-ink p-2 font-mono text-sm text-archive-ink focus:outline-none focus:border-archive-rust resize-none h-20 placeholder:text-archive-ink/10"
              placeholder="What do you see?"
            />
            <button 
              type="button"
              onClick={handlePolish}
              className="absolute bottom-2 right-2 text-archive-copper hover:text-archive-rust transition-colors"
              title="Refine with Gemini"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[10px] text-archive-rust font-bold uppercase tracking-widest flex items-center gap-2">
              <Users className="w-3 h-3" /> Designated Recipients
            </label>
            <button 
              type="button" 
              onClick={selectEveryone}
              className="font-mono text-[9px] text-archive-ink hover:text-archive-rust uppercase underline decoration-archive-rust/30"
            >
              Toggle Everyone
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleRecipient('Family')}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase border-2 transition-all ${selectedRecipients.includes('Family') ? 'bg-archive-rust border-archive-rust text-white' : 'border-archive-ink/10 text-archive-ink hover:border-archive-ink/30'}`}
            >
              Entire Family
            </button>
            {availableRecipients.filter(n => n !== sender).map(name => (
              <button
                key={name}
                type="button"
                onClick={() => toggleRecipient(name)}
                className={`
                  px-3 py-1.5 font-mono text-[10px] uppercase border-2 transition-all
                  ${selectedRecipients.includes(name) 
                    ? 'bg-archive-ink border-archive-ink text-archive-vellum' 
                    : 'border-archive-ink/10 text-archive-ink hover:border-archive-ink/30'}
                `}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-archive-ink/10 flex items-center gap-4">
           <div className="flex-1">
            <label className="font-mono text-[10px] text-archive-rust font-bold uppercase">Archive Coordinates</label>
            <div className="flex items-center gap-2 border-b border-archive-ink/20 pb-2">
              <MapPin className="w-3 h-3 text-archive-ink" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent font-mono text-xs text-archive-ink focus:outline-none w-full"
              />
            </div>
          </div>
        </div>

        <button 
          disabled={!image || !message || selectedRecipients.length === 0 || isSending || isCompressing}
          className="w-full bg-archive-ink text-archive-vellum py-5 font-bold uppercase tracking-[0.3em] hover:bg-archive-rust transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group shadow-lg"
        >
          {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          Transmit
        </button>
      </form>
    </div>
  );
};
