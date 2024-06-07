import React, { useContext, useState } from 'react'
import '../../css/LoginStyle.css'
import Loading from './Loading';
import LoginAuthContext from '../context/LoginAuthProvider';
import jsConfig from '../../jsconfig.json'
import backgroudImg from '../../assets/images/background-Image.jpg';
import Cookies from 'js-cookie';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  //const auth = useContext(LoginAuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(previousState => ({
      ...previousState,
      [name]: value
    }))
  }

  const Register = (e) => {
    e.preventDefault();
    window.location.replace(`/Register`);
  }

  const ResetPassword = (e) => {
    e.preventDefault();
    window.location.replace(`/ResetPassword`);
  }

  const Login = async (e) => {
    setLoading(true);
    e.preventDefault();
        try {
            const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/studentLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)                       
            });

            console.log(response);

            if (response.ok) {
                const res = await fetch("https://api.ipify.org/?format=json");
                const users = await res.json();

                const token = btoa(jsConfig.App_Secret_Key +','+ formData.email +','+formData.password +','+ new Date());

                const jsonString = { email: formData.email, token: token, ip: users.ip }
                console.log(jsonString)
                try {
                    const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/insertLoginSession', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(jsonString)
                    });
                    console.log(response);
                    if (response.ok) {
                        console.log("login",formData.email, token);
                        document.cookie = `token=${token}; Max-Age=7200; path=/`
                        document.cookie = `emailId=${formData.email}; Max-Age=7200; path=/`
                        //auth.setDetails(formData.email, token);
                        window.location.replace(`/Dashboard`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error while inserting session');
                }
            } else {
              setLoading(false);
                setFormData({
                    ...formData,
                    email: "",
                    password: ""
                });
                alert('Email or Password is incorrect');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error while authenticating');
        }
    }

  return (
    <>
    <div className='background'>
      <div className="py-3 py-md-5">
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
                    <h3 className='text-center '><b>LOGIN</b></h3>
                  </div>
                </div>
                <form action="#!">
                  <div className="row gy-3 gy-md-4 overflow-hidden">
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
                          placeholder="Enter email"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="password" className="form-label">
                        Password <span className="text-danger">*</span>
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
                    <br />
                    <div className="col-12">
                      <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center">
                        <button type="submit" className="btn btn-primary btn-lg" onClick={Login}>
                          Login With Email
                        </button>
                      </div>
                    </div>                   
                  </div>
                </form>
                <div className="row">
                  <div className="col-12">
                    <hr className="mt-3 mb-4 border-secondary-subtle" />
                    <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center">
                      <button type="submit" className="btn btn-outline-primary" onClick={Register}>
                        Create new account
                      </button>
                      <button type="submit" className="btn btn-outline-primary" onClick={ResetPassword}>
                        Forgot password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
