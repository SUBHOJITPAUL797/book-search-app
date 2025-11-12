import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useBookStore } from '../stores/bookStore';
import { Button } from './ui/Button';

export const FilterPanel: React.FC = () => {
  const { isFiltersOpen, toggleFilters } = useBookStore();

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
    exit: { x: '-100%' },
  };

  return (
    <AnimatePresence>
      {isFiltersOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={toggleFilters}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          />
          
          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-40 
                       lg:relative lg:w-64 lg:h-fit lg:bg-white lg:shadow-sm lg:rounded-2xl 
                       lg:border lg:border-secondary-200 lg:z-0 lg:block lg:sticky lg:top-40"
          >
            <div className="p-5 border-b border-secondary-200 flex justify-between items-center lg:hidden">
              <h2 className="font-semibold text-lg text-secondary-800">Filters</h2>
              <Button variant="ghost" size="icon" onClick={toggleFilters}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-5 space-y-6">
              <div className="hidden lg:block pb-4 border-b border-secondary-200">
                <h2 className="font-semibold text-lg text-secondary-800">Filters</h2>
              </div>

              <div>
                <h3 className="font-semibold text-secondary-700 mb-3 text-sm">Genre</h3>
                <div className="space-y-2">
                  {['Fiction', 'Science', 'History', 'Business', 'Tech'].map(genre => (
                    <label key={genre} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 accent-primary-600" />
                      <span className="text-secondary-700">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-secondary-700 mb-3 text-sm">Publication Year</h3>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full border-secondary-300 rounded-lg shadow-sm text-sm h-10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  <span className="text-secondary-400">-</span>
                  <input type="number" placeholder="Max" className="w-full border-secondary-300 rounded-lg shadow-sm text-sm h-10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-secondary-700 mb-3 text-sm">Rating</h3>
                <div className="flex items-center gap-2">
                  {/* TODO: Replace with a star rating component */}
                  <span className="text-yellow-400 text-lg">★★★★☆</span>
                  <span className="text-sm text-secondary-600">4.0+</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-secondary-200">
                <Button className="w-full h-10">Apply Filters</Button>
                <Button variant="ghost" className="w-full mt-2 h-10">Clear All</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};