import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Limage from './Images/task.jpg'
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isotpModelOpen,setOtpMOdelOPen] = useState(false)
  const [Email,setEmail] = useState("");
  const[otp,setotp] = useState("");
  const[recivedOtp,setrecivedOTP] = useState("");
  const[isModelPassword,setModelPassword] = useState(false);
  const [Password,setPassword] = useState("");
  const [repassword,setrePassword] = useState("");
  const [homeScreen,setHomeScreen] = useState(true);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const notify = (message) => toast(message);
  const Navigate = useNavigate();
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setHomeScreen(!homeScreen);
    setEmail("");
    
  };


  const onPasswordForm = async(e) =>{
    e.preventDefault();
    try{
          const employeeEmail = Cookies.get('email');
          const password = Password
          const body = {employeeEmail,password,repassword};
          const response = await fetch("http://localhost:1200/Employee/changepasword", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(body)
       })
       if (response.status === 401) {
           const errorMessage = await response.text();
             // Call notify when there's an error
             notify(errorMessage);
       }
       else {
           Cookies.remove('email');
           notify("Password  Changed Successfully");
           
           setTimeout(() => {
             Navigate("/");
             setHomeScreen(!homeScreen);
             setModelPassword(!isModelPassword);
             setEmail("");
             setPassword("");
             setrePassword("");
             setotp("");
             
           },1000);
           
         }
    }
    catch(err)
    {
       console.error(err.message);
    }

}

  const OTPSubmit = async(e)=>
{ 
    e.preventDefault();
    if(otp===recivedOtp)
    { 
      notify("OTP Verified");
      setTimeout(() => {
      setOtpMOdelOPen(!isotpModelOpen);
      // Navigate("/");
      setModelPassword(!isModelPassword);
    },1000)
    }
    else
    {
      notify("OTP Entered by you is incorrect");
    }
}
  const PasswordModel = ()=>
  {
    setModelPassword(!isModelPassword);
    setHomeScreen(!homeScreen);
    setEmail("");
    setPassword("");
    setrePassword("");
    setotp("");

  }
   
  const OTPModal = () =>
  {
     setOtpMOdelOPen(!isotpModelOpen);
     setHomeScreen(!homeScreen);
     setotp("");
     setEmail("");
  }
  const { email, password } = user;

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await fetch("http://localhost:1200/Employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (response.status === 401) {
        notify("Invalid Email or Password");
        
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const parseRes = await response.json();
  
      if (parseRes.token) {
        const token = parseRes.token;
        Cookies.set("token", token, { expires: 1 });
        Cookies.set("Employee_id", parseRes.Employee_id);
        Cookies.set("role", parseRes.role);
        Cookies.set("name", parseRes.name);
        notify("Successfully Logged in");
        setTimeout(() => {
          Navigate("/DashBoard");
        }, 1000);
      } else {
        notify("An unexpected error occurred.");
      }
    } catch (err) {
      console.error('Error during login:', err.message);
    }
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
        return 'Please enter a password';
    }
    if (password.length === 1) {
        return 'Very Weak';
    }
    if (hasCapitalLetter && hasSmallLetter && hasSpecialCharacter && hasMinimumLength) {
        return 'Very Strong';
    }
    if (hasCapitalLetter && hasSmallLetter && hasMinimumLength) {
        return 'Strong';
    }
    if ((hasCapitalLetter || hasSmallLetter) && hasMinimumLength) {
        return 'Medium';
    }
    return 'Weak';
  };

const passwordStrength = getPasswordStrength(Password);
const FormSubmit = async(e) =>
{
  try{
  e.preventDefault();
  const body = {Email}
  Cookies.set('email',Email,{expires:1});
  const response = await fetch("http://localhost:1200/Employee/otp-verify",
  {
      method  :"POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(body)
  });
  
 
  if (response.status === 401) {
    const errorMessage = await response.text();
      notify(errorMessage);
  } 
  else
  {  
    const parseRes = await response.json()
    notify("OTP is sent to registered email address");
    setTimeout(() => {
    setrecivedOTP(parseRes.otp);
    setIsModalOpen(false);
    setOtpMOdelOPen(!isotpModelOpen);
    },1000)
  }
  }
   catch(err){
    console.error(err.message)
   }
}

  return (
    <div style={{
      backgroundPosition: "center",
      minHeight: "100vh", 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }} className=" bg-textbg">
       <ToastContainer />
       {homeScreen &&( 
      <div className='flex items-center justify-center'>
        <div className='relative flex flex-col m-6 space-y-8 bg-gray-50 shadow-2xl rounded-2xl md:flex-row md:space-y-0'>
          <div className='flex flex-col justify-center p-12 md:px-14 md:py-8'>
            <span className='mb-1 text-5xl text-center font-bold'>Login</span>
            <form className="mt-4 space-y-4" onSubmit={onSubmitForm}>
            <div className='py-0.5'>
              <span className='mb-2 text-md'>Email</span>
              <input
                type='text'
                className='block w-full mt-1.5 rounded-md box-border border-0 pl-2  bg-textbg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                name='email'
                id="email"
                value={email}
                onChange={(e) => onChange(e)}
                required
              />
            </div>

            <div className='py-0.5'>
              <span className='mb-2 text-md'>Password</span>
              <input
                type="password"
                name="password"
                autoComplete="password"
                className="block w-full mt-1.5 rounded-md box-border border-0 pl-2  bg-textbg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={password}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div className='flex items-center justify-between w-full mt-2'>
              <div className='flex items-center'>
                <input type="checkbox" className="ring-1 ring-inset ring-gray-300 mr-2" required />
                <span className='text-md'>Remember me</span>
              </div>
              <Link  onClick={toggleModal}
              className="block  font-medium rounded-lg text-sm px-5 py-2.5 text-center ">{' '}Forget password</Link>
            </div>
            <div className="flex justify-center">
              <button className="w-full bg-primary-100 text-white py-2 px-1 rounded-lg mb-2 hover:border-gray-300 mt-2">Sign in</button>
            </div>
            </form>
            <div className='text-center text-gray-400'>
              Don't have an account?{' '}
              <Link to="/SignUp" className='font-bold'>Sign Up</Link>
            </div>
          </div>
          <div className='relative'>
            <img src="https://www.cabem.com/wp-content/uploads/2022/05/Competency-The-Big-3.jpg" alt="Background" className='w-[400px] h-full hidden rounded-r-2xl md:block object-cover bg-[#F9F9F9]' />
            <div className='absolute hidden bottom-10 right-0 p-6 md:block'>
              {/* <span className='text-black text-xl'> 
          
              </span> */}
            </div>         
          </div>      
        </div>
      </div>
      )}
      {isModalOpen && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto  bg-opacity-80 flex justify-center items-center"
        >
          <div className="relative p-4 w-full max-w-3xl">
            <div className="relative flex flex-col md:flex-row space-y-8 md:space-y-0 shadow-2xl rounded-2xl">
              <div className="p-4 md:p-10 flex-grow bg-gray-50 shadow-2xl rounded-l-2xl">
                <button
                  onClick={toggleModal}
                  type="button"
                  className="end-2.5 text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" style={{border:"0px"}}  >
                <div className="flex items-center">
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 1L3 7l6 6"
                        />
                    </svg>
                    <span className="ml-1.5">back</span>
                </div>

                </button>
                <div class="relative">
                <form class="space-y-4 mt-20" onSubmit={FormSubmit}>
                    <div>
                    <span className='mb-2 text-md'>Email</span>
                    <input type="email" name="email" id="email" className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"    value={Email} onChange={(e)=>setEmail(e.target.value)} required/>
                    </div>
                    <button type="submit" className="w-full bg-primary-100 text-white py-2 px-2 rounded-lg mb-2 hover:border-gray-300 mt-2" >Get OTP</button>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                    </div>
                </form>
            </div>
             </div>
             <div className='relative w-full md:w-[400px]'>
              <img src="https://www.cabem.com/wp-content/uploads/2022/05/Competency-The-Big-3.jpg" alt="Background" className='w-full h-full rounded-r-2xl md:block object-cover' />
            </div>
            </div>
          </div>
        </div>
      )}

       {isotpModelOpen && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-textbg flex justify-center items-center"
        >
          <div className="relative p-4 w-full max-w-3xl ">
            <div className="relative flex flex-col md:flex-row space-y-8 md:space-y-0 shadow-2xl rounded-2xl">
              <div className="p-4 md:p-10 flex-grow bg-gray-50 shadow-2xl rounded-l-2xl">
                <button
                  onClick={OTPModal}
                  type="button"
                  className="end-2.5 text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " style={{border:"0px"}}>
                   <div className="flex items-center">
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 1L3 7l6 6"
                        />
                    </svg>
                    <span className="ml-1.5">back</span>
                </div>

                </button>

              
                <div class="relative">
                <form class="space-y-4 mt-10" onSubmit={OTPSubmit}>
                    <div>
                    <span className='mb-2 text-md'>Email</span>
                    <input type="email" name="email" id="email"  className="block w-full  bg-textbg rounded-md box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 mt-1.5 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"    value={Email} onChange={(e)=>setEmail(e.target.value)} required />
                    </div>
                    <div>
                    <span className='mb-2 text-md'>OTP</span>
                    <input type="text" name="otp" id="otp" className="block w-full  bg-textbg rounded-md box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 mt-1.5 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"   value={otp} onChange={(e)=>setotp(e.target.value)} required />
                    </div>
                    <button type="submit" className="w-full bg-primary-100 text-white py-2 px-1 rounded-lg mb-2 hover:border-gray-300 mt-2">Verify OTP</button>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                    </div>
                </form>
              </div>
             </div>
             <div className='relative w-full md:w-[400px]'>
              <img src="https://www.cabem.com/wp-content/uploads/2022/05/Competency-The-Big-3.jpg" alt="Background" className='w-full h-full rounded-r-2xl md:block object-cover' />
            </div>
            </div>
          </div>
        </div>
      )}
      
      {isModelPassword && (
        <div
        id="authentication-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed inset-0 z-50 overflow-y-auto  bg-opacity-80 flex justify-center items-center"
      >
        <div className="relative p-4 w-full max-w-3xl ">
          <div className="relative flex flex-col md:flex-row space-y-8 md:space-y-0 shadow-2xl rounded-2xl ">
            <div className="p-4 md:p-10 flex-grow bg-gray-50 shadow-2xl rounded-l-2xl">
              <button
                onClick={PasswordModel}
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" style={{border:"0px"}} >
                  <div className="flex items-center">
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 1L3 7l6 6"
                        />
                    </svg>
                    <span className="ml-1.5">back</span>
                </div>
              </button>
              <div className="relative">
                <form class="space-y-4 mt-10" onSubmit={onPasswordForm}>
                <div className="max-w-sm mx-auto mt-3">
                  <span className='mb-2 rext-md'>Password</span>
                  <input
                    type="password"
                    value={Password}
                    onChange={handleChange}
                    className="block w-full mt-1.5 rounded-md box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset  bg-textbg ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 pr-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                  <div className="mt-2 flex justify-between">
                    <div className="flex-1 mr-2">
                      <div className={`h-2 rounded ${passwordStrength === 'Very Weak' ? 'bg-red-400' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="flex-1 mr-2">
                      <div className={`h-2 rounded ${passwordStrength === 'Weak' ? 'bg-orange-400' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="flex-1 mr-2">
                      <div className={`h-2 rounded ${passwordStrength === 'Medium' ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="flex-1 mr-2">
                      <div className={`h-2 rounded ${passwordStrength === 'Strong' ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="flex-1">
                      <div className={`h-2 rounded ${passwordStrength === 'Very Strong' ? 'bg-blue-400' : 'bg-gray-300'}`}></div>
                    </div>
                  </div>
                </div>
                  <div>
                    <span className='mb-2 text-md'>Re-Enter Password</span>
                    <input
                      type="password"
                      className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={repassword}
                      onChange={(e) => setrePassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary-100 text-white py-2 px-5 rounded-lg mb-2 hover:border-gray-300 mt-2"
                  >
                    Change Password
                  </button>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-300"></div>
                </form>
              </div>
            </div>
            <div className='relative w-full md:w-[400px]'>
              <img src="https://www.cabem.com/wp-content/uploads/2022/05/Competency-The-Big-3.jpg" alt="Background" className='w-full h-full rounded-r-2xl md:block object-cover' />
            </div>
          </div>
        </div>
      </div>
      )}
  </div>
  );
}