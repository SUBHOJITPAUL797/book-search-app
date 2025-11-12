import { create } from 'zustand';
import type { Book, FilterOptions, DownloadProgress } from '../types/book';

interface BookStore {
  // Search state
  searchQuery: string;
  searchResults: Book[];
  isLoading: boolean;
  currentPage: number;
  hasMore: boolean;
  error: string | null;
  
  // Filter state
  filters: FilterOptions;
  isFiltersOpen: boolean;
  
  // Download state
  downloads: DownloadProgress[];
  
  // UI state
  viewMode: 'grid' | 'list';
  selectedBook: Book | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Book[], hasMore: boolean, page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadMore: () => void;
  setFilters: (filters: FilterOptions) => void;
  toggleFilters: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSelectedBook: (book: Book | null) => void;
  addDownload: (download: DownloadProgress) => void;
  updateDownloadProgress: (bookId: string, progress: number, status: DownloadProgress['status']) => void;
  clearDownloads: () => void;
}

export const useBookStore = create<BookStore>((set, get) => ({
  // Initial state
  searchQuery: '',
  searchResults: [],
  isLoading: false,
  currentPage: 1,
  hasMore: false,
  error: null,
  
  filters: {},
  isFiltersOpen: false,
  
  downloads: [],
  
  viewMode: 'grid',
  selectedBook: null,
  
  // Actions
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1, error: null }),
  
  setSearchResults: (results, hasMore, page) => {
    set((state) => ({
      searchResults: page === 1 ? results : [...state.searchResults, ...results],
      hasMore,
      currentPage: page,
      isLoading: false
    }));
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  loadMore: () => {
    if (!get().isLoading && get().hasMore) {
      set((state) => ({ currentPage: state.currentPage + 1, isLoading: true }));
    }
  },
  
  setFilters: (filters) => set({ filters }),
  
  toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setSelectedBook: (book) => set({ selectedBook: book }),
  
  addDownload: (download) => {
    // Prevent adding duplicate downloads
    if (get().downloads.some(d => d.bookId === download.bookId)) return;
    set({ downloads: [...get().downloads, download] });
  },
  
  updateDownloadProgress: (bookId, progress, status) => {
    set((state) => ({
      downloads: state.downloads.map(d => 
        d.bookId === bookId ? { ...d, progress, status } : d
      )
    }));
  },
  
  clearDownloads: () => set({ downloads: [] }),
}));