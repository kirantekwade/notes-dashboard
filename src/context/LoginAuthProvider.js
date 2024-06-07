import Login from '@/pages/Login';
import React, { createContext, useEffect, useState } from 'react'

const LoginAuthContext = createContext();

export function LoginAuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [tokenID, setToken] = useState("");
    const [userIP, setUserIP] = useState("");

    const getData = async () => {
      const res = await fetch("https://api.ipify.org/?format=json");
      const users = await res.json();
      setUserIP(users.ip);
    };
    useEffect(() => {
      getData();
    }, []);

    const AddToken = (token) => {
      setToken(token);
    }

    const setDetails = (emailid, token) => {
      console.log('in',emailid, token);
      setEmail(emailid);
      setToken(token);
    }

    const Authentication = async(emailid, token) => {
      setEmail(emailid);
      setToken(token);
      getData();
      //console.log(tokenID, userIP);
      const jsonString = {token:token, ip: userIP}
      try {
        const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/authentication', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonString)      
        });
        console.log(response);

        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error while authenticating');
      }
    }
   
    const login = () => {
      setIsAuthenticated(true);
    }

    const logout = () => setIsAuthenticated(false);

  return (
    <LoginAuthContext.Provider value={{isAuthenticated, logout, login, setDetails, AddToken, email, tokenID, Authentication }}>
        {children}
    </LoginAuthContext.Provider>
  )
}

export default LoginAuthContext;