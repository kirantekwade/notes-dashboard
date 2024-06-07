import React, { useState, useEffect, useContext } from 'react';
import '../../css/LoginStyle.css';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import LoginAuthContext from '@/context/LoginAuthProvider';
import Cookies from 'js-cookie';
import Login from './Login';

export default function Dashboard() {
  const auth = useContext(LoginAuthContext);
  const router = useRouter();

  useEffect(() => {
    if(!isAuthenticated){
    const token = Cookies.get('token')
    const email = Cookies.get('emailId')
    //auth.setDetails(email, token);
    auth.Authentication(email, token);
    }
  }, []);

  const { isAuthenticated } = useContext(LoginAuthContext);

  const showSyllabusList = (subjectName) => {
  console.log('dashboard',subjectName);
  window.location.replace(`/ShowSyllabus?id=${subjectName}`);
  };

  return (
    <>
      {/* {isAuthenticated && ( */}
        <div className="container-fluid">
          <div className="row">
            <div className='col-sm-2 bg-light'>
              <Sidebar />
            </div>
            <div className='col-sm-10' style={{ maxHeight: '100vh', overflowY: 'auto' }}>
              <div className='container text-center m-3'>
                <h1><b>Programming Institute & Software Development</b></h1>
              </div>
              <div className='container text-center mt-5'>
                <h4>Our Courses</h4>
                <div className='row'>
                  <div className='col-12 col-md-4 col-lg-4 p-2'>
                    <div className='border p-2'>
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN2Ob42L45hStICYlml7RTjH9p4q0E89vc6Q&s"
                        alt="C Lang"
                        className="rounded-circle"
                        height={60}
                      />
                      <br />
                      <button type="button" className="btn btn-lg" onClick={() => showSyllabusList('C')}><h3 className='text-primary'>C Programming</h3></button>
                      <p>The standard Syllabus and competitive programming practice</p>
                    </div>
                  </div>
                  <div className='col-12 col-md-4 col-lg-4 p-2'>
                    <div className='border p-2'>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1822px-ISO_C%2B%2B_Logo.svg.png"
                        alt="C++ Lang"
                        className="rounded-circle"
                        height={60}
                      />
                      <br />
                      <button type="button" className="btn btn-lg" onClick={() => showSyllabusList('CPlus')}><h3 className='text-primary'>C++ Programming</h3></button>
                      <p>The standard OOPS Syllabus and competitive programming practice</p>
                    </div>
                  </div>
                  <div className='col-12 col-md-4 col-lg-4 p-2'>
                    <div className='border p-2'>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/10321/10321655.png"
                        alt="Machine Learning"
                        className="rounded-circle"
                        height={60}
                      />
                      <br />
                      <button type="button" className="btn btn-lg" onClick={() => showSyllabusList('Machine')}><h3 className='text-primary'>Machine Learning</h3></button>
                      <p>The standard Syllabus and competitive programming practice</p>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12 col-md-4 col-lg-4 p-2'>
                    <div className='border p-2'>
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYY31U1ryM1lggsloYppz227oUXoPFFGSM_w&s"
                        alt="Java"
                        className="rounded-circle"
                        height={60}
                      />
                      <br />
                      <button type="button" className="btn btn-lg" onClick={() => showSyllabusList('Java')}><h3 className='text-primary'>Java Programming</h3></button>
                      <p>core Java + Advanced Java + GUI + WEB + MYSQL + NoSQL + Firebase ( Full Stack developer course )</p>
                    </div>
                  </div>
                  <div className='col-12 col-md-4 col-lg-4 p-2'>
                    <div className='border p-2'>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/6470/6470993.png"
                        alt="mobile"
                        className="rounded-circle"
                        height={60}
                      />
                      <br />
                      <button type="button" className="btn btn-lg" onClick={() => showSyllabusList('Flutter')}><h3 className='text-primary'>Mobile App Development</h3></button>
                      <p>Android + IOS + WEB + Embeded + Design Tools + Firebase + AI + ML ( Full Stack developer course )</p>
                    </div>
                  </div>
                  <div className='col-12 col-md-4 col-lg-4 p-2'>
                    <div className='border p-2'>
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGvGShLAJbL5g1fezQUTHYX7zWX7XRXmNv8A&s"
                        alt="Python"
                        className="rounded-circle"
                        height={60}
                      />
                      <br />
                      <button type="button" className="btn btn-lg" onClick={() => showSyllabusList('Python')}><h3 className='text-primary'>Python Programming</h3></button>
                      <p>All basics of programming languages, OOPS concepts, GUI, Web, Database, ML, AI libraries</p>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12 col-md-4 col-lg-4 p-2'>
                    <div className='border p-2'>
                      <img
                        src="https://static-00.iconduck.com/assets.00/react-icon-512x512-u6e60ayf.png"
                        alt="React"
                        className="rounded-circle"
                        height={60}
                      />
                      <br />
                      <button type="button" className="btn btn-lg" onClick={() => showSyllabusList('React')}><h3 className='text-primary'>ReactJs & NextJs</h3></button>
                      <p>The standard Syllabus and competitive programming practice</p>
                    </div>
                  </div>
                  <div className='col-12 col-md-4 col-lg-4 p-2'>
                    <div className='border p-2'>
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0srd1LpA4roN79I84_FdAGU_0-rJMvathZryM-XZPhtekWzlKA4uEUlq9ZBSUNznOZQo&usqp=CAU"
                        alt="DS"
                        className="rounded-circle"
                        height={60}
                      />
                      <br />
                      <button type="button" className="btn btn-lg" onClick={() => showSyllabusList('DS')}><h3 className='text-primary'>Data Structures</h3></button>
                      <p>ALL Data Structures using C or C++ and extra competitive practice</p>
                    </div>
                  </div>
                  <div className='col-12 col-md-4 col-lg-4 p-2'>
                    <div className='border p-2'>
                      <img
                        src="https://i.pinimg.com/736x/40/0f/22/400f22ce6f755ac476eb06c4cb45395c.jpg"
                        alt="Javascript"
                        className="rounded-circle"
                        height={60}
                      />
                      <br />
                      <button type="button" className="btn btn-lg" onClick={() => showSyllabusList('JavaScript')}><h3 className='text-primary'>Javascript Programming</h3></button>
                      <p>The standard Syllabus and competitive programming practice</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* )} */}
    </>
  );
}
