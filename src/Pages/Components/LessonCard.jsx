import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

function LessonCard({ lesson, onDownload, isOffline = false }) {
  const { t } = useLanguage();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if lesson is already downloaded
    const downloadedPackets = JSON.parse(localStorage.getItem('downloaded-packets') || '[]');
    const downloaded = downloadedPackets.find(p => p._id === lesson._id);
    setIsDownloaded(!!downloaded);

    // Check if lesson is completed
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]');
    setIsCompleted(completedLessons.includes(lesson._id));
  }, [lesson._id]);

  const handleDownload = async () => {
    if (isOffline) {
      alert(t('offlineDownloadNotAvailable'));
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      if (onDownload) {
        await onDownload(lesson._id);
      }

      setIsDownloaded(true);
      setIsDownloading(false);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const markAsCompleted = () => {
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]');
    if (!completedLessons.includes(lesson._id)) {
      completedLessons.push(lesson._id);
      localStorage.setItem('completed-lessons', JSON.stringify(completedLessons));
      setIsCompleted(true);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'video': return '🎥';
      case 'interactive': return '🎮';
      case 'reading': return '📖';
      case 'quiz': return '❓';
      case 'assignment': return '📝';
      default: return '📚';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isCompleted ? 'ring-2 ring-green-500' : ''
    }`}>
      {/* Header with category icon and difficulty */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(lesson.category)}</span>
            <span className="text-sm font-medium text-gray-600">{t(lesson.category)}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
            {t(lesson.difficulty || 'beginner')}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {lesson.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {lesson.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {t('grade')}: {lesson.grade}
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
            {lesson.subject}
          </span>
          {lesson.language && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
              {lesson.language}
            </span>
          )}
          {lesson.duration && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
              {lesson.duration} {t('min')}
            </span>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lesson.attachments && lesson.attachments.length > 0 && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              📎 {lesson.attachments.length} {t('attachments')}
            </span>
          )}
          {lesson.quiz && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              ❓ {t('hasQuiz')}
            </span>
          )}
          {lesson.assignment && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              📝 {t('hasAssignment')}
            </span>
          )}
        </div>

        {/* Progress bar for completed lessons */}
        {isCompleted && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{t('completed')}</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
            </div>
          </div>
        )}

        {/* Download progress */}
        {isDownloading && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{t('downloading')}</span>
              <span>{downloadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          {!isDownloaded ? (
            <button
              onClick={handleDownload}
              disabled={isDownloading || isOffline}
              className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
                isDownloading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : isOffline
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isDownloading ? t('downloading') : isOffline ? t('offline') : t('download')}
            </button>
          ) : (
            <button
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded font-medium hover:bg-green-600 transition-colors"
            >
              ✅ {t('downloaded')}
            </button>
          )}

          {isDownloaded && !isCompleted && (
            <button
              onClick={markAsCompleted}
              className="px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition-colors"
            >
              {t('markComplete')}
            </button>
          )}

          {isCompleted && (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded font-medium cursor-default"
            >
              ✓ {t('completed')}
            </button>
          )}
        </div>

        {/* Offline indicator */}
        {isOffline && (
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              🔄 {t('availableOffline')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonCard;