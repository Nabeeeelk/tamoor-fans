'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import FanModel from './FanModel';
import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Zap } from 'lucide-react';

export default function FanViewer() {
  const [speed, setSpeed] = useState(1);
  const [active, setActive] = useState(true);

  return (
    <div className="w-full h-[500px] md:h-[700px] relative bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-200 shadow-inner">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={40} />
          <FanModel speed={speed} active={active} />
          <OrbitControls 
            enableZoom={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.5} 
          />
        </Suspense>
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-xl">
        <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
          <button 
            onClick={() => setActive(!active)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Zap size={20} fill={active ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="flex items-center gap-4 px-4">
          <Wind size={20} className="text-slate-400" />
          <input 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-xs font-black text-slate-800 w-8">
            {Math.round(speed * 100)}%
          </span>
        </div>
      </div>

      {/* Badge */}
      <div className="absolute top-8 left-8">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-lg">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Interactive 3D Preview</h4>
          <p className="text-[10px] text-slate-500 font-bold">Drag to rotate • Scroll to zoom</p>
        </div>
      </div>
    </div>
  );
}
