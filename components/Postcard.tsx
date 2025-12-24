
import React, { useEffect, useState } from 'react';
import { Postcard as PostcardType } from '../types';
import { BrutalistStamp } from './BrutalistStamp';
import { User, MapPin, Users } from 'lucide-react';

interface PostcardProps {
  post: PostcardType & { observation: string; index: number };
}

export const Postcard: React.FC<PostcardProps> = ({ post }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isEven = post.index % 2 === 1;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const imageSection = (
    <div className="relative bg-[#d1cbc0] overflow-hidden border border-black/10 aspect-[4/5] group shadow-inner">
      <img 
        src={post.imageUrl} 
        alt="Postcard view"
        className="w-full h-full object-cover grayscale sepia-[0.2] contrast-[1.1] mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
      />
      <div className="absolute top-4 right-4">
        <BrutalistStamp 
          text={`SENDER: ${post.sender}`} 
          variant={isEven ? 'circular' : 'rectangular'}
        />
      </div>
    </div>
  );

  const dataSection = (
    <div className="flex flex-col justify-between font-mono py-4">
      <div className="border-b-2 border-archive-ink pb-6">
        <div className="flex items-center gap-2 text-[0.7rem] bg-archive-ink text-archive-vellum inline-flex px-3 py-1 mb-4 uppercase">
          <MapPin className="w-3 h-3" />
          {post.location}
        </div>
        <h2 className="font-sans text-3xl md:text-5xl uppercase leading-[0.9] font-bold text-archive-ink tracking-tighter italic">
          "{post.message}"
        </h2>
      </div>
      
      <div className="py-8">
        <div className="flex items-center gap-2 text-[0.7rem] font-bold text-archive-rust mb-2 uppercase">
          <User className="w-3 h-3" /> Origin: {post.sender}
        </div>
        <div className="flex items-start gap-2 text-xs text-archive-ink/40 uppercase tracking-widest leading-relaxed">
          <Users className="w-3 h-3 mt-0.5 shrink-0" />
          <span>Dispatch for: {post.recipients.join(', ')}</span>
        </div>
      </div>

      <div className="flex justify-between items-end text-[0.7rem] uppercase tracking-widest text-archive-ink pt-4 border-t border-archive-ink/10">
        <div>{post.date}</div>
        <div className="font-bold">VERIFIED DISPATCH</div>
      </div>
    </div>
  );

  return (
    <article 
      className={`
        relative w-full max-w-4xl bg-archive-vellum/90 backdrop-blur-sm 
        shadow-[20px_20px_0px_theme(colors.archive-black)] p-6 md:p-12
        grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16
        transition-all duration-700 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
        ${isEven ? 'self-end border-r-[15px] border-archive-copper' : 'self-start border-l-[15px] border-archive-rust'}
      `}
    >
      {isEven ? (
        <>
          {dataSection}
          {imageSection}
        </>
      ) : (
        <>
          {imageSection}
          {dataSection}
        </>
      )}
    </article>
  );
};
