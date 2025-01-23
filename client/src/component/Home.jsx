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
 const [bdata,setBData] =useState()
 let balance =0
 let ecurr = 0
 let bcurr=0
 let ccurr=0
 let ocurr=0
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
    axios.get(`/api/cash_data/${db}`)
    .then((res)=>{
      console.log(res.data)
      setData(res.data)
      const tdata = res.data.filter((d)=> d.Type === 'budget')
      const sortedData = tdata.sort((a, b) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);
        return dateB - dateA;
      })
      setBData(sortedData)
    }).catch((err)=>{
      console.log(err.response)
    })
  },[db])

  if(data){
    data.map((d)=>{
      if(d.Type==='expense'){
        balance -= d.Amount
      }
      else if(d.Type==='cashin'){
        balance += d.Amount
      }
    })
  }

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
        <div style={{overflowY:'auto',padding: '10px'}}>
            <h5>Overview</h5>
            <br/>


           
                     <div style={{overflowY:'auto',maxHeight: '200px',padding: '10px'}}>
                     <h6>Current Balance: {balance= balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ৳ </h6>
                     <br/>
                        <ol  className='list-group'>
                        {Array.isArray(data) && data.length > 0 ? (
                                [...data].reverse().map((d) => {
                                  let updatedtype =''
                                  if(d.Type){
                                    if(d.Type==='expense'){
                                      updatedtype='Expenditure'
         
                                    }
                                    else if(d.Type==='cashin'){
                                      updatedtype='Cash In'
      
                                    }
                                    else if(d.Type==='budget'){
                                      updatedtype='Budget'
                                    }
                                  }
                                  if((d.Type === 'cashin'||d.Type === 'expense') && ocurr<3){
                                    ocurr++
                                    return(
                                        <li className = ''style={{ overflowY:'hidden',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                        <small><b>{updatedtype} - </b></small>
                                        <small><b>{d.Amount} ৳ - </b></small>
                                        <small><b>{d.Reason}</b></small>
                                        </li>
                                        )
                                  }
                                  
                                  })):<tr>
                                  <td colSpan={4}><h4 className='text-center'>No Data Available</h4></td>
                                  </tr>}
                      </ol>
                      </div>
                    
          </div>
        </div>
        <div id='card' className='card p-4'
        style={{backgroundImage:`url(${balanceimage})`,
        backgroundSize: 'contain', backgroundRepeat:'no-repeat', backgroundPosition:'right'
        }}
        onClick={()=>{nav('/cashin')}}>
           <div style={{overflowY:'auto',padding: '10px'}}>
            <h5>Cash In</h5>
            <br/>


           
                     <div style={{overflowY:'auto',maxHeight: '200px',padding: '10px'}}>
                     <h6>Recents</h6>
                     <br/>
                        <ol  className='list-group'>
                        {Array.isArray(data) && data.length > 0 ? (
                                [...data].reverse().map((d) => {
                                  const formattedDate = new Date(d.Date).toLocaleDateString('en-GB');
                                  if(d.Type === 'cashin' && ccurr<3){
                                    ccurr++
                                    return(
                                        <li className = ''style={{ overflowY:'hidden',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                        <small><b>{d.Amount} ৳ - </b></small>
                                        <small><b>{d.Reason} - </b></small>
                                        <small><b>{formattedDate} - </b></small>
                                        <small><b>{d.Time}</b></small>
                                        </li>
                                        )
                                  }
                                  
                                  })):<tr>
                                  <td colSpan={4}><h4 className='text-center'>No Data Available</h4></td>
                                  </tr>}
                      </ol>
                      </div>
                    
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between m-5'>
        <div id='card' className='card p-4' 
        style={{backgroundImage:`url(${budgetimage})`,
        backgroundSize: 'contain', backgroundRepeat:'no-repeat', backgroundPosition:'right'}} onClick={()=>{nav('/budget')}}>
         <div style={{overflowY:'auto',padding: '10px'}}>
            <h5>Budget</h5>
            <br/>


           
                     <div style={{overflowY:'auto',maxHeight: '200px',padding: '10px'}}>
                     <h6>To be paid</h6>
                     <br/>
                        <ol  className='list-group'>
                        {Array.isArray(bdata) && bdata.length > 0 ? (
                                bdata.map((d) => {
                                  const formattedDate = new Date(d.Date).toLocaleDateString('en-GB');
                                  if(bcurr<3){
                                    bcurr++
                                    return(
                                        <li className = ''style={{ overflowY:'hidden',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                        <small><b>{d.Amount} ৳ - </b></small>
                                        <small><b>{d.Reason} - </b></small>
                                        <small><b>{formattedDate} - </b></small>
                                        <small><b>{d.Time}</b></small>
                                        </li>
                                        )
                                  }
                                  
                                  })):<tr>
                                  <td colSpan={4}><h4 className='text-center'>No Data Available</h4></td>
                                  </tr>}
                      </ol>
                      </div>
                    
          </div>
        </div>
        <div id='card' className='card p-4' 
        style={{backgroundImage:`url(${expensesimage})`,
        backgroundSize: 'contain', backgroundRepeat:'no-repeat', backgroundPosition:'right'
        }}
        onClick={()=>{nav('/expense')}}>
        <div style={{overflowY:'auto',padding: '10px'}}>
            <h5>Expenses</h5>
            <br/>


           
                     <div style={{overflowY:'auto',maxHeight: '200px',padding: '10px'}}>
                     <h6>Recents</h6>
                     <br/>
                        <ol  className='list-group'>
                        {Array.isArray(data) && data.length > 0 ? (
                                [...data].reverse().map((d) => {
                                  const formattedDate = new Date(d.Date).toLocaleDateString('en-GB');
                                  if(d.Type === 'expense' && ecurr<3){
                                    ecurr++
                                    return(
                                        <li className = ''style={{ overflowY:'hidden',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                        <small><b>{d.Amount} ৳ - </b></small>
                                        <small><b>{d.Reason} - </b></small>
                                        <small><b>{formattedDate} - </b></small>
                                        <small><b>{d.Time}</b></small>
                                        </li>
                                        )
                                  }
                                  
                                  })):<tr>
                                  <td colSpan={4}><h4 className='text-center'>No Data Available</h4></td>
                                  </tr>}
                      </ol>
                      </div>
                    
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Home