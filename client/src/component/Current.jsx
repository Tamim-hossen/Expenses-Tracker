import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import backicon from '../assets/back.png'
import logoutbtn from '../assets/logout.png'

function Current() {
  const [DBname,setDBname] =useState('');
  const [loggedIn,setLoggedIn] = useState(false)
  useEffect(()=>{
    axios.get('/api/login')
    .then((res)=>{
      setDBname(res.data.user)
      setLoggedIn(res.data.loggedIn)
      
    })
  },[])
  function handleLogout(){
    axios.get('/api/logout')
    .then((res)=>{
      if(res.status===200){
        setLoggedIn(false)
        nav('/')
      }
    })
  }

  if(!loggedIn){
    return(
      <div className='container-fluid vh-90 vw-90 align-items center'>
        <h2 className='text-center mt-5'>Please Log In First</h2>
        <div className='d-flex justify-content-center mt-3'>
          <Link to='/' className='btn btn-info' style={{color:'white'}}>Log in</Link>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div id='top' className='d-flex justify-content-between'>
              <Link to={'/home'} className='btn mt-1'style={{
                backgroundImage : `url(${backicon})`,
                backgroundSize:'cover',
                backgroundRepeat:'no-repeat',
                backgroundPosition:'center',
                width:'30px',
                height: '30px',
                    }}/>
                  <h2>Balance History</h2>
                   <button    className='mt-1'
                  style={{backgroundImage:`url(${logoutbtn})`,
                  backgroundSize: 'contain',
                  backgroundPosition:'center',
                  backgroundColor: 'transparent',
                  backgroundRepeat:'no-repeat',
                  border:'none',
                  width: '35px',
                  height: '30px',
                  opacity:'.9'}}
                  onClick={handleLogout}/>
            </div>
            <div></div>
    </div>
  )
}

export default Current