import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

function ProgressTracker({ studentId, teacherView = false }) {
  const { t } = useLanguage();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    if (studentId) {
      fetchProgressData();
    }
  }, [studentId, selectedPeriod]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/progress-tracking/${studentId}?period=${selectedPeriod}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
        setProgressData(data.data);
      } else {
        console.error('Error fetching progress data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (activityType, points, details = {}) => {
    try {
      const response = await fetch('/api/progress-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          studentId,
          activityType,
          points,
          details
        })
      });

      const data = await response.json();

      if (response.ok) {
        fetchProgressData(); // Refresh data
      } else {
        console.error('Error updating progress:', data.message);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const renderProgressChart = () => {
    if (!progressData) return null;

    const { activities, achievements, level, totalPoints } = progressData;

    // Filter activities by subject if needed
    const filteredActivities = filterSubject === 'all'
      ? activities
      : activities.filter(activity => activity.subject === filterSubject);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{t('progressOverview')}</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('level')}</span>
              <span className="text-2xl font-bold text-blue-600">{level}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('totalPoints')}</span>
              <span className="text-2xl font-bold text-green-600">{totalPoints}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${Math.min((totalPoints % 1000) / 10, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {1000 - (totalPoints % 1000)} {t('pointsToNextLevel')}
            </p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{t('recentActivities')}</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filteredActivities.slice(0, 10).map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{t(activity.activityType)}</div>
                  <div className="text-sm text-gray-600">
                    {activity.subject} • {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+{activity.points}</div>
                  <div className="text-xs text-gray-500">{activity.details || ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">{t('achievements')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl mb-2">{achievement.icon || '🏆'}</div>
                <div className="font-medium">{t(achievement.name)}</div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
                <div className="text-xs text-yellow-600 mt-1">
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-wise Progress */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">{t('subjectProgress')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'].map((subject) => {
              const subjectActivities = activities.filter(a => a.subject === subject);
              const subjectPoints = subjectActivities.reduce((sum, a) => sum + a.points, 0);
              const subjectProgress = Math.min(subjectPoints / 100, 100); // Assuming 100 points per subject level

              return (
                <div key={subject} className="p-4 bg-gray-50 rounded">
                  <div className="font-medium mb-2">{subject}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${subjectProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {subjectPoints} {t('points')} • {subjectActivities.length} {t('activities')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderTeacherControls = () => {
    if (!teacherView) return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">{t('updateProgress')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => updateProgress('lesson_completed', 10, { subject: 'General' })}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {t('markLessonComplete')} (+10 {t('points')})
          </button>
          <button
            onClick={() => updateProgress('quiz_passed', 25, { subject: 'General' })}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {t('markQuizPassed')} (+25 {t('points')})
          </button>
          <button
            onClick={() => updateProgress('assignment_submitted', 15, { subject: 'General' })}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            {t('markAssignmentSubmitted')} (+15 {t('points')})
          </button>
          <button
            onClick={() => updateProgress('participation', 5, { subject: 'General' })}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            {t('markParticipation')} (+5 {t('points')})
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('timePeriod')}
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1"
            >
              <option value="week">{t('thisWeek')}</option>
              <option value="month">{t('thisMonth')}</option>
              <option value="quarter">{t('thisQuarter')}</option>
              <option value="year">{t('thisYear')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('subject')}
            </label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1"
            >
              <option value="all">{t('allSubjects')}</option>
              <option value="Mathematics">{t('mathematics')}</option>
              <option value="Science">{t('science')}</option>
              <option value="English">{t('english')}</option>
              <option value="Social Studies">{t('socialStudies')}</option>
              <option value="Computer Science">{t('computerScience')}</option>
            </select>
          </div>
        </div>
      </div>

      {renderTeacherControls()}
      {renderProgressChart()}
    </div>
  );
}

export default ProgressTracker;