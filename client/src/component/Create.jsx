import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate,Link } from 'react-router-dom'
import backicon from '../assets/back.png'
import logoutbtn from '../assets/logout.png'
import './Settings.css'


function Settings() {
  const [loggedIn,setLoggedIn] = useState(false)
  const nav = useNavigate();
  const [data,setData] =useState({
    Name:'',
    Username:'',
    Email:'',
    Password:'',
    dbname:'',
    confirmPassword: ''
  })
  const [DBname,setDBname] =useState('');
  const [editName,setEditName] = useState(false)
  const [editUsername,setEditUsername] = useState(false)
  const [editEmail,setEditEmail] = useState(false)
  const [editPassword,setEditPassword] = useState(false)
  const [originData,setOriginData] = useState()
  const [prevData,setPrevData] = useState()
  const [updated,setUpdated] = useState(false)
  const [passwords,setPassword] = useState({
    password:'',confirmPassword:''
  })
  const[match,setMatch]=useState(true)
  useEffect(()=>{
    axios.get('/api/login')
    .then((res)=>{
      setDBname(res.data.user)
      setLoggedIn(res.data.loggedIn)
      
    })
  },[])

  useEffect(()=>{
    axios.get(`/api/user_data/${DBname}`)
    .then((res)=>{
      console.log(res.data)
      setData({...data,Name:res.data.Name,Username:res.data.Username,Email:res.data.Email,dbname:res.data.dbname})
      setPrevData(res.data)
      setOriginData(res.data)
    }).catch((err)=>{
      console.log(err.response)
    })
  },[DBname])
  function handleLogout(){
    axios.get('/api/logout')
    .then((res)=>{
      if(res.status===200){
        setLoggedIn(false)
        nav('/')
      }
    })
  }
 function updateUser(){
  console.log(data)
    axios.post('/api/update_user',data)
    .then((res)=>{
      if(res.status===200){
        window.alert('User data Updated')
        console.log('success')
        setOriginData(data)
        setUpdated(false)
      }
    }).catch((err)=>{
      if(err.response){
        if(err.response.status === 401){
          window.alert('wrong Password')
        }
        else{
          console.log(err.response)
          setData(originData)
        }
        
        
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
    <div className='container-fluid vw-90 vh-90 align-items center'>
      <div id='top' className='d-flex justify-content-between'>
        <Link to={'/home'} className='btn mt-1'style={{
          backgroundImage : `url(${backicon})`,
          backgroundSize:'cover',
          backgroundRepeat:'no-repeat',
          backgroundPosition:'center',
          width:'30px',
          height: '30px',
              }}/>
            <h2>Settings</h2>
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
      <div id='main'>
        <div className='d-flex justify-content-center'>
          
            
            {data?<ul className='list-group list-unstyled' style={{width:'50%'}}> <li className='card p-3 mb-3' style={{height:'70px'}}>
              <div>
                {editName?
                <div className='d-flex justify-content-between'>
                  <label htmlFor='name'style={{width:'16%',marginTop:'5px',whiteSpace:'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}}><small>Name:</small> </label>
                  <div style={{width:'45%'}}>
                  <input
                  type='text'
                  id='name'
                  className='form-control'
                  value={data.Name}
                  onChange={(e)=>{
                    setData({...data,Name:e.target.value})
                  }}/>
                  </div>
                  <div style={{width:'30%',whiteSpace:'nowrap',overflowWrap:'hidden'}}className='d-flex justify-content-between'>
                  <button id='savebtn' 
                  onClick={()=>{
                    if(originData.Name!==data.Name || originData.Username!== data.Username || originData.Email!==data.Email){
                      setUpdated(true)
                    }
                    else if(originData.Name===data.Name || originData.Username=== data.Username || originData.Email===data.Email){
                      setUpdated(false)
                    }
                    setPrevData({...prevData,Name:data.Name})
                    setEditName(false)
                  }}>Save</button>
                  <button id='cancelbtn' 
                  onClick={()=>{
                    setData({...data,Name:prevData.Name});
                    setEditName(false)
                  }}>Cancel</button>
                  </div>
                  </div>:<div className='d-flex justify-content-between'>
                  <label style={{width:'15%',marginTop:'5px',whiteSpace:'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}} > <small>Name:</small> </label>
                  <div style={{width:'45%'}}>
                  <h6 style={{marginTop:'8px',whiteSpace:'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}}>{data.Name}</h6>
                  </div>
                  <div className='d-flex justify-content-end'style={{width:'30%'}}>
                  <button id='editbtn'
                  onClick={()=>{
                    setData({...data,Username:prevData.Username,Email:prevData.Email});
                    setEditUsername(false)
                    setEditEmail(false)
                    setEditName(true)
                  }}>Edit</button></div>
                  </div>}
                </div>
                </li>
                <li className='card p-3 mb-3' style={{height:'70px'}}>
              <div>
                {editUsername?
                <div className='d-flex justify-content-between'>
                  <label htmlFor='username'style={{width:'16%',marginTop:'5px',whiteSpace:'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}}><small>Username:</small> </label>
                  <div style={{width:'45%'}}>
                  <input
                  type='text'
                  id='username'
                  className='form-control'
                  value={data.Username}
                  onChange={(e)=>{
                    setData({...data,Username:e.target.value})
                  }}/>
                  </div>
                  <div style={{width:'30%',whiteSpace:'nowrap',overflowWrap:'hidden'}}className='d-flex justify-content-between'>
                  <button id='savebtn' 
                  onClick={()=>{
                    if(originData.Name!==data.Name || originData.Username!== data.Username || originData.Email!==data.Email){
                      setUpdated(true)
                    }
                    else if(originData.Name===data.Name || originData.Username=== data.Username || originData.Email===data.Email){
                      setUpdated(false)
                    }
                    setPrevData({...prevData,Username:data.Username})
                    setEditUsername(false)
                  }}>Save</button>
                  <button id='cancelbtn' 
                  onClick={()=>{
                    setData({...data,Username:prevData.Username});
                    setEditUsername(false)
                  }}>Cancel</button>
                  </div>
                  </div>:<div className='d-flex justify-content-between'>
                  <label style={{width:'15%',marginTop:'5px',whiteSpace:'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}} > <small>Username:</small> </label>
                  <div style={{width:'45%'}}>
                  <h6 style={{marginTop:'8px',whiteSpace:'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}}>{data.Username}</h6>
                  </div>
                  <div className='d-flex justify-content-end'style={{width:'30%'}}>
                  <button id='editbtn'
                  onClick={()=>{
                    setData({...data,Name:prevData.Name,Email:prevData.Email});
                    setEditName(false)
                    setEditEmail(false)
                    setEditUsername(true)
                  }}>Edit</button></div>
                  </div>}
                </div>
                </li>
                <li className='card p-3 mb-3' style={{height:'70px'}}>
              <div>
                {editEmail?
                <div className='d-flex justify-content-between'>
                  <label htmlFor='Email'style={{width:'16%',marginTop:'5px',whiteSpace:'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}}><small>Email:</small> </label>
                  <div style={{width:'45%'}}>
                  <input
                  type='text'
                  id='Email'
                  className='form-control'
                  value={data.Email}
                  onChange={(e)=>{
                    setData({...data,Email:e.target.value})
                  }}/>
                  </div>
                  <div style={{width:'30%',whiteSpace:'nowrap',overflowWrap:'hidden'}}className='d-flex justify-content-between'>
                  <button id='savebtn' 
                  onClick={()=>{
                    if(originData.Name!==data.Name || originData.Username!== data.Username || originData.Email!==data.Email){
                      setUpdated(true)
                    }
                    else if(originData.Name===data.Name || originData.Username=== data.Username || originData.Email===data.Email){
                      setUpdated(false)
                    }
                    setPrevData({...prevData,Email:data.Email})
                    setEditEmail(false)
                  }}>Save</button>
                  <button id='cancelbtn' 
                  onClick={()=>{
                    setData({...data,Email:prevData.Email});
                    setEditEmail(false)
                  }}>Cancel</button>
                  </div>
                  </div>:<div className='d-flex justify-content-between'>
                  <label style={{width:'15%',marginTop:'5px',whiteSpace:'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}} > <small>Email:</small> </label>
                  <div style={{width:'45%'}}>
                  <h6 style={{marginTop:'8px',whiteSpace:'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}}>{data.Email}</h6>
                  </div>
                  <div className='d-flex justify-content-end'style={{width:'30%'}}>
                  <button id='editbtn'
                  onClick={()=>{
                    setData({...data,Name:prevData.Name,Username:prevData.Username});
                    setEditUsername(false)
                    setEditName(false)
                    setEditEmail(true)
                  }}>Edit</button></div>
                  </div>}
                </div>
                </li>
                <li className='card p-4 mb-3'>
                  {editPassword?<div className=' d-flex justify-content-between'>
                    <label style={{width:'10%',marginTop:'5%',whiteSpace:'nowrap',overflow:'hidden',textOverflow: 'ellipsis'}}><small>Password:</small></label>
                    <div style={{width:'45%'}}>
                      <input 
                      type='text'
                      placeholder='Enter new password'
                      className='form-control'
                      value={passwords.password}
                      style={match?{}:{border:'1px solid tomato'}}
                      onChange={(e)=>{
                        setPassword({...passwords,password:e.target.value})
                        setMatch(true)
                      }}/><br/>
                      <input 
                      type='text'
                      placeholder='Confirm new Password'
                      className='form-control'
                      style={match?{}:{border:'1px solid tomato'}}
                      onChange={(e)=>{
                        setPassword({...passwords,confirmPassword:e.target.value})
                        setMatch(true)
                      }}/>
                      <span className='text-danger'style={match?{visibility:'hidden',whiteSpace:'nowrap',overflow:'hidden',textOverflow: 'ellipsis'}:{visibility:'visible',whiteSpace:'nowrap',overflow:'hidden',textOverflow: 'ellipsis'}}>*Passwords do not match</span>
                    </div>
                    <div>
                    <button id='savebtn'
                     style={{marginBottom:'30px',width:'100%'}} 
                    onClick={()=>{
                      if(passwords.password===passwords.confirmPassword){
                        if(passwords.password !== ''){
                          setData({...data,Password:passwords.password})
                          setUpdated(true)
                        }
                        else if(passwords.password === ''){
                          setEditPassword(false)
                        }
                      }
                      else if(passwords.password!==passwords.confirmPassword){
                        setMatch(false)
                      }
                    }}
                    >save</button><br/>
                    <button id='cancelbtn' onClick={()=>{
                      setEditPassword(false)
                      setMatch(true)
                      setPassword({...passwords,password: '',confirmPassword:''})
                    }}>Cancel</button>
                    </div>
                  </div>:<div className=' d-flex justify-content-center'>
                  
                  <button id='editbtn' onClick={()=>{
                    setEditPassword(true)
                  }}>Edit Password</button>
                    </div>}
                  
                </li>
                <li className={updated? 'card p-4' : ''}>
                    {updated?<div className='d-flex justify-content-between'>

                      <label style={{width:'20%',marginTop:'5px',whiteSpace:'nowrap',overflow:'hidden',textOverflow: 'ellipsis'}}><small>Password:</small></label>
                      <input type='password' className='form-control'
                      style={{width:'45%',whiteSpace:'nowrap',overflow:'hidden',textOverflow: 'ellipsis'}}
                      placeholder='Current Password'
                      onChange={(e)=>{
                        setData({...data,confirmPassword:e.target.value})
                      }}/>
                      <div style={{width:'30%',whiteSpace:'nowrap',overflowWrap:'hidden'}} className='d-flex justify-content-between'>
                      <button id='savebtn' onClick={()=>{
                        updateUser();
                        setEditPassword(false)
                      }}>Save</button>
                      <button id='cancelbtn' onClick={()=>{
                        setUpdated(false)
                        setData(originData)
                      }}>Cancel</button>
                      </div>
                      
                    </div>:<div></div>}
                </li>
                </ul> 
                :<li>loading...</li>}
                
              
        </div>
      </div>
    </div>
  )
}

export default Settings