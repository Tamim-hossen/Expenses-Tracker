import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate,Link,useLocation } from 'react-router-dom'
import backicon from '../assets/back.png'
import logoutbtn from '../assets/logout.png'
import editbtn from '../assets/edit.png'
import deleteicon from '../assets/delete.png'
import saveicon from '../assets/save.png'

function Settings() {

  const [loggedIn,setLoggedIn] = useState(false)
  const nav = useNavigate();
  const [DBname,setDBname] =useState('');
  const [data,setData] = useState()

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
      const bdata = res.data.filter((d)=> d.Type === 'budget')
      const sortedData = bdata.sort((a, b) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);
        return dateB - dateA;
      })
      setData(sortedData)
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
  async function updateEntry(id){
    const updata = {
      ID : id,
      db:DBname
    }
    await axios.put(`/api/update_budget`,updata)
    .then((res)=>{
      if(res.status===200){
        window.alert('Updated Successsfully')
        nav('/home')
      }
    }).catch((err)=>{
      console.log(err.response)
    })
  }
  async function deleteEntry(id){
    await axios.delete(`/api/delete/${id}`, {
      params: {DBname}})
      .then((res)=>{
        if(res.status===200){
          setData((prev)=> prev.filter(d=> d.ID !== id))
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
            <h2>Budgets</h2>
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
        <div className='d-flex justify-content-end mb-2'>
          <button id= 'savebtn' onClick={()=>{
            nav('/create/budget',{
              state:{action: 'budget'}
            })
          }}>Add</button>
        </div>
        <h3 className='text-center mb-4'>Budget History</h3>
        <table className='table table-bordered table-hover mt-3' style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead className='table-dark'>
            <tr>
              <th scope="col">Amount</th>
              <th scope="col">Due Date</th>
              <th scope="col">due Time</th>
              <th scope="col">Reason</th>
              <th scope="col" style={{maxWidth:'10%'}}>Explination</th>
              <th scope='col'>Actions</th>
            </tr>
            </thead>
            <tbody>
            {Array.isArray(data) && data.length > 0 ? (
                    [...data].reverse().map((d) => {
                      const formattedDate = new Date(d.Date).toLocaleDateString('en-GB');
                      if(d.Type === 'budget'){
                        return(
                          <tr key={d.ID}>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.Amount} ৳</td>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{formattedDate}</td>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.Time}</td>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.Reason}</td>
                            <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={d.Explination}>{d.Explination}</td>
                            <td className='d-flex justify-content-center'>
                            <a style={{backgroundImage : `url(${saveicon})`,
                                backgroundSize:'contain',
                                backgroundRepeat:'no-repeat',
                                backgroundPosition:'center', width:'15px', height:'23px', 
                                marginRight:'10%', border:'none', backgroundColor:'transparent'}}
                                title='Save as Paid'  
                                onClick={()=>{
                                  window.confirm('Mark as complete?')? updateEntry(d.ID) : ''
                                }} />
                              <a style={{backgroundImage : `url(${editbtn})`,
                                backgroundSize:'contain',
                                backgroundRepeat:'no-repeat',
                                backgroundPosition:'center', width:'20px', height:'23px', 
                                marginRight:'10%', border:'none', backgroundColor:'transparent'}}
                                title='Edit' 
                                onClick={()=>{
                                  nav(`/edit/${d.ID}`,{
                                    state:{action: 'budget'}
                                  })
                                }} />
                              <a style={{backgroundImage : `url(${deleteicon})`,
                                backgroundSize:'contain',
                                backgroundRepeat:'no-repeat',
                                backgroundPosition:'center', width:'15px', height:'20px', 
                                 border:'none', backgroundColor:'transparent'}} 
                                 title='Delete' 
                                 onClick={()=>{
                                  window.confirm('Are you sure you want to delete the budget?')? deleteEntry(d.ID) : ''
                                }} />
                                
                            </td>
                            </tr>)
                      }
                      })):<tr>
                        <td colSpan={6}><h4 className='text-center'>No Data Available</h4></td>
                        </tr>}
          </tbody>
        </table>

              
    </div>
    </div>
  )
}

export default Settings