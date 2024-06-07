import React, { useState } from 'react'
import Loading from './Loading';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase-config';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    otp: "",
  })

  const [verificationId, setVerificationId] = useState('');
  const [showDefaultButton, setDefaultButton] = useState(true);
  const [showOTPField, setShowOTPField] = useState(false);
  const [showResetPassword, setResetPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(previousState => ({
      ...previousState,
      [name]: value
    }))
  }

  const onReset = () => {
    setFormData({
      ...formData,
      name: "",
      password: "",
      email: "",
      mobile: "",
      confirmPassword: "",
      otp: "",
    });
  }

  const handleClose = () => setShowModal(false);
  //const handleShow = () => setShowModal(true);

  const Login = (e) => {
    e.preventDefault();
    window.location.replace(`/`);
  }

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
      }
    }, auth);
  };

  const GenerateOTP = async (e) => {
    e.preventDefault();
    const jsonString = { mobile: formData.mobile }
    try {
      const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/verifyMobileNumber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonString)
      });
      console.log(response);
      if (response.ok) {
        setShowOTPField(false);
        setShowModal(true);
        setModalContent('Entered Mobile Number is registered with other account');
        // alert('Entered Mobile Number is registered with other account');
        setFormData({
          ...formData,
          mobile: "",
        });
      }
      else {
        setDefaultButton(false);
        setUpRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, "+91" + formData.mobile, appVerifier)
          .then((confirmationResult) => {
            setVerificationId(confirmationResult.verificationId);
            setShowModal(true);
            setModalContent('OTP has been sent to user entered Mobile Number');
            //alert('OTP has been sent!');
            setShowOTPField(true);
          })
          .catch((error) => {
            console.error('Error during signInWithPhoneNumber:', error);
            setShowModal(true);
            setModalContent('Error sending OTP. Please try again later');
            //alert('Error sending OTP');
          });
      }
    } catch (error) {
      console.error('Error:', error);
      setShowModal(true);
      setModalContent('Error sending OTP. Please try again later');
      //alert('Error sending OTP');
    }
  }

  // const GenerateOTP = async (e) => {
  //   e.preventDefault();
  //   const jsonString = { mobile: formData.mobile }
  //   try {
  //     const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/verifyMobileNumber', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(jsonString)
  //     });
  //     console.log(response);
  //     if (response.ok) {
  //       console.log("In side if")
  //       setShowOTPField(false);
  //       console.error('Error:', error);
  //       alert('Error while inserting session');
  //       onReset();
  //     }
  //     else {
  //       console.log("In side else")
  //       setShowOTPField(true);
  //       setDefaultButton(false);
  //       setUpRecaptcha();
  //       const appVerifier = window.recaptchaVerifier;
  //       signInWithPhoneNumber(auth, "+91" + formData.mobile, appVerifier)
  //         .then((confirmationResult) => {
  //           setVerificationId(confirmationResult.verificationId);
  //           alert('OTP has been sent!');
  //         })
  //         .catch((error) => {
  //           console.error('Error during signInWithPhoneNumber:', error);
  //           alert('Error sending OTP');
  //         });
  //     }
  //   } catch (error) {
  //     console.log("In side else")
  //     console.error('Error during signInWithPhoneNumber:', error);
  //     alert('Error sending OTP');
  //   }
  // }

  const VerifyOTP = (e) => {
    e.preventDefault();
    setShowOTPField(false);
    setDefaultButton(false);
    const credential = PhoneAuthProvider.credential(verificationId, formData.otp);
    signInWithCredential(auth, credential)
      .then((result) => {
        setShowModal(true);
        setModalContent('Mobile Number verified successfully');
        //alert('Phone number verified and user signed in');
        setResetPassword(true);
        // window.location.replace(`/Dashboard`);
      })
      .catch((error) => {
        console.error('Error during signInWithCredential:', error);
        setShowModal(true);
        setModalContent('Error occurred while verifying OTP');
        //alert('Error verifying OTP');
      });
  }

  const RegisterStudent = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (formData.password === formData.confirmPassword) {
      try {
        const jsonString = { mobile: formData.mobile }
        const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/verifyMobileNumber', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonString)
        });
        console.log(response);
        if (response.status == 404) {
          const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/registerStudent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
          console.log(response);

          if (response.ok) {
            setShowModal(true);
            setModalContent('Student added successfully!');
            //alert('Student added successfully!');
            window.location.replace(`/`);
          } else if (response.status == 400) {
            setShowModal(true);
            setModalContent("Email " + formData.email + " is already exists");
            //alert("Email " + formData.email + " is already exists")
          }
          else {
            throw new Error("Error");
          }
          onReset();
        }
        else {
          setShowModal(true);
          setModalContent("Mobile " + formData.mobile + " is already registered with other Email");
          //alert("Mobile " + formData.mobile + " is already registered with other Email");
          setFormData({
            ...formData,
            password: "",
            mobile: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setShowModal(true);
        setModalContent("Error while adding student details");
        //alert('Error adding User');
      }

    }
    else {
      alert('password and confirm password not matched');
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    }

  }
  return (
    <>
      <div className='background'>
        <div className="py-2 py-md-3">
          <div className="container">
            {loading && <Loading />}
            <div className="row justify-content-md-center">
              <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                <div className="bg-white p-3 px-md-5 rounded shadow-sm">
                  <div className="row">
                    <div className="col-12">
                      <div className="text-center mb-2">
                        <a href="#!">
                          <img
                            src="https://cdn.dribbble.com/userupload/12266870/file/original-4a0a5d257dd8b23ac311c47b5e4869a6.jpg?resize=400x300&vertical=center"
                            alt="BootstrapBrain Logo"
                            width={175}
                          />
                        </a>
                      </div>
                      <h3 className='text-center '><b>Register New Account</b></h3>
                    </div>
                  </div>
                  <form action="#!">
                    <div className="row gy-2 gy-md-3 overflow-hidden">
                      <div className="col-12">
                        <label htmlFor="name" className="form-label">
                          Name <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={16}
                              height={16}
                              fill="currentColor"
                              className="bi bi-envelope"
                              viewBox="0 0 16 16"
                            >
                              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            id="name"
                            required=""
                            value={formData.name}
                            placeholder="Enter Full Name"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={16}
                              height={16}
                              fill="currentColor"
                              className="bi bi-envelope"
                              viewBox="0 0 16 16"
                            >
                              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                            </svg>
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            required=""
                            value={formData.email}
                            placeholder="Enter Email"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">
                          Mobile Number <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={16}
                              height={16}
                              fill="currentColor"><path d="M16 64C16 28.7 44.7 0 80 0H304c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V64zM224 448a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM304 64H80V384H304V64z" /></svg>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="mobile"
                            id="mobile"
                            required=""
                            value={formData.mobile}
                            placeholder="Enter Mobile Number"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {showOTPField &&
                        <div className="col-12">
                          <label htmlFor="otp" className="form-label">
                            Enter OTP <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">

                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={16}
                                height={16}
                                fill="currentColor"><path d="M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H144V144z" /></svg>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              name="otp"
                              id="otp"
                              required=""
                              value={formData.otp}
                              placeholder="Enter OTP"
                              onChange={handleChange}
                            />
                            {/* <div id="recaptcha-container"></div> */}
                          </div>
                        </div>}
                      {showResetPassword && <>
                        <div className="col-12">
                          <label htmlFor="password" className="form-label">
                            Set Password <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                className="bi bi-key"
                                viewBox="0 0 16 16"
                              >
                                <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                                <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                              </svg>
                            </span>
                            <input
                              type="password"
                              className="form-control"
                              name="password"
                              id="password"
                              defaultValue=""
                              required=""
                              value={formData.password}
                              placeholder="Enter Password"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="confirmpassword" className="form-label">
                            Confirm Password <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                className="bi bi-key"
                                viewBox="0 0 16 16"
                              >
                                <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                                <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                              </svg>
                            </span>
                            <input
                              type="password"
                              className="form-control"
                              name="confirmPassword"
                              id="confirmPassword"
                              defaultValue=""
                              required=""
                              value={formData.confirmPassword}
                              placeholder="Re-enter Password"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>}
                      <br />
                      <div className="col-12">
                        <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center">
                          {showDefaultButton && <>
                            <button type="submit" className="btn btn-primary btn-lg" data-toggle="modal"
                              data-target="#exampleModalCenter" onClick={GenerateOTP}>
                              Generate OTP
                            </button>

                            <div
                              className="modal fade"
                              id="exampleModalCenter"
                              tabIndex={-1}
                              role="dialog"
                              aria-labelledby="exampleModalCenterTitle"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle">
                                      Modal title
                                    </h5>
                                    <button
                                      type="button"
                                      className="close"
                                      data-dismiss="modal"
                                      aria-label="Close"
                                    >
                                      <span aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                  <div className="modal-body"> some text </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      data-dismiss="modal"
                                    >
                                      Close
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                      Save changes
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </>
                          }
                          {showOTPField &&
                            <button type="submit" className="btn btn-primary btn-lg" onClick={VerifyOTP}>
                              Verify OTP
                            </button>
                          }
                          {showResetPassword &&
                            <button type="submit" className="btn btn-primary btn-lg" onClick={RegisterStudent}>
                              Create new account
                            </button>}
                          <div id="recaptcha-container"></div>
                          <button type="submit" className="btn btn-primary btn-lg" onClick={Login}>
                            Log-In
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className={showModal ? "modal show" : "modal"} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Message</h5>
                </div>
                <div className="modal-body">
                  {modalContent}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                </div>
              </div>
            </div>
          </div>
          {showModal && <div className="modal-backdrop fade show"></div>}
          </div>
        </div>
      </div>
    </>
  )
}
