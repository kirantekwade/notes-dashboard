import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import LoginAuthContext from '@/context/LoginAuthProvider';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';

export default function Notes({ subjects }) {
  const auth = useContext(LoginAuthContext);
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLangId, setSelectedLangId] = useState("");
  const [showList, setShowList] = useState(false);
  const [showContent, setContent] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [syllabusContent, setSyllabusContent] = useState([]);
  const [tutorialData, setTutorialData] = useState("");
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [profileData, setProfileData] = useState("");
  const [userSubjectList, setUserSubjectList] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token');
    const email = Cookies.get('emailId');
    const getUserData = async () => {
      try {
        const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/getStudentDetails/' + email);
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (!profileData) {
      getUserData();
    }

    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth < 768);
    };
    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);

    return () => {
      window.removeEventListener('resize', checkDeviceSize);
    };
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://us-central1-flutter-chedo.cloudfunctions.net/chedoImsApi/getSubjects');
        const sub = await response.json();
        if (profileData.role === 'Student') {
          try {
            const response = await fetch('https://us-central1-flutter-chedo.cloudfunctions.net/chedoImsApi/getNotesByStudentEmail/' + profileData.email);
            const data = await response.json();
            //setUserSubjectList(data.notes);
            const sortedSubjects = sub.subjects.sort((a, b) => a.subject.localeCompare(b.subject));
            const filteredSubjects = sortedSubjects.filter(subject =>
              data.notes.some(note => note === subject.subject)
            );
            console.log('filteredSubjects', filteredSubjects)
            setSubjectList(filteredSubjects);
          } catch (error) {
            console.error('Error fetching user subjects:', error);
          }
        }
        else {
          setSubjectList(sub.subjects.sort((a, b) => a.subject.localeCompare(b.subject)));
          setSubjectList(prevList => prevList.filter(subject => subject.subject !== 'BCA DBMS_RDBMS'));
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchData();
  }, [profileData, selectedLanguage, syllabusContent]);


  const { isAuthenticated } = useContext(LoginAuthContext);

  const handleUserChange = async (e) => {
    e.preventDefault();
    const selectedSubject = e.target.options[e.target.selectedIndex].getAttribute('dataValue');
    const selectedId = e.target.options[e.target.selectedIndex].getAttribute('dataId').replace("notes/", "");
    setSelectedLanguage(selectedSubject);
    setSelectedLangId(selectedId);
    setTutorialData("");
    if (selectedSubject === 'Select language') {
      setShowList(false);
      setContent(false);
    } else {
      setShowList(true);
      setContent(true);
      try {
        const response = await fetch(`https://us-central1-flutter-chedo.cloudfunctions.net/chedoImsApi/getSections/${selectedId}`);
        const sub = await response.json();
        setSyllabusContent(sub.sections.sort((a, b) => a.data.name.localeCompare(b.data.name)));
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    }
  };

  const ShowTutorial = (tutorialData) => {
    { isSmallDevice && setShowList(false); }
    setTutorialData(tutorialData);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSyllabus = () => {
    setShowList(!showList);
  };


  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className='col-sm-2 bg-light'>
            <Sidebar />
          </div>

          {!isSmallDevice ? (<>
            <div className='col-sm-7' style={{ maxHeight: '100vh', maxWidth: '100vw', overflowY: 'auto' }}>
              {showContent && tutorialData && (
                <>
                  <h2 className='mt-4 text-center'><b>Notes</b></h2>
                  <div className="container mt-4" style={{ textAlign: 'left', wordWrap: 'break-word', overflowX: 'hidden' }}>
                    <ReactMarkdown
                      components={{
                        img: ({ node, ...props }) => <img {...props} style={{ maxWidth: '100%', height: 'auto' }} />
                      }}
                    >
                      {tutorialData}
                    </ReactMarkdown>
                  </div>
                </>
              )}
            </div>
            <div className='col-sm-3'>
              <div style={{ position: 'sticky', top: 0 }}>
                <select className="form-select mt-2" id="userDropdown" onChange={handleUserChange}>
                  {!selectedLanguage && <option>Select language</option>}
                  {subjectList.map(subject => (
                    <option key={subject.docRef} value={subject.subject} dataId={subject.docRef} dataValue={subject.subject}>
                      {subject.subject}
                    </option>
                  ))}
                </select>
                <br />
                {showList && (
                  <div className='container-fluid border bg-white' style={{ maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>
                    <div className='row mt-2'>
                      <div className='col p-2 bg-light'>
                        <b>Syllabus</b>
                      </div>
                      {syllabusContent.map(content => (
                        <div className='row' key={content.id}>
                          <div className='col p-2'>
                            <button
                              type="button"
                              className="btn btn-white text-left"
                              id={content.id}
                              onClick={() => ShowTutorial(content.data.data)}
                              style={{ padding: 0 }}
                            >
                              {content.data.name}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>) :
            <>
              <div className='col-sm-3'>
                <div style={{ position: 'sticky', top: 0 }}>
                  <select className="form-select mt-2" id="userDropdown" onChange={handleUserChange}>
                    {!selectedLanguage && <option>Select language</option>}
                    {subjectList.map(subject => (
                      <option key={subject.docRef} value={subject.subject} dataId={subject.docRef} dataValue={subject.subject}>
                        {subject.subject}
                      </option>
                    ))}
                  </select>
                  <div className="position-relative">
                    <button className="btn btn-outline-primary mt-1 text-center" onClick={toggleSyllabus}>
                      Show Syllabus List
                    </button>
                    {showList && (
                      <div className='container-fluid border bg-white syllabus-container' style={{ maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>
                        <div className='row mt-2'>
                          {/* <div className='col p-2 bg-light'>
                            <button className="btn btn-link" onClick={toggleSyllabus}>
                              <i className="fas fa-angle-down"></i>
                            </button>
                          </div> */}
                          {syllabusContent.map(content => (
                            <div className='row' key={content.id}>
                              <div className='col p-2'>
                                <button
                                  type="button"
                                  className="btn btn-white text-left"
                                  id={content.id}
                                  onClick={() => ShowTutorial(content.data.data)}
                                  style={{ padding: 0 }}
                                >
                                  {content.data.name}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='col-sm-7'
                style={{ maxHeight: '100vh', overflowY: 'auto' }}
              >
                {showContent && tutorialData && (
                  <>
                    <h2 className='mt-4 text-center'><b>Notes</b></h2>
                  <div className="container mt-4" style={{ textAlign: 'left', wordWrap: 'break-word', overflowX: 'hidden' }}>
                    <ReactMarkdown
                      components={{
                        img: ({ node, ...props }) => <img {...props} style={{ maxWidth: '100%', height: 'auto' }} />
                      }}
                    >
                      {tutorialData}
                    </ReactMarkdown>
                  </div>
                  </>
                )}
              </div>
            </>
          }
        </div>
      </div >
    </>
  )
}
