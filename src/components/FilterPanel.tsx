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
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={toggleFilters}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
          
          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-40 lg:relative lg:w-64 lg:h-auto lg:bg-transparent lg:shadow-none lg:z-0 lg:block"
          >
            <div className="p-6 border-b border-secondary-200 flex justify-between items-center lg:hidden">
              <h2 className="font-bold text-lg">Filters</h2>
              <Button variant="ghost" size="icon" onClick={toggleFilters}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Genre</h3>
                <div className="space-y-2">
                  {['Fiction', 'Science', 'History', 'Business', 'Tech'].map(genre => (
                    <label key={genre} className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500" />
                      <span>{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Publication Year</h3>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full border-secondary-300 rounded-md shadow-sm text-sm" />
                  <span>-</span>
                  <input type="number" placeholder="Max" className="w-full border-secondary-300 rounded-md shadow-sm text-sm" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Rating</h3>
                <div className="flex items-center gap-2">
                  {/* Replace with a star rating component */}
                  <span className="text-yellow-400">★★★★☆</span>
                  <span>4.0+</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-secondary-200">
                <Button className="w-full">Apply Filters</Button>
                <Button variant="ghost" className="w-full mt-2">Clear All</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};