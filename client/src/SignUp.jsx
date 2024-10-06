import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Limage from "./Images/task.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function SignUp() {
  const [employeeName, setemployeeName] = useState("");
  const [employeeEmail, setemployeeEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const Navigate = useNavigate();
  const notify = (message) => toast(message);

  const FormSubmit = async (e) => {
    e.preventDefault();
    
      try {
        const body = {
          employeeName,
          employeeEmail,
          gender,
          role:"user",
          password,
          repassword
        };
        const response = await fetch("http://localhost:1200/Employee/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 401) {
          const errorMessage = await response.text();
          notify(errorMessage);
        } else {
          notify("Successfully Registered");
          setTimeout(() => {
            Navigate("/");
          }, 500);
        }
      } catch (err) {
        console.log(err.message);
      }

      setemployeeName("");
      setemployeeEmail("");
      setGender("");
      setPassword("");
      setrePassword("");
    
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };
  const getPasswordStrength = (password) => {
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasSmallLetter = /[a-z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinimumLength = password.length >= 8;
    if (password.length === 0) {
      return "Please enter a password";
    }
    if (password.length === 1) {
      return "Very Weak";
    }
    if (
      hasCapitalLetter &&
      hasSmallLetter &&
      hasSpecialCharacter &&
      hasMinimumLength
    ) {
      return "Very Strong";
    }
    if (hasCapitalLetter && hasSmallLetter && hasMinimumLength) {
      return "Strong";
    }
    if ((hasCapitalLetter || hasSmallLetter) && hasMinimumLength) {
      return "Medium";
    }
    return "Weak";
  };
  const passwordStrength = getPasswordStrength(password);

  return (
    <div
      style={{
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="bg-textbg"
    >
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen bg-grey-100">
        <div className="relative flex flex-col m-6 space-y-8 bg-gray-50 shadow-2xl  rounded-2xl md:flex-row md:space-y-0">
          <div className="flex flex-col justify-center md:px-14 md:py-8 p-10">
            <span className="mb-2 text-5xl text-center font-bold">Sign Up</span>
            <form onSubmit={FormSubmit} method="POST">
              <div className="mt-3">
                <span className="mb-2 rext-md">First Name</span>
                <input
                  type="text"
                  className="block w-full mt-1.5 rounded-md  box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset bg-textbg ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="employeeName"
                  id="employeeName"
                  value={employeeName}
                  onChange={(e) => setemployeeName(e.target.value)}
                  required
                />
              </div>
            
              <div className="mt-3">
                <span className="mb-2 rext-md">employeeEmail</span>
                <input
                  type="email"
                  className="block w-full mt-1.5 rounded-md  box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset bg-textbg ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="employeeEmail"
                  id="employeeEmail"
                  value={employeeEmail}
                  onChange={(e) => setemployeeEmail(e.target.value)}
                  required
                />
              </div>
        
              <div className="mt-3">
                <span className="mb-2 rext-md">Gender</span>
                <div className="flex items-center">
                  <label className="inline-flex items-center mt-1.5">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out box-border border-0 shadow-sm ring-1 ring-inset  bg-textbg ring-gray-300"
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out box-border border-0 shadow-sm ring-1 ring-inset bg-textbg ring-gray-300"
                    />
                    <span className="ml-2">Female</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="gender"
                      value="Others"
                      checked={gender === "Others"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out box-border border-0 shadow-sm ring-1 ring-inset  bg-textbg ring-gray-300"
                    />
                    <span className="ml-2">Others</span>
                  </label>
                </div>
              </div>

              
              <div className="max-w-sm mx-auto mt-3">
                <span className="mb-2 rext-md">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={handleChange}
                  className="block w-full mt-1.5 rounded-md box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset  bg-textbg ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 pr-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
                <div className="mt-2 flex justify-between">
                  <div className="flex-1 mr-2">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === "Very Weak"
                          ? "bg-red-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 mr-2">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === "Weak"
                          ? "bg-orange-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 mr-2">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === "Medium"
                          ? "bg-yellow-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 mr-2">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === "Strong"
                          ? "bg-green-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === "Very Strong"
                          ? "bg-blue-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <span className="mb-2 rext-md">Confirm Password</span>
                <input
                  type="password"
                  className="block w-full mt-1.5 rounded-md box-border border-0 px-0 text-gray-900 shadow-sm bg-textbg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="repassword"
                  id="repassword"
                  value={repassword}
                  onChange={(e) => setrePassword(e.target.value)}
                  required
                />
              </div>
             
              <button
                className="w-full lg:w-auto bg-primary-100 text-white px-40 py-2 rounded-lg mb-2 
        hover:border-gray-300 mt-4 "
              >
                Sign Up
              </button>
            </form>
            <div className="text-center text-grey-400">
              Do you have an account?
              <Link to="/" className="font-bold">
                Sign In
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <img
              src="https://www.cabem.com/wp-content/uploads/2022/05/Competency-The-Big-3.jpg"
              alt="Image"
              className="w-[550px] h-[600px] rounded-r-2xl md:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}