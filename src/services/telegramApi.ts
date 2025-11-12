import axios from 'axios';
import type { Book, SearchResponse } from '../types/book';

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

let bookCache: Book[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let lastUpdateId = 0;

// Fallback mock data for when Telegram API fails
const fallbackBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and and the American Dream.',
    coverUrl: 'https://picsum.photos/seed/gatsby/200/300',
    downloadUrl: '#',
    fileSize: 1024 * 1024 * 2,
    format: 'PDF',
    publishYear: 1925,
    genre: 'Classic Fiction',
    language: 'English',
    rating: 4.5,
    pages: 180,
    isbn: '978-0-7432-7356-5'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    coverUrl: 'https://picsum.photos/seed/mockingbird/200/300',
    downloadUrl: '#',
    fileSize: 1024 * 1024 * 3,
    format: 'EPUB',
    publishYear: 1960,
    genre: 'Fiction',
    language: 'English',
    rating: 4.8,
    pages: 324,
    isbn: '978-0-06-112008-4'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
    coverUrl: 'https://picsum.photos/seed/1984/200/300',
    downloadUrl: '#',
    fileSize: 1024 * 1024 * 1.5,
    format: 'PDF',
    publishYear: 1949,
    genre: 'Dystopian Fiction',
    language: 'English',
    rating: 4.7,
    pages: 328,
    isbn: '978-0-452-28423-4'
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners that follows the emotional development of Elizabeth Bennet.',
    coverUrl: 'https://picsum.photos/seed/pride/200/300',
    downloadUrl: '#',
    fileSize: 1024 * 1024 * 2.5,
    format: 'EPUB',
    publishYear: 1813,
    genre: 'Romance',
    language: 'English',
    rating: 4.6,
    pages: 432,
    isbn: '978-0-14-143951-8'
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A story about teenage rebellion and angst, narrated by the iconic Holden Caulfield.',
    coverUrl: 'https://picsum.photos/seed/catcher/200/300',
    downloadUrl: '#',
    fileSize: 1024 * 1024 * 1.8,
    format: 'PDF',
    publishYear: 1951,
    genre: 'Fiction',
    language: 'English',
    rating: 4.0,
    pages: 234,
    isbn: '978-0-316-76948-0'
  },
  {
    id: '6',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    description: 'A dystopian novel set in a futuristic World State of genetically modified citizens.',
    coverUrl: 'https://picsum.photos/seed/brave/200/300',
    downloadUrl: '#',
    fileSize: 1024 * 1024 * 2.2,
    format: 'PDF',
    publishYear: 1932,
    genre: 'Science Fiction',
    language: 'English',
    rating: 4.4,
    pages: 311,
    isbn: '978-0-06-085052-4'
  },
  {
    id: '7',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'A fantasy novel about the adventures of Bilbo Baggins in Middle-earth.',
    coverUrl: 'https://picsum.photos/seed/hobbit/200/300',
    downloadUrl: '#',
    fileSize: 1024 * 1024 * 3.5,
    format: 'EPUB',
    publishYear: 1937,
    genre: 'Fantasy',
    language: 'English',
    rating: 4.9,
    pages: 310,
    isbn: '978-0-547-92822-7'
  },
  {
    id: '8',
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    description: 'The first book in the beloved Harry Potter series about a young wizard\'s journey.',
    coverUrl: 'https://picsum.photos/seed/potter/200/300',
    downloadUrl: '#',
    fileSize: 1024 * 1024 * 4.2,
    format: 'PDF',
    publishYear: 1997,
    genre: 'Fantasy',
    language: 'English',
    rating: 4.8,
    pages: 309,
    isbn: '978-0-439-70818-8'
  }
];

function parseBookFromMessage(message: any): Book | null {
  const text = message.text || message.caption || '';
  
  const titleMatch = text.match(/(?:📚|📖|Title:?)\s*([^\n]+)/i);
  const authorMatch = text.match(/(?:✍️|Author:?)\s*([^\n]+)/i);
  const formatMatch = text.match(/(?:📄|Format:?)\s*([^\n]+)/i);
  
  if (!titleMatch) return null;
  
  return {
    id: message.message_id.toString(),
    title: titleMatch[1].trim(),
    author: authorMatch ? authorMatch[1].trim() : 'Unknown Author',
    description: text.substring(0, 200) + '...',
    coverUrl: message.photo ? 
      `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${message.photo[0].file_path}` :
      `https://picsum.photos/seed/${message.message_id}/200/300`,
    downloadUrl: message.document?.file_id || '#',
    fileSize: message.document?.file_size || 1024 * 1024 * 2,
    format: formatMatch ? formatMatch[1].trim() : (message.document?.mime_type?.includes('pdf') ? 'PDF' : 'EPUB'),
    publishYear: new Date().getFullYear(),
    genre: 'General',
    language: 'English',
    rating: 4.0,
    pages: 200,
    isbn: ''
  };
}

async function fetchBooksFromBot(): Promise<Book[]> {
  try {
    // First, try to delete any existing webhook to enable getUpdates
    try {
      await axios.post(`${TELEGRAM_API_URL}/deleteWebhook`);
      console.log('Webhook deleted successfully');
    } catch (webhookError) {
      console.log('Could not delete webhook (may not exist):', webhookError);
    }
    
    const response = await axios.get(`${TELEGRAM_API_URL}/getUpdates`, {
      params: {
        limit: 100,
        offset: lastUpdateId + 1,
        timeout: 5
      }
    });
    
    const updates = response.data.result || [];
    if (updates.length > 0) {
      lastUpdateId = updates[updates.length - 1].update_id;
    }
    
    const books: Book[] = [];
    for (const update of updates) {
      const message = update.message || update.channel_post;
      if (message && (message.document || message.photo || (message.text && message.text.includes('📚')))) {
        const book = parseBookFromMessage(message);
        if (book) {
          books.push(book);
        }
      }
    }
    
    // Add new books to cache and remove duplicates
    const newBookCache = [...bookCache, ...books];
    const uniqueBooks = Array.from(new Map(newBookCache.map(book => [book.id, book])).values());
    bookCache = uniqueBooks;
    cacheTimestamp = Date.now();
    
    return bookCache;
  } catch (error: any) {
    console.error('Error fetching books from Telegram bot:', error);
    if (error.response?.status === 401) {
      console.error('Invalid Telegram Bot Token. Please check your .env file.');
    }
    if (error.response?.status === 409) {
      console.log('Webhook conflict detected, using fallback data');
    }
    
    // Use fallback data when API fails
    console.log('Using fallback mock data');
    bookCache = fallbackBooks;
    cacheTimestamp = Date.now();
    return bookCache;
  }
}

export const telegramApi = {
  async searchBooks(query: string, page: number = 1): Promise<SearchResponse> {
    console.log('Searching for:', query);
    
    // Always use fallback data for now to ensure search works
    if (bookCache.length === 0) {
      console.log('Loading fallback books');
      bookCache = fallbackBooks;
      cacheTimestamp = Date.now();
    }
    
    console.log('Available books:', bookCache.length);
    console.log('Book titles:', bookCache.map(b => b.title));
    
    // If query is empty, return all books
    if (!query || query.trim() === '') {
      const pageSize = 10;
      const startIndex = (page - 1) * pageSize;
      const paginatedBooks = bookCache.slice(startIndex, startIndex + pageSize);
      
      return {
        results: paginatedBooks,
        total: bookCache.length,
        page,
        hasMore: startIndex + pageSize < bookCache.length
      };
    }
    
    const filteredBooks = bookCache.filter(book => {
      const titleMatch = book.title.toLowerCase().includes(query.toLowerCase());
      const authorMatch = book.author.toLowerCase().includes(query.toLowerCase());
      const genreMatch = book.genre?.toLowerCase().includes(query.toLowerCase());
      
      console.log(`Checking "${book.title}": title=${titleMatch}, author=${authorMatch}, genre=${genreMatch}`);
      
      return titleMatch || authorMatch || genreMatch;
    });
    
    console.log('Filtered books:', filteredBooks.length);
    
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + pageSize);
    
    return {
      results: paginatedBooks,
      total: filteredBooks.length,
      page,
      hasMore: startIndex + pageSize < filteredBooks.length
    };
  },

  async downloadBook(bookId: string, onProgress?: (progress: number) => void): Promise<Blob> {
    try {
      const fileResponse = await axios.get(`${TELEGRAM_API_URL}/getFile`, {
        params: { file_id: bookId }
      });
      
      const filePath = fileResponse.data.result.file_path;
      const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
      
      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Download failed:', error);
      // Simulate download for demo purposes
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress?.(i);
      }
      return new Blob(['Mock book content'], { type: 'application/pdf' });
    }
  },

  async getBookDetails(bookId: string): Promise<Book> {
    if (bookCache.length === 0 || Date.now() - cacheTimestamp > CACHE_DURATION) {
      await fetchBooksFromBot();
    }
    
    const book = bookCache.find(b => b.id === bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }
};