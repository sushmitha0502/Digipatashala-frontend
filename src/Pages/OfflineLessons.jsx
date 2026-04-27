import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

function OfflineLessons() {
  const { t } = useLanguage();
  const [downloadedPackets, setDownloadedPackets] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle');

  useEffect(() => {
    // Load downloaded learning packets from IndexedDB or localStorage
    loadDownloadedPackets();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadDownloadedPackets = async () => {
    try {
      // Load from IndexedDB or localStorage
      const stored = localStorage.getItem('downloaded-packets');
      if (stored) {
        setDownloadedPackets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading downloaded packets:', error);
    }
  };

  const downloadPacket = async (packetId) => {
    try {
      const response = await fetch(`/api/learning-packets/${packetId}`);
      const packet = await response.json();

      if (!response.ok) throw new Error(packet.message);

      // Download attachments
      const downloadedPacket = {
        ...packet.data,
        downloadedAt: new Date().toISOString(),
        attachments: await Promise.all(
          packet.data.attachments.map(async (attachment) => {
            try {
              const attachmentResponse = await fetch(attachment.url);
              const blob = await attachmentResponse.blob();
              return {
                ...attachment,
                blob,
                offlineUrl: URL.createObjectURL(blob)
              };
            } catch (error) {
              console.error('Error downloading attachment:', error);
              return attachment;
            }
          })
        )
      };

      // Store in localStorage (in production, use IndexedDB)
      const updatedPackets = [...downloadedPackets, downloadedPacket];
      setDownloadedPackets(updatedPackets);
      localStorage.setItem('downloaded-packets', JSON.stringify(updatedPackets));

    } catch (error) {
      console.error('Error downloading packet:', error);
    }
  };

  const syncOfflineData = async () => {
    setSyncStatus('syncing');

    try {
      // Sync any offline progress or submissions
      const offlineActions = JSON.parse(localStorage.getItem('offline-actions') || '[]');

      for (const action of offlineActions) {
        try {
          await fetch(action.url, {
            method: action.method,
            headers: action.headers,
            body: action.body,
            credentials: 'include'
          });
        } catch (error) {
          console.error('Error syncing action:', error);
        }
      }

      // Clear synced actions
      localStorage.removeItem('offline-actions');
      setSyncStatus('completed');
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncStatus('error');
    }
  };

  const renderPacket = (packet) => (
    <div key={packet._id} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{packet.title}</h3>
          <p className="text-gray-600">{packet.description}</p>
          <div className="flex gap-2 mt-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {t('grade')}: {packet.grade}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              {packet.subject}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
              {packet.category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
            {isOnline ? t('online') : t('offline')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {t('availableOffline')}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div dangerouslySetInnerHTML={{ __html: packet.lessonText }} />
      </div>

      {packet.attachments && packet.attachments.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">{t('attachments')}:</h4>
          <div className="space-y-2">
            {packet.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm">{attachment.name}</span>
                <a
                  href={attachment.offlineUrl || attachment.url}
                  download={attachment.name}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  {t('download')}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {packet.quiz && (
        <div className="mb-4">
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            {t('takeQuiz')}
          </button>
        </div>
      )}

      {packet.assignment && (
        <div className="mb-4">
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            {t('viewAssignment')}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('offlineLessons')}</h1>
          <div className="flex items-center gap-4">
            <div className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? `🟢 ${t('online')}` : `🔴 ${t('offline')}`}
            </div>
            {syncStatus === 'syncing' && (
              <div className="text-sm text-blue-600">🔄 {t('syncPending')}</div>
            )}
            {syncStatus === 'completed' && (
              <div className="text-sm text-green-600">✅ {t('syncComplete')}</div>
            )}
          </div>
        </div>

        {!isOnline && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{t('noInternet')}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {downloadedPackets.length > 0 ? (
            downloadedPackets.map(renderPacket)
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('noOfflineLessons')}
              </h3>
              <p className="text-gray-500">
                {t('downloadLessonsForOffline')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfflineLessons;