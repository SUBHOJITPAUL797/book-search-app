import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useBookStore } from '../stores/bookStore';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, toggleFilters, viewMode, setViewMode, isFiltersOpen } = useBookStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
    if (e.target.value.length === 0) {
      setSearchQuery('');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-16 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-20">
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by title, author, or genre..."
              value={localQuery}
              onChange={handleInputChange}
              className="pl-12 pr-4 py-3 h-14 text-base w-full bg-gray-100 border-transparent focus:bg-white focus:border-primary-500 rounded-xl"
            />
          </form>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={isFiltersOpen ? "default" : "outline"}
              onClick={toggleFilters}
              className="flex items-center gap-2 h-14 w-14 sm:w-auto sm:px-6 rounded-xl"
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            
            <div className="flex items-center bg-gray-100 rounded-xl p-1 h-14">
              <Button
                type="button"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-12 w-12 rounded-lg"
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-12 w-12 rounded-lg"
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};