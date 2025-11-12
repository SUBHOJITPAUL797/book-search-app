import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Star, Calendar, FileText, Eye, Heart, CheckCircle } from 'lucide-react';
import type { Book } from '../types/book';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { formatFileSize } from '../lib/utils';
import { useBookStore } from '../stores/bookStore';

interface BookCardProps {
  book: Book;
  viewMode?: 'grid' | 'list';
}

export const BookCard: React.FC<BookCardProps> = ({ book, viewMode = 'grid' }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { addDownload, updateDownloadProgress } = useBookStore();

  const handleDownload = async () => {
    setIsDownloading(true);
    setIsDownloaded(false);
    setDownloadProgress(0);
    
    addDownload({
      bookId: book.id,
      progress: 0,
      status: 'pending'
    });

    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setDownloadProgress(i);
        updateDownloadProgress(book.id, i, i === 100 ? 'completed' : 'downloading');
      }

      const link = document.createElement('a');
      link.href = book.downloadUrl || '#';
      link.download = `${book.title}.${book.format?.toLowerCase() || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloaded(true);
    } catch (error) {
      updateDownloadProgress(book.id, 0, 'error');
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
      setTimeout(() => {
        setDownloadProgress(0);
      }, 1000);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-4 hover:shadow-xl transition-shadow duration-300 rounded-xl border-secondary-200">
          <CardContent className="p-4">
            <div className="flex gap-6">
              <img
                src={book.coverUrl || `https://picsum.photos/seed/${book.id}/100/150`}
                alt={book.title}
                className="w-24 h-36 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-secondary-900 mb-1">{book.title}</h3>
                    <p className="text-secondary-600 mb-2">by {book.author}</p>
                    <p className="text-sm text-secondary-500 line-clamp-2">{book.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    {book.rating && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-secondary-800">{book.rating}</span>
                      </div>
                    )}
                    {book.fileSize && (
                      <p className="text-sm text-secondary-500">{formatFileSize(book.fileSize)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-sm text-secondary-500">
                    {book.format && (
                      <span className="flex items-center gap-1.5 bg-secondary-100 px-2 py-1 rounded-md">
                        <FileText className="h-4 w-4" />
                        {book.format}
                      </span>
                    )}
                    {book.publishYear && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {book.publishYear}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDownload}
                      disabled={isDownloading || isDownloaded}
                      loading={isDownloading}
                      className={isDownloaded ? 'bg-accent-600 hover:bg-accent-700' : ''}
                    >
                      {isDownloaded ? <CheckCircle className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                      {isDownloading ? `${downloadProgress}%` : isDownloaded ? 'Downloaded' : 'Download'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 rounded-xl border-secondary-200">
        <div className="relative">
          <img
            src={book.coverUrl || `https://picsum.photos/seed/${book.id}/200/300`}
            alt={book.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 bg-white/80 backdrop-blur-sm">
              <Heart className="h-5 w-5 text-red-500" />
            </Button>
          </div>
          {book.rating && (
            <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold">{book.rating}</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg text-secondary-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-secondary-600 text-sm mb-3">by {book.author}</p>
          
          <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
            {book.format && (
              <span className="flex items-center gap-1.5 bg-secondary-100 px-2 py-1 rounded-md">
                <FileText className="h-4 w-4" />
                {book.format}
              </span>
            )}
            {book.fileSize && (
              <span className="font-medium">{formatFileSize(book.fileSize)}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(book.downloadUrl, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleDownload}
              disabled={isDownloading || isDownloaded}
              loading={isDownloading}
            >
              {isDownloaded ? <CheckCircle className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              {isDownloading ? `${downloadProgress}%` : isDownloaded ? 'Downloaded' : 'Download'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};