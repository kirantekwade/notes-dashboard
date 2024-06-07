import React, { useContext, useEffect } from 'react'
import Sidebar from './Sidebar'
import 'bootstrap/dist/css/bootstrap.css';
import LoginAuthContext from '@/context/LoginAuthProvider';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Logout() {
  const [showModal, setShowModal] = React.useState(true);
  const { isAuthenticated } = useContext(LoginAuthContext);
  const auth = useContext(LoginAuthContext);

  useEffect(() => {
    const token = Cookies.get('token')
    const email = Cookies.get('emailId')
    auth.setDetails(email,token);
    auth.Authentication();  
  })
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const Logout = (e) => {
    window.location.replace(`/`);
  }

  // const home = () => {
  //   router.push(`/`);
  // }

  // if (typeof window !== 'undefined' && !isAuthenticated) {
  //   home();
  //   return null; 
  // }

  return (
    <div className="container-fluid">
          <div className="row">
            <div className='col-sm-2 bg-light'>
              <Sidebar />
            </div>
            <div className='col-sm-10' style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          {/* <button className="btn btn-primary" onClick={handleShow}>
            Launch demo modal
          </button> */}

          <div className={showModal ? "modal show" : "modal"} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Logout</h5>
                  {/* <button type="button" className="close" onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                  </button> */}
                </div>
                <div className="modal-body">
                  If you want to logout from application, click Logout button 
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={Logout}>Logout</button>
                </div>
              </div>
            </div>
          </div>
          {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
      </div>
    </div>
  );
}
