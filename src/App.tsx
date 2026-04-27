/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Activity, Cpu, Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen w-full bg-[#000] text-[#0ff] flex flex-col overflow-hidden font-sans border-0 md:border-[1px] border-[#0ff]/20" id="main-container">
      
      {/* CRT Effects */}
      <div className="crt-overlay" />
      <div className="scanline" />

      {/* Top Interface / System Header */}
      <header className="h-14 border-b border-[#0ff]/40 bg-black flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-[#f0f]" />
            <h1 
              className="text-lg font-black uppercase tracking-tighter glitch-text" 
              data-text="FRAGMENT_SNAKE.OS"
            >
              FRAGMENT_SNAKE.OS
            </h1>
          </div>
          <div className="hidden md:flex gap-4 ml-6 items-center border-l border-[#0ff]/20 pl-6">
            <span className="text-[10px] uppercase font-mono opacity-50">Core: v7.0.x</span>
            <span className="text-[10px] uppercase font-mono text-[#f0f]">Mem: Locked</span>
          </div>
        </div>

        <div className="flex gap-8 items-center font-mono">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] uppercase opacity-30">Neural Latency</span>
            <div className="flex items-center gap-2">
              <Activity size={10} className="text-[#0ff] animate-pulse" />
              <span className="text-[10px]">0.0003MS</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#0ff]/5 px-3 py-1 border border-[#0ff]/20">
            <Cpu size={14} className="animate-spin duration-3000" />
            <span className="text-[10px] font-bold">SYS_ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Neural Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Buffer / Data Stream */}
        <aside className="hidden lg:flex w-64 border-r border-[#0ff]/20 bg-black p-4 flex-col gap-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <h2 className="text-[10px] uppercase tracking-[0.2em] opacity-40">System Log</h2>
            <div className="w-2 h-2 rounded-full bg-[#f0f] animate-ping" />
          </div>
          
          <div className="space-y-3 font-mono text-[9px] opacity-40">
            <p>&gt; BOOTING NEURAL_SNAKE...</p>
            <p>&gt; ALLOCATING BUFFER_POOL[0xFFA]</p>
            <p>&gt; SYNCING FREQUENCY_OSC...</p>
            <p>&gt; MAPPING_GRID_VECTORS...</p>
            <p>&gt; WARNING: PARITY_ERR IN ADDR 0x42</p>
            <p>&gt; IGNORING ERR...</p>
            <p>&gt; ENGINE READY.</p>
          </div>

          <div className="mt-auto border-t border-[#0ff]/10 pt-4 space-y-4">
            <div className="h-16 w-full border border-[#0ff]/10 bg-[#0ff]/5 relative group overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-30 text-[10px] uppercase tracking-tighter">
                Audio Visualizer
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end gap-1 px-2 h-8">
                {[0.4, 0.9, 0.6, 1.0, 0.5, 0.7].map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${h*100}%`, `${Math.random()*100}%`, `${h*100}%`] }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="flex-1 bg-[#f0f]"
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Neural Grid Canvas */}
        <main className="flex-1 flex flex-col items-center justify-center bg-[#050505] relative p-4 md:p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #0ff 0, #0ff 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, #0ff 0, #0ff 1px, transparent 1px, transparent 32px)' }}></div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center justify-center"
          >
            <SnakeGame />
          </motion.div>
        </main>

        {/* Right Buffer / Diagnostic */}
        <aside className="hidden xl:flex w-64 border-l border-[#0ff]/20 bg-black p-6 flex-col gap-8 overflow-hidden font-mono text-[9px]">
          <div className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-widest text-[#f0f]">Diagnostic Tools</h2>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 border border-[#0ff]/10 bg-[#0ff]/5 hover:bg-[#0ff]/10 cursor-crosshair">RESET_KERN</div>
              <div className="p-2 border border-[#0ff]/10 bg-[#0ff]/5 hover:bg-[#0ff]/10 cursor-crosshair">CLEAR_CACHE</div>
              <div className="p-2 border border-[#0ff]/10 bg-[#0ff]/5 hover:bg-[#0ff]/10 cursor-crosshair">DUMP_STACK</div>
              <div className="p-2 border border-[#0ff]/10 bg-[#0ff]/5 hover:bg-[#0ff]/10 cursor-crosshair">SYNC_OSC</div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-[#0ff]/10">
             <div className="space-y-2">
                <div className="flex justify-between items-center opacity-40">
                  <span>Logic Throughput</span>
                  <span>99.9%</span>
                </div>
                <div className="w-full h-[1px] bg-[#0ff]/10">
                  <motion.div 
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="h-full bg-[#0ff]" 
                  />
                </div>
             </div>
             
             <p className="opacity-30 leading-relaxed italic">
               &lt;&lt; CRITICAL: THE MACHINE REQUIRES INPUT. FEED THE SERPENT. MAINTAIN FREQUENCY. &gt;&gt;
             </p>
          </div>
        </aside>
      </div>

      {/* Control Interface */}
      <MusicPlayer />
      
    </div>
  );
}
