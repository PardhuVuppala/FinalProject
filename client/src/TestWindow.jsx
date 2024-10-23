import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

const TestWindow = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(10); // Countdown for post-submit
  const [testName, setTestname] = useState("");
  
  const [timeLeft, setTimeLeft] = useState(20 * 60); // Timer for 20 mins in seconds

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const Employee_id = Cookies.get('Employee_id');
    
    // Token verification
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:1200/Employee/is-verify", {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
     
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    };
    
    const fetchExamQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:1200/Assessment/assessment/${examId}`);
        setQuestions(response.data.questionsAndOptions);
        setTestname(response.data.courseName);
      } catch (error) {
        console.error('Error fetching exam questions:', error);
        setError('Failed to fetch exam questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const enterFullScreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        document.mozRequestFullScreen();
      }
    };

    enterFullScreen(); // Enter full screen mode
    verifyToken();
    fetchExamQuestions();
    

    const testTimer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          clearInterval(testTimer);
          handleSubmit(); 
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(testTimer); // Cleanup the interval on component unmount

  }, [examId]);

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedOption,
    });
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleSubmit();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [questions]);

  const handleSubmit = async () => {
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
    const updatedScore = correctAnswersCount * 5;
    setScore(updatedScore);

    try {
      await axios.post('http://localhost:1200/skillScore/update', {
        id: Cookies.get('SkillScoreid'),
        assessmentId: examId,
        testScore: updatedScore,
      });
      console.log('Score updated successfully');
    } catch (error) {
      console.error('Error updating score:', error);
      setError('Failed to update score. Please try again later.');
    }


    startCountdown();
};


  const startCountdown = () => {
    const countdownInterval = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          navigate('/SkillTest');
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) return <p className="text-center">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
  <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">{testName}</h1>

  <div className="mb-8 p-4 border border-gray-300 rounded-lg shadow-lg bg-gray-50">
    <h2 className="font-semibold text-2xl text-gray-800">Time Left: {formatTime(timeLeft)}</h2>
    <p className="text-red-600 mt-2">
      <strong>Important:</strong> Don't use Esc or exit the window; doing so will automatically submit your test.
    </p>
  </div>

  {!results ? (
    <div>
      {questions.length > 0 ? (
        <div>
          {questions.map((question, index) => (
            <div key={index} className="mb-6 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
              <h2 className="font-semibold mb-4 text-xl text-gray-800">{index + 1}. {question.Question}</h2>
              <div className="flex flex-col space-y-4">
                {question.Options.map((option, idx) => (
                  <label key={idx} className={`flex items-center cursor-pointer p-4 rounded-lg transition-colors duration-200 
                          ${selectedAnswers[index] === option ? 'bg-blue-100 border-primary-100' : 'bg-gray-100 border-transparent'} 
                          border-2 hover:bg-blue-200`}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={() => handleAnswerSelect(index, option)}
                      checked={selectedAnswers[index] === option}
                      className="hidden"
                    />
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full border-2 
                          ${selectedAnswers[index] === option ? 'bg-primary-100 border-primary-100' : 'bg-white border-gray-400'}`}>
                    </span>
                    <span className="ml-4 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-primary-100 text-white px-6 py-3 rounded-lg mt-6 transition duration-200  focus:outline-none focus:ring-2  focus:ring-opacity-50"
          >
            Submit Test
          </button>
        </div>
      ) : (
        <p className="text-lg text-gray-600">No questions found for this test.</p>
      )}
    </div>
  ) : (
    <div>
      <h2 className="text-3xl font-bold mb-6">Results:</h2>
      {results.map((result, index) => (
        <div key={index} className="mb-6 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
          <h3 className="font-semibold mb-2 text-xl">{index + 1}. {result.question}</h3>
          <p><strong>Your Answer:</strong> {result.userAnswer || 'No answer selected'}</p>
          <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
          <p className={result.isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {result.isCorrect ? 'Correct' : 'Incorrect'}
          </p>
        </div>
      ))}
      <div className="mt-6 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h3 className="text-xl font-bold">Your Total Score: {score} / {questions.length * 5}</h3>
      </div>

      <div className="mt-8 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <button
          onClick={() => navigate('/SkillTest')}
          className="bg-primary-100 text-white px-6 py-3 rounded-lg  transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        >
          View Tests
        </button>
        <p className="mt-2 text-gray-600">Redirecting in {countdown} seconds...</p>
      </div>
    </div>
  )}
</div>

  );
};

export default TestWindow;
