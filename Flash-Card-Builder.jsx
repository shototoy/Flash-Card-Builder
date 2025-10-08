import React, { useState } from 'react';
import { Plus, Download, Upload, BookOpen, Trash2, Edit, Play, Home, ArrowLeft, FolderOpen } from 'lucide-react';

export default function FlashcardBuilder() {
  const [screen, setScreen] = useState('start');
  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentCards, setCurrentCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizCards, setQuizCards] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [type, setType] = useState('identification');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editingStack, setEditingStack] = useState(null);

  const handleImportSubject = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          const existingSubject = subjects.find(s => s.name === data.name);
          if (existingSubject) {
            if (window.confirm(`Subject "${data.name}" already exists. Merge topics?`)) {
              existingSubject.topics = [...existingSubject.topics, ...data.topics];
              setSubjects([...subjects]);
            }
          } else {
            setSubjects([...subjects, data]);
          }
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportSubject = (subject) => {
    const blob = new Blob([JSON.stringify(subject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTopic = (e, subjectName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const topic = JSON.parse(event.target.result);
          const subject = subjects.find(s => s.name === subjectName);
          if (subject) {
            const existingTopic = subject.topics.find(t => t.name === topic.name);
            if (existingTopic) {
              if (window.confirm(`Topic "${topic.name}" already exists. Replace it?`)) {
                existingTopic.cards = topic.cards;
                setSubjects([...subjects]);
              }
            } else {
              subject.topics.push(topic);
              setSubjects([...subjects]);
            }
          }
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportTopic = (subjectName, topic) => {
    const blob = new Blob([JSON.stringify(topic, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subjectName}_${topic.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addCard = () => {
    if (!question || !answer) {
      alert('Please fill in both question and answer');
      return;
    }

    if (editingCard !== null) {
      const updated = [...currentCards];
      updated[editingCard] = { question, answer, type };
      setCurrentCards(updated);
      setEditingCard(null);
    } else {
      setCurrentCards([...currentCards, { question, answer, type }]);
    }
    
    setQuestion('');
    setAnswer('');
    setType('identification');
  };

  const deleteCard = (idx) => {
    setCurrentCards(currentCards.filter((_, i) => i !== idx));
  };

  const editCard = (idx) => {
    const card = currentCards[idx];
    setQuestion(card.question);
    setAnswer(card.answer);
    setType(card.type);
    setEditingCard(idx);
  };

  const saveStack = () => {
    if (!currentSubject || !currentTopic) {
      alert('Please enter subject and topic');
      return;
    }
    if (currentCards.length === 0) {
      alert('Please add at least one card');
      return;
    }

    if (editingStack) {
      const { oldSubject, oldTopic } = editingStack;
      const updated = subjects.map(s => {
        if (s.name === oldSubject) {
          return {
            ...s,
            name: currentSubject,
            topics: s.topics.map(t => {
              if (t.name === oldTopic) {
                return { name: currentTopic, cards: currentCards };
              }
              return t;
            })
          };
        }
        return s;
      });
      setSubjects(updated);
      setEditingStack(null);
    } else {
      const subjectExists = subjects.find(s => s.name === currentSubject);
      if (subjectExists) {
        const topicExists = subjectExists.topics.find(t => t.name === currentTopic);
        if (topicExists) {
          topicExists.cards = currentCards;
        } else {
          subjectExists.topics.push({ name: currentTopic, cards: currentCards });
        }
      } else {
        subjects.push({
          name: currentSubject,
          topics: [{ name: currentTopic, cards: currentCards }]
        });
      }
      setSubjects([...subjects]);
    }

    setCurrentSubject('');
    setCurrentTopic('');
    setCurrentCards([]);
    setScreen('dashboard');
  };

  const startQuiz = (cards) => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setQuizCards(shuffled);
    setQuizIndex(0);
    setUserAnswer('');
    setShowAnswer(false);
    setScreen('quiz');
  };

  const nextQuestion = () => {
    if (quizIndex < quizCards.length - 1) {
      setQuizIndex(quizIndex + 1);
      setUserAnswer('');
      setShowAnswer(false);
    } else {
      setScreen('subjectView');
    }
  };

  const deleteTopic = (subjectName, topicName) => {
    const updated = subjects.map(s => {
      if (s.name === subjectName) {
        return {
          ...s,
          topics: s.topics.filter(t => t.name !== topicName)
        };
      }
      return s;
    }).filter(s => s.topics.length > 0);
    setSubjects(updated);
  };

  const deleteSubject = (subjectName) => {
    if (window.confirm(`Delete entire subject "${subjectName}"?`)) {
      setSubjects(subjects.filter(s => s.name !== subjectName));
      setScreen('dashboard');
    }
  };

  const editStack = (subjectName, topicName) => {
    const subject = subjects.find(s => s.name === subjectName);
    const topic = subject.topics.find(t => t.name === topicName);
    
    setCurrentSubject(subjectName);
    setCurrentTopic(topicName);
    setCurrentCards([...topic.cards]);
    setEditingStack({ oldSubject: subjectName, oldTopic: topicName });
    setScreen('builder');
  };

  const viewSubject = (subject) => {
    setSelectedSubject(subject);
    setScreen('subjectView');
  };

  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Flashcard Builder</h1>
            <p className="text-gray-600">Create and study your flashcards</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setScreen('dashboard')}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 cursor-pointer transition">
                  <Upload className="w-5 h-5" />
                  Import Subject
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSubject}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setScreen('builder')}
                  className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  New Topic
                </button>
              </div>
            </div>
          </div>

          {subjects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No subjects yet. Create your first topic!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-8 h-8 text-indigo-600" />
                      <h2 className="text-2xl font-bold text-gray-800">{subject.name}</h2>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{subject.topics.length} topics</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewSubject(subject)}
                      className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition text-sm"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleExportSubject(subject)}
                      className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSubject(subject.name)}
                      className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'subjectView') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setScreen('dashboard')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">{selectedSubject.name}</h1>
              </div>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 cursor-pointer transition">
                  <Upload className="w-5 h-5" />
                  Import Topic
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleImportTopic(e, selectedSubject.name)}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => {
                    setCurrentSubject(selectedSubject.name);
                    setScreen('builder');
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  New Topic
                </button>
              </div>
            </div>
          </div>

          {selectedSubject.topics.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No topics yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedSubject.topics.map((topic, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">{topic.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{topic.cards.length} cards</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => startQuiz(topic.cards)}
                      className="flex items-center justify-center gap-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition text-sm"
                    >
                      <Play className="w-4 h-4" />
                      Quiz
                    </button>
                    <button
                      onClick={() => editStack(selectedSubject.name, topic.name)}
                      className="flex items-center justify-center gap-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleExportTopic(selectedSubject.name, topic)}
                      className="flex items-center justify-center gap-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button
                      onClick={() => deleteTopic(selectedSubject.name, topic.name)}
                      className="flex items-center justify-center gap-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'builder') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setScreen(selectedSubject ? 'subjectView' : 'dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                {editingStack ? 'Edit Topic' : 'New Topic'}
              </h1>
              <div className="w-20"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Subject (e.g., Math)"
                value={currentSubject}
                onChange={(e) => setCurrentSubject(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Topic (e.g., Algebra)"
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-4 mb-6">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none"
              >
                <option value="identification">Identification</option>
                <option value="enumeration">Enumeration</option>
              </select>

              <textarea
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none h-24"
              />

              <textarea
                placeholder="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none h-24"
              />

              <button
                onClick={addCard}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {editingCard !== null ? 'Update Card' : 'Add Card'}
              </button>
            </div>

            {currentCards.length > 0 && (
              <div>
                <div className="border-t-2 border-gray-200 pt-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Cards ({currentCards.length})</h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {currentCards.map((card, idx) => (
                      <div key={idx} className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-400 transition">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold text-indigo-600 uppercase">{card.type}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editCard(idx)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCard(idx)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800 mb-1">Q: {card.question}</p>
                        <p className="text-gray-600 text-sm">A: {card.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={saveStack}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Save Topic
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    const currentCard = quizCards[quizIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setScreen('subjectView')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Home className="w-5 h-5" />
              Exit
            </button>
            <span className="text-gray-600 font-semibold">
              Question {quizIndex + 1} of {quizCards.length}
            </span>
          </div>

          <div className="mb-6">
            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {currentCard.type.toUpperCase()}
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentCard.question}</h2>
          </div>

          <textarea
            placeholder="Type your answer here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-indigo-500 focus:outline-none h-32 mb-4"
          />

          {showAnswer && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
              <p className="font-semibold text-green-800 mb-2">Correct Answer:</p>
              <p className="text-gray-800">{currentCard.answer}</p>
            </div>
          )}

          <div className="flex gap-3">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Show Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                {quizIndex < quizCards.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}