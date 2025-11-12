import React from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Download, Star, ArrowRight, AlertTriangle } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { AuthorSection } from '../components/AuthorSection';

import { Button } from '../components/ui/Button';
import { useBookSearch } from '../hooks/useBookSearch';
import { useBookStore } from '../stores/bookStore';
import { groupBooksByAuthor } from '../lib/utils';
import { BookCardSkeleton } from '../components/BookCardSkeleton';

export const HomePage: React.FC = () => {
  const { searchResults, isLoading, searchQuery, error, viewMode } = useBookStore();
  const { loadMore, hasMore, refetch } = useBookSearch();
  const groupedAuthors = groupBooksByAuthor(searchResults);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleRetry = () => {
    refetch();
  };

  const renderSkeletons = () => (
    <div className={`
      ${viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
        : 'space-y-4'
      }`}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <BookCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-secondary-900 tracking-tight">
                Book Search
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">About</Button>
              <Button>
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Panel */}
          <FilterPanel />

          {/* Results */}
          <div className="flex-1">
            {/* Welcome Section */}
            {searchQuery.length === 0 && !error && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center py-16 bg-white rounded-2xl shadow-sm border border-secondary-200"
              >
                <motion.div variants={itemVariants}>
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-primary-600" />
                  </div>
                </motion.div>
                <motion.h2 
                  variants={itemVariants}
                  className="text-4xl font-extrabold text-secondary-900 mb-4 tracking-tight"
                >
                  Find Your Next Great Read
                </motion.h2>
                <motion.p 
                  variants={itemVariants}
                  className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto"
                >
                  Search our extensive collection of books. Filter by author, genre, or publication year. 
                  Download your favorites in multiple formats.
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap justify-center gap-6"
                >
                  <div className="flex items-center gap-3 text-secondary-700">
                    <Download className="h-5 w-5 text-primary-500" />
                    <span>Easy Downloads</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-700">
                    <Star className="h-5 w-5 text-primary-500" />
                    <span>Curated Collection</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-700">
                    <BookOpen className="h-5 w-5 text-primary-500" />
                    <span>Author Organized</span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-red-200">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">An error occurred</h3>
                <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                  {error}
                </p>
                <Button onClick={handleRetry}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && searchResults.length === 0 && !error && (
              renderSkeletons()
            )}

        {/* Search Results */}
        {searchQuery.length > 0 && !isLoading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Debug Info */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Debug Info:</strong><br/>
                Search Query: "{searchQuery}"<br/>
                Results Count: {searchResults.length}<br/>
                Grouped Authors: {groupedAuthors.length}<br/>
                Loading: {isLoading ? 'Yes' : 'No'}<br/>
                Error: {error || 'None'}
              </p>
            </div>

            {searchResults.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Found {searchResults.length} books for "{searchQuery}"
                  </h2>
                  <p className="text-gray-600">
                    Organized by {groupedAuthors.length} {groupedAuthors.length === 1 ? 'author' : 'authors'}
                  </p>
                </div>
                
                <div className="space-y-8">
                  {groupedAuthors.map((author) => (
                    <AuthorSection key={author.name} author={author} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center mt-12">
                    <Button
                      onClick={loadMore}
                      loading={isLoading}
                      className="px-8"
                    >
                      Load More Books
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={() => useBookStore.getState().setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            )}
          </motion.div>
        )}
              </motion.div>
            )}

            {/* No Results */}
            {searchQuery.length > 0 && !isLoading && searchResults.length === 0 && !error && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-secondary-200">
                <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-secondary-500" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">No books found</h3>
                <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={() => useBookStore.getState().setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-secondary-500">&copy; 2024 Book Search. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-secondary-500">Built with</p>
              <span className="font-semibold text-primary-600">React</span>
              <span className="text-secondary-400">&</span>
              <span className="font-semibold text-blue-500">Telegram API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};