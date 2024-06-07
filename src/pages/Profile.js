import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import LoginAuthContext from '@/context/LoginAuthProvider';
import Login from './Login';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebase-config';
import Loading from './Loading';

export default function Profile() {
  const auth = useContext(LoginAuthContext);
  const [profileData, setProfileData] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  let regex = new RegExp(/[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/);
  const [isUpdateClicked, setIsUpdateClicked] = useState(false);
  // const [formData, setFormData] = useState({
  //   name: profileData.name,
  //   address: profileData.address,
  //   email: profileData.email
  // })

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProfileData(previousState => ({
      ...previousState,
      [name]: value
    }))
  }

  useEffect(() => {
    const token = Cookies.get('token')
    const email = Cookies.get('emailId')
    console.log(token, email)
    auth.setDetails(email, token);
    auth.Authentication();
    const fetchData = async () => {
      try {
        const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/getStudentDetails/' + email);
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchData();
  }, [])

  const { isAuthenticated } = useContext(LoginAuthContext);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  const editProfile = (e) => {
    e.preventDefault();
    setIsUpdateClicked(true);
  }

  const updateProfile = async(e) => {
    e.preventDefault();   
    const jsonString = {name : profileData.name, address: profileData.address, email: profileData.email}
    try {
      const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/updateProfile/'+profileData.mobile, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonString)
      });
      console.log(response);
      if (response.ok) {
        setIsUpdateClicked(false);
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error while updating profile');
    }
  }

  const handleUpload = () => {
    console.log(image);
    if (!image) {
      alert("Please select Image first");
      return;
    }

    if (image.size > 1 * 300 * 1024) {
      alert("Please select Image size less than 300 kb");
      return;
    }

    if (regex.test(image.name) == false) {
      alert("Please select Image in proper format (.png/.jpg/.jpeg)");
      return;
    }

    setLoading(true);
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("uploadTask, snapshot");
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          setUrl(downloadURL);
          profileData.profileImage = downloadURL;
          console.log(downloadURL);
          setLoading(false);
          try {
            const jsonString = {profileImage : downloadURL}
            const response = await fetch('https://us-central1-kiran-projects-6099c.cloudfunctions.net/kiranProjects/updateProfileImage/'+profileData.mobile, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(jsonString)
            });
            console.log(response);
            if (response.ok) {
              alert("Image Upload successfully");
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Error while updating profile Image');
          }         
        });
      }
    );
  }

  return (
    <>
      {/* {isAuthenticated && */}
      <div className="container-fluid">
        <div className="row">
          <div className='col-sm-2 bg-light'>
            <Sidebar />
          </div>
          <div className='col-sm-10' style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            <div className="container mt-5">
              <div className="main-body">
                <div className="row gutters-sm">
                  <div className="col-md-4 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                          {!profileData.profileImage &&
                            <img
                              src="https://bootdey.com/img/Content/avatar/avatar7.png"
                              alt="Admin"
                              className="rounded-circle"
                              width={150}
                            />}
                          {profileData.profileImage && <img
                            src={profileData.profileImage}
                            alt="Admin"
                            className="rounded-circle"
                            width={150}
                          />}
                          <div className='col-6 align-self-center'>
                            <input type="file" className="form-control mt-3" id="file" name="file" onChange={handleChange} />
                          </div>
                          <button className='btn btn-primary mt-2' onClick={handleUpload}>Upload Image</button>
                          {loading && <Loading />}
                          <div className="mt-3">
                            <h4>{profileData.name}</h4>
                            <p className="text-secondary mb-1">{profileData.role}</p>
                            {/* <p className="text-muted font-size-sm">
                                Bay Area, San Francisco, CA
                              </p> */}
                            {/* <button className="btn btn-primary">Follow</button>
                          <button className="btn btn-outline-primary">Message</button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Full Name</h6>
                          </div>
                          {!isUpdateClicked &&
                            <div className="col-sm-9 text-secondary">{profileData.name}</div>}
                          {isUpdateClicked &&
                            <div className="col-sm-9 text-secondary">
                              <input type="text" className="form-control" id="name" name="name" value={profileData.name} onChange={handleFieldChange}></input></div>}
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Email</h6>
                          </div>
                          {!isUpdateClicked &&
                            <div className="col-sm-9 text-secondary">{profileData.email}</div>}
                          {isUpdateClicked &&
                            <div className="col-sm-9 text-secondary">
                              <input type="email" className="form-control" id="email" name="email" value={profileData.email} onChange={handleFieldChange}></input></div>}      
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Mobile</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">{profileData.mobile}</div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Status</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">{profileData.status}</div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Address</h6>
                          </div>
                          {!isUpdateClicked &&
                            <div className="col-sm-9 text-secondary">{profileData.address}</div>}
                          {isUpdateClicked &&
                            <div className="col-sm-9 text-secondary">
                              <input type="text" className="form-control" id="address" name="address" value={profileData.address} onChange={handleFieldChange}></input></div>}                          
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-3">
                      </div>
                      <div className="col-sm-3">
                        {!isUpdateClicked && 
                        <button className='btn btn-primary mt-2' onClick={editProfile}>Edit Profile</button>}
                      {isUpdateClicked && 
                        <button className='btn btn-primary mt-2' onClick={updateProfile}>Update Profile</button>}
                      </div>
                      <div className="col-sm-3">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* } */}
    </>
  )
}
