import React, { useState,useEffect} from 'react';
import Sidebar from './UI Components/sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";


const AssessmentForm = () => {
  const [courseName, setCourseName] = useState('');
  const [courseDepartment, setCourseDepartment] = useState('');
  const [questionsAndOptions, setQuestionsAndOptions] = useState([{ Question: '', Options: ['', '', '', ''], Answer: '' }]);
  const Navigate = useNavigate()
  const notify = (message) => toast(message);
   
   useEffect(()=>{
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const Employee_id = Cookies.get('Employee_id');
    //token verifucation
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
        Navigate("/");
      }
    };
   verifyToken()
   },[])
  const handleOptionChange = (index, optionIndex, value) => {
    const newQuestions = [...questionsAndOptions];
    newQuestions[index].Options[optionIndex] = value;
    setQuestionsAndOptions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questionsAndOptions];
    newQuestions[index].Question = value;
    setQuestionsAndOptions(newQuestions);
  };

  const handleAnswerChange = (index, value) => {
    const newQuestions = [...questionsAndOptions];
    newQuestions[index].Answer = value;
    setQuestionsAndOptions(newQuestions);
  };

  const handleAddQuestion = () => {
    if (questionsAndOptions.length < 20) {
      setQuestionsAndOptions([...questionsAndOptions, { Question: '', Options: ['', '', '', ''], Answer: '' }]);
    } else {
      notify('You can only add a maximum of 20 questions.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questionsAndOptions.length !== 20) {
      notify('You must have exactly 20 questions.');
      return; 
    }
    const data = { courseName, courseDepartment, questionsAndOptions };
  
    try {
      const response = await axios.post('http://localhost:1200/Assessment/assessment', data);
  
      if (response.status === 201) {
        notify('Assessment created successfully!');
        setCourseName('');
        setCourseDepartment('');
        setQuestionsAndOptions([{ Question: '', Options: ['', '', '', ''], Answer: '' }]);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        notify(error.response.data);
      } else {
        console.error('Error creating assessment:', error);
        notify('An error occurred while creating the assessment.');
      }
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer />
      <Sidebar className="w-1/4 h-screen bg-gray-800" />
      <div className="flex-1 p-6 bg-gray-100 overflow-hidden">
        <div className="container mx-auto bg-gray-100 rounded-lg shadow-lg p-8 h-full overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Create Assessment</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 ">
              <label className="block text-sm font-medium text-gray-600 mb-1">Course Name:</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter course name"
                className="block w-full mt-1.5 rounded-md box-border border-0 pl-2  bg-textbg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Course Department:</label>
              <input
                type="text"
                value={courseDepartment}
                onChange={(e) => setCourseDepartment(e.target.value)}
                placeholder="Enter course department"
                className="block w-full mt-1.5 rounded-md box-border border-0 pl-2  bg-textbg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Questions:</h3>
            {questionsAndOptions.map((q, index) => (
              <div key={index} className="mb-4 border p-3 border-gray-300 rounded-lg shadow-sm bg-gray-100">
                <label className="block text-sm font-medium text-gray-600 mb-1">Question:</label>
                <input
                  type="text"
                  value={q.Question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder={`Enter question ${index + 1}`}
                  className="block w-full mt-1.5 rounded-md box-border border-0 pl-2  bg-textbg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
                <label className="block text-sm font-medium text-gray-600 mt-2 mb-1">Options:</label>
                {q.Options.map((option, optionIndex) => (
                  <div key={optionIndex} className="mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="block w-full mt-1.5 rounded-md box-border border-0 pl-2  bg-textbg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                ))}
                <label className="block text-sm font-medium text-gray-600 mt-2 mb-1">Correct Answer:</label>
                <input
                  type="text"
                  value={q.Answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Enter the correct answer"
                  className="block w-full mt-1.5 rounded-md box-border border-0 pl-2  bg-textbg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="mb-4 bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Create Assessment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;
