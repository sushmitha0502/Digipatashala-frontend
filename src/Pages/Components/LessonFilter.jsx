import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

function LessonFilter({ onFilterChange, initialFilters = {} }) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    search: '',
    grade: '',
    subject: '',
    category: '',
    language: '',
    difficulty: '',
    school: '',
    class: '',
    section: '',
    ...initialFilters
  });

  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onFilterChange && onFilterChange(filters);
  }, [filters, onFilterChange]);

  useEffect(() => {
    if (filters.school) {
      fetchClasses(filters.school);
    }
  }, [filters.school]);

  useEffect(() => {
    if (filters.class) {
      fetchSections(filters.class);
    }
  }, [filters.class]);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setSchools(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchClasses = async (schoolId) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/classes`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setClasses(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const response = await fetch(`/api/classes/${classId}/sections`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setSections(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      grade: '',
      subject: '',
      category: '',
      language: '',
      difficulty: '',
      school: '',
      class: '',
      section: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder={t('searchLessons')}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filters.grade}
          onChange={(e) => updateFilter('grade', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('allGrades')}</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
            <option key={grade} value={grade}>{t('grade')} {grade}</option>
          ))}
        </select>

        <select
          value={filters.subject}
          onChange={(e) => updateFilter('subject', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('allSubjects')}</option>
          <option value="Mathematics">{t('mathematics')}</option>
          <option value="Science">{t('science')}</option>
          <option value="English">{t('english')}</option>
          <option value="Social Studies">{t('socialStudies')}</option>
          <option value="Computer Science">{t('computerScience')}</option>
          <option value="Hindi">{t('hindi')}</option>
          <option value="Telugu">{t('telugu')}</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('allCategories')}</option>
          <option value="video">{t('video')}</option>
          <option value="interactive">{t('interactive')}</option>
          <option value="reading">{t('reading')}</option>
          <option value="quiz">{t('quiz')}</option>
          <option value="assignment">{t('assignment')}</option>
        </select>

        <select
          value={filters.language}
          onChange={(e) => updateFilter('language', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('allLanguages')}</option>
          <option value="English">{t('english')}</option>
          <option value="Hindi">{t('hindi')}</option>
          <option value="Telugu">{t('telugu')}</option>
        </select>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          {isExpanded ? '▼' : '▶'} {t('advancedFilters')}
        </button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('difficulty')}
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => updateFilter('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('anyDifficulty')}</option>
              <option value="beginner">{t('beginner')}</option>
              <option value="intermediate">{t('intermediate')}</option>
              <option value="advanced">{t('advanced')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('school')}
            </label>
            <select
              value={filters.school}
              onChange={(e) => updateFilter('school', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('allSchools')}</option>
              {schools.map(school => (
                <option key={school._id} value={school._id}>{school.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('class')}
            </label>
            <select
              value={filters.class}
              onChange={(e) => updateFilter('class', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              disabled={!filters.school}
            >
              <option value="">{filters.school ? t('allClasses') : t('selectSchoolFirst')}</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {t('grade')} {cls.grade} - {cls.subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('section')}
            </label>
            <select
              value={filters.section}
              onChange={(e) => updateFilter('section', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              disabled={!filters.class}
            >
              <option value="">{filters.class ? t('allSections') : t('selectClassFirst')}</option>
              {sections.map(section => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Filter Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {hasActiveFilters && (
            <span>
              {Object.values(filters).filter(v => v !== '').length} {t('filtersActive')}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonFilter;