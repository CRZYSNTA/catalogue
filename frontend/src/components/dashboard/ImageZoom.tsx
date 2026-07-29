'use client';

import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoom({ src, alt, isOpen, onClose }: ImageZoomProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) setScale(1);
  }, [isOpen]);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.5, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.5, 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <button onClick={handleZoomOut} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
              <ZoomOut className="w-5 h-5" />
            </button>
            <button onClick={handleZoomIn} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
              <ZoomIn className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors ml-4">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div 
            className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden rounded-lg"
            onClick={e => e.stopPropagation()}
          >
            <motion.img
              src={src}
              alt={alt}
              animate={{ scale }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
              drag={scale > 1}
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
