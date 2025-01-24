import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate,Link,useLocation } from 'react-router-dom'
import backicon from '../assets/back.png'
import logoutbtn from '../assets/logout.png'


function Settings() {

  const [loggedIn,setLoggedIn] = useState(false)
  const nav = useNavigate();
  const [DBname,setDBname] =useState('');
  const [data,setData] = useState()
  let balance = 0

  useEffect(()=>{
    axios.get('/api/login')
    .then((res)=>{
      setDBname(res.data.user)
      setLoggedIn(res.data.loggedIn)
    })
  },[])

  useEffect(()=>{
    axios.get(`/api/cash_data/${DBname}`)
    .then((res)=>{
      console.log(res.data)
      setData(res.data)
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
            <h2>Overview</h2>
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
      <h3 className='text-right mb-4'>Current Balance: {balance} ৳</h3>
        <h3 className='text-center mb-4'>Overview</h3>
        <table className='table table-bordered table-hover mt-3' style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead className='table-dark'>
            <tr>
              <th scope='col'>Trx Type</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Reason/Source</th>
              <th scope="col" style={{maxWidth:'10%'}}>Explination</th>
              
            </tr>
            </thead>
            <tbody>
            {Array.isArray(data) && data.length > 0 ? (
                    [...data].reverse().map((d) => {
                      let updatedtype =''
                      let rowclass=''
                      const formattedDate = new Date(d.Date).toLocaleDateString('en-GB');
                      
                        if(d.Type==='expense'){
                          updatedtype='Expenditure'
                          rowclass='table-danger'
                        }
                        else if(d.Type==='cashin'){
                          updatedtype='Cash In'
                          rowclass='table-success'
                        }
                        else if(d.Type==='budget'){
                          updatedtype='Budget'
                          rowclass='table-info'
                        }
                      
                      
                        return(
                          <tr key={d.ID} className={rowclass}>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{updatedtype}</td>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.Amount} ৳</td>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{formattedDate}</td>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.Time}</td>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.Reason}</td>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={d.Explination}>{d.Explination}</td>
                            
                            </tr>)
                      }
                      )):<tr>
                      <td colSpan={6}><h4 className='text-center'>No Data Available</h4></td>
                      </tr>}
          </tbody>
        </table>

              
    </div>
    </div>
  )
}

export default Settings