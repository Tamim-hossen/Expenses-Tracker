import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [user,setUser] = useState({
    username: '',
    password: ''
  })
  const [wrongUser, setWrongUser] = useState(false)
  const [wrongPassword, setWrongPassword] = useState(false)
  const [showPassword,setShowPassword] = useState(false)
  const nav = useNavigate();

  useEffect(()=>{
    axios.get('http://localhost:5000/login', {withCredentials:true})
    .then((response) => {
        
        if(response.data.loggedIn){
            nav('/home')
        }
        
    })
},[])


  async function handleSubmit(e){
    e.preventDefault();

    try{
      const res = await axios.post('/api/login',user)
        if(res.status ===200){
            nav('/home')
        }
      } catch (err){
        if(err.response){
          if(err.response.status === 404){
            setWrongUser(true)
          }
        
        else if(err.response.status === 401){
          setWrongPassword(true)
        }
        else{
          console.log(err.res)
        }
      }
    }

  }
  return (
    <div className='container-fluid vh-90 vw-90 align-items center mt-4'>
      <div className='card p-4'>
        <h3 className='text-center mb-5'>Log In</h3>
        <form onSubmit={handleSubmit}>
          <div className='form-group row mb-1'>
            <label htmlFor='username' className='col sm-3'>Username or Email:</label>
            <div className='col-sm-9'>
              <input 
              type='text'
              id='username'
              className='form-control'
              placeholder='Enter Username or Email'
              style={wrongUser?{border:'1px solid tomato'}:{}}
              required
              onChange={(e)=>{
                setUser({...user, username: e.target.value})
                setWrongUser(false)
              }}
              />
              <span className='text-danger' style={wrongUser? {visibility:'visible'}:{visibility:'hidden'}}><small>*Wrong Username or Email</small></span>
            </div>
          </div>
          <div className='form-group row mb-1'>
            <label htmlFor='password' className='col-sm-3'>Password:</label>
            <div className='col-sm-9'>
              <input 
              type={showPassword? 'text':'password'}
              id='password'
              className='form-control'
              placeholder='Enter your Password'
              style={wrongPassword?{border:'1px solid tomato'}:{}}
              required
              onChange={(e)=>{
                setUser({...user, password: e.target.value})
                setWrongPassword(false)
              }}
              />
              <span className='text-danger' style={wrongPassword? {visibility:'visible'}:{visibility:'hidden'}}><small>*Wrong Password</small></span>
              <div className='form-check'>
                <input
                type='checkbox'
                className='form-check-input'
                onChange={()=>{
                  setShowPassword((prev)=>!prev)
                }}/>
                <label>Show Password</label>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-center mb-4'>
            <button type='submit' className='btn btn-success'>Log in</button>
          </div>
          <div>
            <p className='text-center'>Don't have an account?</p>
            <div className='d-flex justify-content-center'>
              <Link to='/signup' className='btn btn-info' style={{color:'white'}}>Sign Up</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login