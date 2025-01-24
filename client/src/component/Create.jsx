import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate,Link,useLocation } from 'react-router-dom'
import backicon from '../assets/back.png'
import logoutbtn from '../assets/logout.png'
import './Settings.css'
import { useParams } from 'react-router-dom'


function Settings() {
  const loc = useLocation()
  const action = loc.state?.action
  const [loggedIn,setLoggedIn] = useState(false)
  const nav = useNavigate();
  const[sourceot,setSourceOT] =useState(false)
  const [DBname,setDBname] =useState('');
  const[editdt,setEditDT] = useState(false)
  const [data,setData] =useState({
    Amount:'',
    Date:'',
    Time:'',
    Reason:'',
    Explination:'',
    Type: `${action}`,
    db: '',
  })

  useEffect(()=>{
    axios.get('/api/login')
    .then((res)=>{
      setDBname(res.data.user)
      setLoggedIn(res.data.loggedIn)
      setData({...data,db:res.data.user})
      
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

 function add_data(e){
  e.preventDefault()
  console.log(data)
  axios.post('/api/new_data',data)
  .then((res)=>{
    if(res.status===200){
      console.log('success')
      nav(`/${action}`)
    }
  }).catch((err)=>{
    console.log(err.messaeg)
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
        <Link to={`/${action}`} className='btn mt-1'style={{
          backgroundImage : `url(${backicon})`,
          backgroundSize:'cover',
          backgroundRepeat:'no-repeat',
          backgroundPosition:'center',
          width:'30px',
          height: '30px',
              }}/>
            <h2>Add Data</h2>
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
      <div className='containter-fluid vh-100 vw-100 align-items center'>
        <div>
        
        
        </div>
      <div className='card p-4 m-5 mt-2'>
        <h4 className='text-center mb-3'>Enter Information</h4>
        <form onSubmit={add_data}>
          <div className='from-group row mb-3'>
            <label htmlFor='Amount' className='col-sm-2 mt-1'> Amount:</label>
            <div className='col-sm-10'>
              <input 
              id='Amount'
              className='form-control'
              type= 'number'
              required
              onChange={(e)=>{
                setData({...data, Amount: e.target.value})
              }}
              
              />
            </div>
          </div>
          <div className='from-group row mb-3'>
            {action==='cashin'?<label htmlFor='source' className='col-sm-2 mt-1'> Source:</label>:<label htmlFor='ID' className='col-sm-2 mt-1'> Reason:</label>}
            <div className='col-sm-10'>
            {action ==='cashin'?(<div> 
              <select 
              id='source'
              className='form-control'
              type=""              
              required
              onChange={(e)=>{
                if(e.target.value==='Others'){
                  setSourceOT(true)
                  
                }
                else{
                  setData({...data, Reason:e.target.value})
                  setSourceOT(false)
                }
              }}
              >
                <option value="">Select your option</option>
                <option value='Salary'>Salary</option>
                <option value='Business'>Business</option>
                <option value='Others'>Others</option>
              </select>
              
              </div>):<div> 
                <input 
              id='source'
              className='form-control'
              type= 'text'
              required
              onChange={(e)=>{
                setData({...data, Reason: e.target.value})
              }}
              />
              </div>}

            </div>
          </div>
          {sourceot? <div className='from-group row mb-3'>
                <label htmlFor='SourceName' className='col-sm-2 mt-1'> Source name:</label>
                <div className='col-sm-10'>
                <input 
              id='SourceName'
              className='form-control'
              type= 'text'
              
              onChange={(e)=>{
                setData({...data, Reason: e.target.value})
              }}
              />
              </div>
              </div>:''}  
          <div className='from-group row mb-3'>
            <label htmlFor='exp' className='col-2 mt-1'> Explination:</label>
            <div className='col-sm-10'>
              <input 
              id='exp'
              className='form-control'
              type= 'text'
             
              onChange={(e)=>{
                setData({...data, Explination: e.target.value})
              }}
              />
            </div>
          </div>
          {action==='budget'?<div>
            <div>
              <div className='from-group row mb-3'>
            <label htmlFor='time' className='col-sm-2 mt-1'> Time:</label>
            <div className='col-sm-10'>
              <input 
              id='time'
              className='form-control'
              type= 'time'
              required
              onChange={(e)=>{
                setData({...data, Time: e.target.value})
              }}
              />
            </div>
          </div>
          <div className='from-group row mb-3'>
            <label htmlFor='date' className='col-sm-2 mt-1'> Date:</label>
            <div className='col-sm-10'>
              <input 
              id='date'
              className='form-control'
              type= 'Date'
              required
              onChange={(e)=>{
                const raw = e.target.value;
                const [year,month,day] = raw.split('-')
                const newdata = `${day}/${month}/${year}`
                setData({...data, Date: newdata})
              }}
              
              />
            </div>
          </div>
            </div>

          </div>:<div>
            <div className='from-group row mb-3'>
            <label htmlFor='DT' className='col-sm-2 mt-1'>Date and Time:</label>
            <div className='col-sm-10'>
              <select 
              id='DT'
              className='form-control'
              type=""              
              
              onChange={(e)=>{
                const val = e.target.value
                if(val=== ''){
                  setEditDT(false)
                }
                else{
                  setEditDT(true)
                }
              }}
              >
                <option value="">Now</option>
                <option value='Male'>Custom</option>

              </select>
            </div>
          </div>
          {editdt? (
            <div>
              <div className='from-group row mb-3'>
            <label htmlFor='time' className='col-sm-2 mt-1'> Time:</label>
            <div className='col-sm-10'>
              <input 
              id='time'
              className='form-control'
              type= 'time'
             
              onChange={(e)=>{
                setData({...data, Time: e.target.value})
              }}
              />
            </div>
          </div>
          <div className='from-group row mb-3'>
            <label htmlFor='date' className='col-sm-2 mt-1'> Date:</label>
            <div className='col-sm-10'>
              <input 
              id='date'
              className='form-control'
              type= 'Date'
              
              onChange={(e)=>{
                const raw = e.target.value;
                const [year,month,day] = raw.split('-')
                const newdata = `${day}/${month}/${year}`
                setData({...data, Date: newdata})
              }}
              
              />
            </div>
          </div>
            </div>
          ):'' }
            </div>}
          
          
          <div className='d-flex justify-content-center'>
          <button type='submit' className='btn btn-success'>Submit</button>
          </div>
        </form>
      </div>
      </div>
      </div>
    </div>
  )
}

export default Settings