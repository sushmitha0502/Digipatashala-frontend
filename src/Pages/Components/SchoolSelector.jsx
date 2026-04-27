import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

function SchoolSelector({ onSelectionChange, initialSelection = {} }) {
  const { t } = useLanguage();
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSchool, setSelectedSchool] = useState(initialSelection.school || '');
  const [selectedClass, setSelectedClass] = useState(initialSelection.class || '');
  const [selectedSection, setSelectedSection] = useState(initialSelection.section || '');

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      fetchClasses(selectedSchool);
      setSelectedClass('');
      setSelectedSection('');
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedClass) {
      fetchSections(selectedClass);
      setSelectedSection('');
    }
  }, [selectedClass]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        school: selectedSchool,
        class: selectedClass,
        section: selectedSection
      });
    }
  }, [selectedSchool, selectedClass, selectedSection, onSelectionChange]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schools', {
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
        setSchools(data.data || []);
      } else {
        console.error('Error fetching schools:', data.message);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
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
      } else {
        console.error('Error fetching classes:', data.message);
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
      } else {
        console.error('Error fetching sections:', data.message);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;
    setSelectedSchool(schoolId);
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{t('selectSchoolClassSection')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* School Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('school')}
          </label>
          <select
            value={selectedSchool}
            onChange={handleSchoolChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">{loading ? t('loading') : t('selectSchool')}</option>
            {schools.map((school) => (
              <option key={school._id} value={school._id}>
                {school.name} - {school.location}
              </option>
            ))}
          </select>
        </div>

        {/* Class Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('class')}
          </label>
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedSchool}
          >
            <option value="">{selectedSchool ? t('selectClass') : t('selectSchoolFirst')}</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {t('grade')} {cls.grade} - {cls.subject}
              </option>
            ))}
          </select>
        </div>

        {/* Section Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('section')}
          </label>
          <select
            value={selectedSection}
            onChange={handleSectionChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedClass}
          >
            <option value="">{selectedClass ? t('selectSection') : t('selectClassFirst')}</option>
            {sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.name} ({section.studentCount || 0} {t('students')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedSchool && selectedClass && selectedSection && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-800 mb-1">{t('selectionSummary')}</h4>
          <p className="text-sm text-blue-600">
            {schools.find(s => s._id === selectedSchool)?.name} →
            {classes.find(c => c._id === selectedClass)?.grade} →
            {sections.find(s => s._id === selectedSection)?.name}
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-2xl font-bold text-gray-800">{schools.length}</div>
          <div className="text-sm text-gray-600">{t('schools')}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-2xl font-bold text-gray-800">{classes.length}</div>
          <div className="text-sm text-gray-600">{t('classes')}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-2xl font-bold text-gray-800">{sections.length}</div>
          <div className="text-sm text-gray-600">{t('sections')}</div>
        </div>
      </div>
    </div>
  );
}

export default SchoolSelector;