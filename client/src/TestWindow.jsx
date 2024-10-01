import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";


const TestWindow = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchExamQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:1200/Assessment/assessment/${examId}`);
        setQuestions(response.data.questionsAndOptions);
      } catch (error) {
        console.error('Error fetching exam questions:', error);
        setError('Failed to fetch exam questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExamQuestions();
  }, [examId]);

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedOption,
    });
  };

  const handleSubmit = async() => {
    const newResults = questions.map((question, index) => {
      const correctAnswer = question.Answer;
      const userAnswer = selectedAnswers[index] || '';
      return {
        question: question.Question,
        correctAnswer,
        userAnswer,
        isCorrect: correctAnswer === userAnswer,
      };

    });
    setResults(newResults);
    
    const correctAnswersCount = newResults.filter(result => result.isCorrect).length;
    setScore(correctAnswersCount * 5); 
    console.log(correctAnswersCount*5)
    const updatedScorce = correctAnswersCount*5
    try {
     
        await axios.post('http://localhost:1200/skillScore/update', {
          id:Cookies.get('SkillScoreid'),
          assessmentId:examId,
          testScore: updatedScorce,
        });
        console.log('Score updated successfully');
      } catch (error) {
        console.error('Error updating score:', error);
        setError('Failed to update score. Please try again later.');
      }
  };

  if (loading) return <p className="text-center">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Window</h1>

      {!results ? (
        <div>
          {questions.length > 0 ? (
            <div>
              {questions.map((question, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
                  <h2 className="font-semibold mb-4 text-lg">{index + 1}. {question.Question}</h2>
                  <div className="flex flex-col space-y-2">
                    {question.Options.map((option, idx) => (
                      <label key={idx} className="flex items-center cursor-pointer p-2 rounded transition-colors duration-200 
                          bg-gray-100 hover:bg-blue-100 
                          ${selectedAnswers[index] === option ? 'bg-blue-200' : 'bg-white'}
                      ">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          onChange={() => handleAnswerSelect(index, option)}
                          checked={selectedAnswers[index] === option}
                          className="hidden"
                        />
                        <span className={`flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 
                          ${selectedAnswers[index] === option ? 'bg-blue-500' : 'bg-white'}
                        `}></span>
                        <span className="ml-2">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition duration-200"
              >
                Submit Test
              </button>
            </div>
          ) : (
            <p>No questions found for this test.</p>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Results:</h2>
          {results.map((result, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
              <h3 className="font-semibold mb-2">{index + 1}. {result.question}</h3>
              <p><strong>Your Answer:</strong> {result.userAnswer || 'No answer selected'}</p>
              <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
              <p className={result.isCorrect ? 'text-green-500' : 'text-red-500'}>
                {result.isCorrect ? 'Correct' : 'Incorrect'}
              </p>
            </div>
          ))}
          <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-bold">Your Total Score: {score} / {questions.length * 5}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestWindow;
