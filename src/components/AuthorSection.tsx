import React from 'react';
import { motion } from 'framer-motion';
import type { Author } from '../types/book';
import { BookCard } from './BookCard';
import { BookCardSkeleton } from './BookCardSkeleton';
import { useBookStore } from '../stores/bookStore';

interface AuthorSectionProps {
  author: Author;
}

export const AuthorSection: React.FC<AuthorSectionProps> = ({ author }) => {
  const { viewMode, isLoading } = useBookStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-baseline justify-between pb-4 border-b border-secondary-200">
        <h2 className="text-3xl font-extrabold text-secondary-900 tracking-tight">
          {author.name}
        </h2>
        <p className="text-secondary-500 font-medium">
          {author.books.length} {author.books.length === 1 ? 'book' : 'books'}
        </p>
      </div>
      
      <motion.div
        variants={containerVariants}
        className={`
          ${viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
            : 'space-y-4'
        }`}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <BookCardSkeleton key={index} viewMode={viewMode} />
            ))
          : author.books.map((book) => (
              <motion.div key={book.id} variants={itemVariants}>
                <BookCard book={book} viewMode={viewMode} />
              </motion.div>
            ))}
      </motion.div>
    </motion.section>
  );
};