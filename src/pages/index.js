"use client"
import React from 'react'
import Login from './Login'
import 'bootstrap/dist/css/bootstrap.css';
import { LoginAuthProvider } from '@/context/LoginAuthProvider';
import Head from 'next/head';

export default function index({ Component, pageProps }) {
  <Head>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
    </Head>
  return (
    <>
    {/* <LoginAuthProvider> */}
    <Login/>
    {/* <Component {...pageProps} /> */}
    {/* </LoginAuthProvider> */}
    </>
  )
}
