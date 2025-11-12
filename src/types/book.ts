export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  downloadUrl?: string;
  fileSize?: number;
  format?: string;
  publishYear?: number;
  genre?: string;
  language?: string;
  rating?: number;
  pages?: number;
  isbn?: string;
}

export interface SearchResponse {
  results: Book[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface Author {
  name: string;
  books: Book[];
  bookCount: number;
}

export interface FilterOptions {
  genre?: string;
  language?: string;
  yearRange?: [number, number];
  format?: string;
  sortBy?: 'title' | 'author' | 'year' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface DownloadProgress {
  bookId: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  error?: string;
}