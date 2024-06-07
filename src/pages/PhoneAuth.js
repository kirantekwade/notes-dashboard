import React, { useState } from 'react';
 import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase-config';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

 const PhoneSignIn = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [message, setMessage] = useState('');
    
    const setUpRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                onSignInSubmit();
            }
        }, auth);
    };
    const onSignInSubmit = (e) => {
        e.preventDefault();
        setUpRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                setVerificationId(confirmationResult.verificationId);
                setMessage('OTP has been sent!');
              })
              .catch((error) => {
                  console.error('Error during signInWithPhoneNumber:', error);
                  setMessage('Error sending OTP');
              });
      };
      const onSubmitOtp = (e) => {
          e.preventDefault();
          const credential = PhoneAuthProvider.credential(verificationId, otp);
          signInWithCredential(auth, credential)
              .then((result) => {
                  setMessage('Phone number verified and user signed in');
                  window.location.replace(`/Dashboard`);
              })
              .catch((error) => {
                  console.error('Error during signInWithCredential:', error);
                  setMessage('Error verifying OTP');
              });
      };
      return (
          <div>
              <h2>Phone Sign-In</h2>
              <form onSubmit={onSignInSubmit}>
                  <div className="form-group">
                      <label>Phone Number</label>
                      <input
                          type="tel"
                          className="form-control"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+1 555-555-5555"
                          required
                      />
                  </div>
                  <div id="recaptcha-container"></div>
                  <button type="submit" className="btn btn-primary">Send OTP</button>
              </form>
              {verificationId && (
                  <form onSubmit={onSubmitOtp}>
                      <div className="form-group">
                          <label>OTP</label>
                          <input
                              type="text"
                              className="form-control"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter OTP"
                              required
                          />
                      </div>
                      <button type="submit" className="btn btn-primary">Verify OTP</button>
                  </form>
              )}
              {message && <p>{message}</p>}
          </div>
      );
   };

   export default PhoneSignIn;