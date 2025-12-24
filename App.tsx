
import React, { useState, useEffect } from 'react';
import { Postcard } from './types';
import { Postcard as PostcardComponent } from './components/Postcard';
import { PostcardForm } from './components/PostcardForm';
import { WidgetSetup } from './components/WidgetSetup';
import { getPostcards, getCurrentUser, setCurrentUser } from './services/postcardService';
import { Home, Image as ImageIcon, PlusSquare, Smartphone, ChevronRight, UserCircle } from 'lucide-react';

type View = 'feed' | 'send' | 'setup' | 'home';

const FAMILY_MEMBERS = ['Julian', 'Tracey', 'Francis', 'Lucy', 'Orla', 'Ruby'];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Postcard[]>([]);
  const [currentUser, setIdentity] = useState(getCurrentUser());
  const [showIdentityMenu, setShowIdentityMenu] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setPosts(getPostcards());
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSetIdentity = (name: string) => {
    setCurrentUser(name);
    setIdentity(name);
    setShowIdentityMenu(false);
  };

  const refreshFeed = () => {
    setPosts(getPostcards());
    setView('feed');
  };

  return (
    <div className="min-h-screen grid-background pb-32">
      <div 
        className="fixed top-0 left-0 h-1 bg-archive-rust z-[100]" 
        style={{ width: `${scrollProgress}%` }} 
      />

      {/* Persistent Navigation */}
      <nav className="fixed top-0 w-full z-[90] p-6 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-between items-center pointer-events-auto">
          <div className="flex gap-4 items-center">
            <div 
              onClick={() => setView('home')} 
              className="bg-archive-black px-4 py-2 border-2 border-archive-rust cursor-pointer flex items-center gap-3 group"
            >
              <Home className="w-4 h-4 text-archive-rust group-hover:scale-110 transition-transform" />
              <span className="font-bold uppercase tracking-tighter text-archive-vellum hidden md:inline">Postcards</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowIdentityMenu(!showIdentityMenu)}
                className="bg-archive-copper/20 hover:bg-archive-copper/40 px-3 py-2 border border-archive-copper text-archive-vellum font-mono text-[10px] uppercase flex items-center gap-2"
              >
                <UserCircle className="w-3 h-3 text-archive-rust" />
                {currentUser}
              </button>
              {showIdentityMenu && (
                <div className="absolute top-full left-0 mt-2 bg-archive-black border border-archive-copper p-2 w-40 flex flex-col gap-1 shadow-2xl">
                  {FAMILY_MEMBERS.map(m => (
                    <button 
                      key={m} 
                      onClick={() => handleSetIdentity(m)}
                      className="text-left font-mono text-[10px] p-2 hover:bg-archive-rust hover:text-white text-archive-vellum uppercase"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <NavBtn icon={<ImageIcon />} label="Feed" active={view === 'feed'} onClick={() => setView('feed')} />
            <NavBtn icon={<PlusSquare />} label="Send" active={view === 'send'} onClick={() => setView('send')} />
            <NavBtn icon={<Smartphone />} label="Widget" active={view === 'setup'} onClick={() => setView('setup')} />
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 pt-32">
        {view === 'home' && (
          <section className="space-y-32">
            <header className="max-w-4xl">
              <p className="font-mono text-xs text-archive-copper mb-4 uppercase tracking-[0.2em]">Archival Network Active // Identified as {currentUser}</p>
              <h1 className="text-7xl md:text-9xl font-bold uppercase leading-[0.8] tracking-tighter text-archive-vellum mb-12">
                Postcards<br />Home.
              </h1>
              <p className="font-mono text-lg text-archive-copper max-w-xl leading-relaxed mb-8">
                A private family loop. Send a postcard to update your loved ones' home screens instantly.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setView('feed')}
                  className="px-8 py-4 bg-archive-rust text-white font-bold uppercase tracking-widest hover:bg-archive-rust/80 transition-all flex items-center gap-4"
                >
                  Enter Archive <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setView('send')}
                  className="px-8 py-4 border-2 border-archive-copper text-archive-vellum font-bold uppercase tracking-widest hover:bg-archive-copper/20 transition-all"
                >
                  New Dispatch
                </button>
              </div>
            </header>
            
            <div className="grid md:grid-cols-3 gap-12 border-t border-archive-copper pt-12">
              <div className="space-y-4">
                <h3 className="font-bold text-xl uppercase text-archive-vellum">The Feed</h3>
                <p className="font-mono text-sm text-archive-copper leading-relaxed opacity-70 italic">
                  "A collective timeline of every member's updates. The family history, uncurated and raw."
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-xl uppercase text-archive-vellum">Personal Widgets</h3>
                <p className="font-mono text-sm text-archive-copper leading-relaxed opacity-70 italic">
                  "Specify your recipient. The dispatch travels directly to their physical device screen."
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-xl uppercase text-archive-vellum">Current Identity</h3>
                <div className="flex flex-wrap gap-2">
                  {FAMILY_MEMBERS.map(m => (
                    <button 
                      key={m} 
                      onClick={() => handleSetIdentity(m)}
                      className={`px-3 py-1 font-mono text-[9px] border transition-all uppercase ${currentUser === m ? 'bg-archive-rust border-archive-rust text-white' : 'border-archive-copper text-archive-copper hover:border-archive-vellum hover:text-archive-vellum'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'feed' && (
          <div className="flex flex-col gap-40">
            {posts.length === 0 ? (
              <div className="text-center py-40 border-2 border-dashed border-archive-copper/30">
                <p className="font-mono text-archive-copper uppercase">The archive is currently empty.</p>
              </div>
            ) : (
              posts.map((post, i) => (
                <PostcardComponent 
                  key={post.id} 
                  post={{
                    ...post,
                    observation: post.message,
                    index: i
                  } as any}
                />
              ))
            )}
          </div>
        )}

        {view === 'send' && <PostcardForm onSuccess={refreshFeed} />}
        
        {view === 'setup' && <WidgetSetup />}
      </main>

      <footer className="mt-40 py-20 border-t border-archive-copper text-center">
        <p className="font-mono text-[10px] text-archive-copper uppercase tracking-[0.3em]">
          End of transmission // Protocol {currentUser}
        </p>
      </footer>
    </div>
  );
};

const NavBtn: React.FC<{ icon: any, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 font-bold uppercase tracking-tighter transition-all
      ${active ? 'bg-archive-rust text-white' : 'bg-archive-black text-archive-vellum hover:bg-archive-ink'}
    `}
  >
    {React.cloneElement(icon, { className: 'w-4 h-4' })}
    <span className="hidden md:inline">{label}</span>
  </button>
);

export default App;
