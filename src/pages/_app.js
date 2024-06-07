import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import '../../css/LoginStyle.css';
import { LoginAuthProvider } from '@/context/LoginAuthProvider';
import Sidebar from './Sidebar';
import Login from './Login';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loader = document.getElementById('globalLoader');
      if (loader)
        loader.remove();
    }
  }, []);
  return (
    <LoginAuthProvider>
            <Component {...pageProps} />
    </LoginAuthProvider>
  )
}