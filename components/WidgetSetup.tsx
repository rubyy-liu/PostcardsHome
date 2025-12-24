
import React, { useState } from 'react';
import { Smartphone, Copy, Check, AlertTriangle, Code, UserCircle } from 'lucide-react';
import { getLatestForWidget } from '../services/postcardService';

const FAMILY_MEMBERS = ['Julian', 'Tracey', 'Francis', 'Lucy', 'Orla', 'Ruby'];

export const WidgetSetup: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [targetRecipient, setTargetRecipient] = useState('Lucy');
  
  const latestPost = getLatestForWidget(targetRecipient);

  const mockJson = {
    imageUrl: latestPost?.imageUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    sender: latestPost?.sender || "Family",
    message: latestPost?.message || "New memories await your viewing.",
    location: latestPost?.location || "Archive HQ",
    date: latestPost?.date || "01 JAN 25"
  };

  const widgetCode = `// Postcards Home Scriptable Widget
// Target Recipient: ${targetRecipient}
// ------------------------------------------------
const RECIPIENT = "${targetRecipient}";
const API_URL = "${window.location.origin}/api/widget?recipient=" + RECIPIENT;

async function createWidget() {
  const data = await fetchPostcard();
  const w = new ListWidget();
  w.backgroundColor = new Color("#0f110e");
  
  try {
    const imgReq = new Request(data.imageUrl);
    w.backgroundImage = await imgReq.loadImage();
  } catch (e) {
    w.addText("Connection Error").textColor = Color.red();
  }

  const gradient = new LinearGradient();
  gradient.colors = [new Color("#000000", 0.7), new Color("#000000", 0.1)];
  gradient.locations = [0, 1];
  w.backgroundGradient = gradient;

  w.addSpacer();

  const msg = w.addText(data.message);
  msg.font = Font.italicSystemFont(14);
  msg.textColor = new Color("#e8e3d7");
  msg.minimumScaleFactor = 0.5;

  w.addSpacer(4);

  const footer = w.addStack();
  const sender = footer.addText("FROM " + data.sender.toUpperCase());
  sender.font = Font.boldSystemFont(10);
  sender.textColor = new Color("#a64d2e");
  
  footer.addSpacer();
  
  const loc = footer.addText(data.location);
  loc.font = Font.systemFont(8);
  loc.textColor = new Color("#4d6356");

  return w;
}

async function fetchPostcard() {
  try {
    let req = new Request(API_URL);
    let json = await req.loadJSON();
    return json;
  } catch (e) {
    // Fallback for demo preview
    return ${JSON.stringify(mockJson, null, 2)};
  }
}

const widget = await createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="bg-archive-black border-2 border-archive-copper p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-archive-copper rotate-90 origin-top-right">
          DEVICE_SYNC_PROTOCOL_V4
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <Smartphone className="w-8 h-8 text-archive-rust" />
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-archive-vellum">iOS Home Integration</h2>
        </div>

        <div className="mb-10 p-6 bg-archive-rust/5 border border-archive-rust/20">
          <label className="block font-mono text-[10px] text-archive-rust uppercase font-bold mb-4 flex items-center gap-2">
            <UserCircle className="w-3 h-3" /> Select Target Recipient
          </label>
          <div className="flex flex-wrap gap-2">
            {FAMILY_MEMBERS.map(m => (
              <button 
                key={m}
                onClick={() => setTargetRecipient(m)}
                className={`px-4 py-2 font-mono text-[11px] uppercase border transition-all ${targetRecipient === m ? 'bg-archive-rust border-archive-rust text-white' : 'border-archive-copper text-archive-copper hover:text-white hover:border-white'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="mt-4 font-mono text-[9px] text-archive-copper italic">
            Configuring a widget for {targetRecipient}. This device will only display postcards sent specifically to {targetRecipient} or the entire family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 font-mono text-sm text-archive-vellum/70">
          <div className="space-y-6">
            <div className="bg-archive-rust/10 border border-archive-rust p-4 flex gap-3 text-archive-rust">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-[10px] leading-tight uppercase font-bold">
                Integration requires Scriptable App. Each script is tailored to its designated recipient.
              </p>
            </div>
            
            <ol className="list-decimal list-inside space-y-4 text-[12px] uppercase tracking-wide">
              <li>Open <span className="text-archive-vellum">Scriptable</span> on the target device.</li>
              <li>New script: <span className="text-archive-vellum">"Postcard_{targetRecipient}"</span>.</li>
              <li>Paste code snippet.</li>
              <li>Add Widget to Home Screen.</li>
              <li>Set script to <span className="text-archive-vellum">"Postcard_{targetRecipient}"</span>.</li>
            </ol>
          </div>

          <div className="relative group">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button 
                onClick={handleCopy}
                className="bg-archive-ink p-2 border border-archive-copper hover:bg-archive-rust transition-colors text-archive-vellum"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="bg-archive-ink p-6 overflow-x-auto text-[10px] h-[400px] border border-archive-copper/30 scrollbar-thin scrollbar-thumb-archive-rust">
              {widgetCode}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-archive-vellum/5 border-2 border-dashed border-archive-copper p-8">
        <div className="flex items-center gap-3 mb-6 text-archive-copper">
          <Code className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Data Preview for {targetRecipient}</h3>
        </div>
        <div className="bg-archive-black p-4 font-mono text-[11px] text-archive-rust overflow-x-auto">
          {JSON.stringify(mockJson, null, 2)}
        </div>
      </div>
    </div>
  );
};
