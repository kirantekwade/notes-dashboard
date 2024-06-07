import React, { useState } from 'react'
import Loading from './Loading';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase-config';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
    mobile: ""
  })
  const [verificationId, setVerificationId] = useState('');
  const [showDefaultButton, setDefaultButton] = useState(true);
  const [showOTPField, setShowOTPField] = useState(false);
  const [showResetPassword, setResetPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(previousState => ({
      ...previousState,
      [name]: value
    }))
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

  const Login = (e) => {
    e.preventDefault();
    window.location.replace(`/`);
  }

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
        setShowOTPField(true);
        setDefaultButton(false);
        setUpRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, "+91" + formData.mobile, appVerifier)
          .then((confirmationResult) => {
            setVerificationId(confirmationResult.verificationId);
            alert('OTP has been sent!');
          })
          .catch((error) => {
            console.error('Error during signInWithPhoneNumber:', error);
            alert('Error sending OTP');
          });
      }
      else{
        alert('Please enter registered Mobile Number');
        setFormData({
          ...formData,
          mobile: "",
      });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error while inserting session');
    }
  }

  const VerifyOTP = (e) => {
    e.preventDefault();
    setShowOTPField(false);
    setDefaultButton(false);
    const credential = PhoneAuthProvider.credential(verificationId, formData.otp);
    signInWithCredential(auth, credential)
      .then((result) => {
        alert('Phone number verified and user signed in');
        setResetPassword(true);
        // window.location.replace(`/Dashboard`);
      })
      .catch((error) => {
        console.error('Error during signInWithCredential:', error);
        alert('Error verifying OTP');
      });
  }
  const ResetPasswordFn = async (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      const jsonString = { password: formData.password }
      try {
        const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/resetPassword/'+formData.mobile, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonString)
        });
        console.log(response);
        if (response.ok) {
          setResetPassword(false);
          alert('Password Reset successfully');
          window.location.replace(`/`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error while resetting password');
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
              <div className="bg-white p-4 p-md-5 rounded shadow-sm">
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
                    <h3 className='text-center '><b>Reset Password</b></h3>
                  </div>
                </div>
                <form action="#!">
                  <div className="row gy-3 gy-md-4 overflow-hidden">
                    <div className="col-12">
                      <label htmlFor="mobile" className="form-label">
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
                        <label htmlFor="password" className="form-label">
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
                    <div className="col-12">
                      <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center">
                        {showDefaultButton &&
                          <>
                            <button type="submit" className="btn btn-primary btn-lg" onClick={GenerateOTP}>
                              Generate OTP
                            </button>
                          </>
                        }
                        {showOTPField &&
                          <>
                            {/* <div id="recaptcha-container"></div> */}
                            <button type="submit" className="btn btn-primary btn-lg" onClick={VerifyOTP}>
                              Verify OTP
                            </button>
                          </>
                        }
                        {showResetPassword &&
                          <button type="submit" className="btn btn-primary btn-lg" onClick={ResetPasswordFn}>
                            Reset Password
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
        </div>
        </div>
      </div>
    </>
  )
}
