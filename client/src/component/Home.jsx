import axios from 'axios'
import React from 'react'
import { useState,useEffect } from 'react'
import {useNavigate, Link} from 'react-router-dom'
import './Home.css'
import overviewImage from '../assets/overview.jpg';
import budgetimage from '../assets/budget.jpg'
import expensesimage from '../assets/expenses.jpg'
import balanceimage from '../assets/balance.jpg'
import logoutbtn from '../assets/logout.png'
import settingsbtn from '../assets/settings.png'

function Home() {
 const [db,setDB] = useState('')
 const [loggedIn,setLoggedIn] = useState(false)
 const [data,setData]=useState()
 const nav = useNavigate();
  useEffect(()=>{
    axios.get('/api/login',{withCredentials:true})
    .then((res)=>{
      if(res.data.loggedIn){
        setDB(res.data.user)
        console.log(res.data.user)
        setLoggedIn(true)
      }
    })
  },[])

  useEffect(()=>{
    axios.get(`/api/cash_data/${db}}`)
    .then((res)=>{
      console.log(res.data)
      setData(res.data)
    }).catch((err)=>{
      console.log(err.response)
    })
  },[db])

  function handleLogout(){
    axios.get('/api/logout',{withCredentials:true})
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
    <div className='container-fluid vw-100 vw-100 align-items center'>
      <div id='top'>
        <h2>Expense Tracker</h2>
        <div className='d-flex justify-content-between'>
          <div>
            <button id='button' className='mt-1' style={{
              backgroundImage : `url(${settingsbtn})`,
              backgroundSize : 'contain',
              backgroundPosition: 'center',
              backgroundColor : 'transparent',
              border: 'none',
              width: '30px',
              height: '30px',
              opacity:'0.9'
            }} onClick={()=>{nav('/settings')}}/>
          </div>
          <div>
            <button id='button'   className='mt-1'
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
        </div>
      </div>
      <div id='main'>
      <div className='d-flex justify-content-between m-5'>
        <div id='card' className='card p-4'
        style={{backgroundImage:`url(${overviewImage})`,
        backgroundSize: 'contain', backgroundRepeat:'no-repeat', backgroundPosition:'right' }}
        onClick={()=>{nav('/overview')}}>
        <div>
            <h5>Overview</h5>
          </div>
        </div>
        <div id='card' className='card p-4'
        style={{backgroundImage:`url(${balanceimage})`,
        backgroundSize: 'contain', backgroundRepeat:'no-repeat', backgroundPosition:'right'
        }}
        onClick={()=>{nav('/cashin')}}>
          <div>
            <h5>Curreent Balance</h5>
            <h4>5,000৳</h4>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between m-5'>
        <div id='card' className='card p-4' 
        style={{backgroundImage:`url(${budgetimage})`,
        backgroundSize: 'contain', backgroundRepeat:'no-repeat', backgroundPosition:'right'}} onClick={()=>{nav('/budget')}}>
        <div>
            <h5>Budget</h5>
          </div>
        </div>
        <div id='card' className='card p-4' 
        style={{backgroundImage:`url(${expensesimage})`,
        backgroundSize: 'contain', backgroundRepeat:'no-repeat', backgroundPosition:'right'
        }}
        onClick={()=>{nav('/expense')}}>
        <div>
            <h5>Expenses</h5>
            <br/>
            <br/>
            <br/>
            <ol>
              <li><b>hello tamim how are you today?</b></li>
            </ol>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Home