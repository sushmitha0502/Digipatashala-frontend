import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

function DigitalLiteracy() {
  const { t } = useLanguage();
  const [currentModule, setCurrentModule] = useState(0);
  const [progress, setProgress] = useState({});
  const [completedModules, setCompletedModules] = useState([]);

  const modules = [
    {
      id: 'mobile-basics',
      title: t('mobileBasics'),
      description: t('mobileBasicsDesc'),
      content: [
        {
          type: 'text',
          content: t('mobileIntro')
        },
        {
          type: 'interactive',
          component: 'phone-parts',
          title: t('phoneParts')
        },
        {
          type: 'quiz',
          questions: [
            {
              question: t('phonePartsQuestion'),
              options: [t('screen'), t('battery'), t('camera'), t('allAbove')],
              correct: 3
            }
          ]
        }
      ]
    },
    {
      id: 'internet-basics',
      title: t('internetBasics'),
      description: t('internetBasicsDesc'),
      content: [
        {
          type: 'text',
          content: t('internetIntro')
        },
        {
          type: 'interactive',
          component: 'browser-demo',
          title: t('browserDemo')
        },
        {
          type: 'quiz',
          questions: [
            {
              question: t('internetQuestion'),
              options: [t('radio'), t('tv'), t('phone'), t('computer')],
              correct: 2
            }
          ]
        }
      ]
    },
    {
      id: 'online-search',
      title: t('onlineSearch'),
      description: t('onlineSearchDesc'),
      content: [
        {
          type: 'text',
          content: t('searchIntro')
        },
        {
          type: 'interactive',
          component: 'search-demo',
          title: t('searchDemo')
        },
        {
          type: 'quiz',
          questions: [
            {
              question: t('searchQuestion'),
              options: [t('firstResult'), t('ads'), t('reliableSources'), t('allResults')],
              correct: 2
            }
          ]
        }
      ]
    },
    {
      id: 'cyber-safety',
      title: t('cyberSafety'),
      description: t('cyberSafetyDesc'),
      content: [
        {
          type: 'text',
          content: t('safetyIntro')
        },
        {
          type: 'interactive',
          component: 'safety-tips',
          title: t('safetyTips')
        },
        {
          type: 'quiz',
          questions: [
            {
              question: t('safetyQuestion'),
              options: [t('sharePassword'), t('clickUnknownLinks'), t('useStrongPassword'), t('ignoreWarnings')],
              correct: 2
            }
          ]
        }
      ]
    },
    {
      id: 'online-tools',
      title: t('onlineTools'),
      description: t('onlineToolsDesc'),
      content: [
        {
          type: 'text',
          content: t('toolsIntro')
        },
        {
          type: 'interactive',
          component: 'email-demo',
          title: t('emailDemo')
        },
        {
          type: 'interactive',
          component: 'form-demo',
          title: t('formDemo')
        },
        {
          type: 'quiz',
          questions: [
            {
              question: t('toolsQuestion'),
              options: [t('gmail'), t('facebook'), t('whatsapp'), t('youtube')],
              correct: 0
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('digital-literacy-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }

    const savedCompleted = localStorage.getItem('digital-literacy-completed');
    if (savedCompleted) {
      setCompletedModules(JSON.parse(savedCompleted));
    }
  }, []);

  const handleModuleComplete = (moduleId) => {
    const newCompleted = [...completedModules, moduleId];
    setCompletedModules(newCompleted);
    localStorage.setItem('digital-literacy-completed', JSON.stringify(newCompleted));

    // Update progress
    const newProgress = { ...progress, [moduleId]: 100 };
    setProgress(newProgress);
    localStorage.setItem('digital-literacy-progress', JSON.stringify(newProgress));
  };

  const renderInteractiveComponent = (component, title) => {
    switch (component) {
      case 'phone-parts':
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="font-bold mb-4">{title}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-sm">{t('screen')}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔋</div>
                <p className="text-sm">{t('battery')}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">{t('camera')}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔊</div>
                <p className="text-sm">{t('speaker')}</p>
              </div>
            </div>
          </div>
        );

      case 'browser-demo':
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="font-bold mb-4">{title}</h4>
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <div className="bg-gray-200 h-8 rounded mb-4 flex items-center px-2">
                <span className="text-sm text-gray-600">🔍 {t('searchBar')}</span>
              </div>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded border">
                  <div className="text-sm font-medium">{t('website')}</div>
                  <div className="text-xs text-gray-600">{t('websiteDesc')}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'search-demo':
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="font-bold mb-4">{title}</h4>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded border">
                <div className="text-sm mb-2">{t('goodSearch')}: "{t('goodSearchExample')}"</div>
                <div className="text-xs text-green-600">✅ {t('specificResults')}</div>
              </div>
              <div className="bg-white p-4 rounded border">
                <div className="text-sm mb-2">{t('badSearch')}: "{t('badSearchExample')}"</div>
                <div className="text-xs text-red-600">❌ {t('tooManyResults')}</div>
              </div>
            </div>
          </div>
        );

      case 'safety-tips':
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="font-bold mb-4">{title}</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">🔒</span>
                <div>
                  <div className="font-medium">{t('strongPassword')}</div>
                  <div className="text-sm text-gray-600">{t('passwordTip')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">🚫</span>
                <div>
                  <div className="font-medium">{t('noUnknownLinks')}</div>
                  <div className="text-sm text-gray-600">{t('linkTip')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-500 text-xl">👁️</span>
                <div>
                  <div className="font-medium">{t('privacySettings')}</div>
                  <div className="text-sm text-gray-600">{t('privacyTip')}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'email-demo':
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="font-bold mb-4">{title}</h4>
            <div className="bg-white border rounded p-4">
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">{t('to')}:</label>
                <input type="email" className="w-full border rounded px-3 py-2" placeholder="friend@example.com" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">{t('subject')}:</label>
                <input type="text" className="w-full border rounded px-3 py-2" placeholder={t('emailSubject')} />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">{t('message')}:</label>
                <textarea className="w-full border rounded px-3 py-2 h-20" placeholder={t('emailMessage')}></textarea>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {t('sendEmail')}
              </button>
            </div>
          </div>
        );

      case 'form-demo':
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="font-bold mb-4">{title}</h4>
            <div className="bg-white border rounded p-4">
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">{t('fullName')}:</label>
                <input type="text" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">{t('email')}:</label>
                <input type="email" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">{t('message')}:</label>
                <textarea className="w-full border rounded px-3 py-2 h-20"></textarea>
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                {t('submit')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderQuiz = (questions) => {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (questionIndex, answerIndex) => {
      setAnswers({ ...answers, [questionIndex]: answerIndex });
    };

    const checkAnswers = () => {
      const correct = questions.filter((q, i) => answers[i] === q.correct).length;
      return { correct, total: questions.length };
    };

    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h4 className="font-bold mb-4">{t('quiz')}</h4>
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-4">
            <p className="font-medium mb-2">{question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <label key={oIndex} className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={oIndex}
                    onChange={() => handleAnswer(qIndex, oIndex)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={() => setShowResults(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t('checkAnswers')}
        </button>
        {showResults && (
          <div className="mt-4 p-3 bg-white rounded">
            <p className="font-medium">
              {t('score')}: {checkAnswers().correct}/{checkAnswers().total}
            </p>
            {checkAnswers().correct === checkAnswers().total && (
              <button
                onClick={() => handleModuleComplete(modules[currentModule].id)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {t('completeModule')}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const currentModuleData = modules[currentModule];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('digitalLiteracy')}</h1>
          <div className="flex gap-2 mb-4">
            {modules.map((module, index) => (
              <button
                key={module.id}
                onClick={() => setCurrentModule(index)}
                className={`px-4 py-2 rounded ${
                  index === currentModule
                    ? 'bg-blue-500 text-white'
                    : completedModules.includes(module.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-xl font-bold mb-2">{currentModuleData.title}</h2>
            <p className="text-gray-600 mb-4">{currentModuleData.description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progress[currentModuleData.id] || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {currentModuleData.content.map((item, index) => (
            <div key={index}>
              {item.type === 'text' && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                </div>
              )}
              {item.type === 'interactive' && renderInteractiveComponent(item.component, item.title)}
              {item.type === 'quiz' && renderQuiz(item.questions)}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentModule(Math.max(0, currentModule - 1))}
            disabled={currentModule === 0}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {t('previous')}
          </button>
          <button
            onClick={() => setCurrentModule(Math.min(modules.length - 1, currentModule + 1))}
            disabled={currentModule === modules.length - 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DigitalLiteracy;