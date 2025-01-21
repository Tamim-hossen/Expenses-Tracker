import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate,Link } from 'react-router-dom'

function Signup() {
    const [user,setUser] = useState({
        Name:'',
        Username:'',
        Email:'',
        Password: '',
        ConfirmPassword: '',
        dbname:''
    })
    const [showPassword,setShowPassword] = useState(false)
    const [match,setMatch] = useState(true)
    const [userCreated,setUserCreated] = useState(false)
    const [wrongUser,setWrongUser] = useState(false)
    const [wrongEmail,setWrongEmail] = useState(false)
    const nav = useNavigate()

    useEffect(()=>{
        axios.get('/api/login',{withCredentials:true})
        .then((res)=>{
            if(res.data.user){
                nav('/home')
            }
        })
    })
   
    async function handleCreateUser(e) {
        e.preventDefault()
        if(user.Password !== user.ConfirmPassword){
            setMatch(false)
        }
        else{
            axios.post('api/create_user',user)
            .then((res)=>{
                if(res.status===201){
                    console.log('successful')
                    setUserCreated(true)
                }
            }).catch((err)=>{
                if(err.status === 409){
                    setWrongEmail(true)
                }
                else if(err.status === 410){
                    setWrongUser(true)
                }
                else{
                    window.alert("Internal Server Error")
                }
            })

        }
    }
    if(userCreated){
        return(
            <div className='container-fluid vh-90 vw-90 align-items center'>
                <h2 className='text-center' style={{marginTop:'200px'}}>Registration Successful!</h2>
                <div className='d-flex justify-content-center mt-3'>
                    <Link to={'/'} className='btn btn-info' style={{color:'white'}}>Log In</Link>
                </div>
            </div>
        )
    }

  return (
    <div className='container-fluid vh90 vw-90 align-items center'>
        <div className='card p-4 m-3'>
            <form onSubmit={handleCreateUser}>
            <h1 className='text-center mb-4'>Register</h1>
                <div className='form-group row' style={{marginBottom:'25px'}}>
                    <label htmlFor='Name' className='col-sm-2 col-form-label'>Name:</label>
                    <div className='col-sm-10'>
                    <input 
                    className='form-control' 
                    type='text'
                    id='Name'
                    placeholder='Enter Your Name'
                    required
                    onChange={(e)=>{
                        setUser({...user, Name: e.target.value})
                    }}
                    />
                    </div>
                </div>
                <div className='form-group row' style={{marginBottom:'4px'}}>
                    <label htmlFor='Username' className='col-sm-2 col-form-label'>Username:</label>
                    <div className='col-sm-10'>
                    <input 
                    className='form-control' 
                    type='text'
                    id='Username'
                    placeholder='Create a Username'
                    style={wrongUser? {border:'1px solid tomato'}:{}}
                    required
                    onChange={(e)=>{
                        setUser({...user, Username: e.target.value, dbname: e.target.value})
                        setWrongUser(false)
                    }}
                    />
                    <span className='text-danger p-2' style={wrongUser? {visibility: 'visible'}:{visibility:'hidden'}}>
                        <small>
                            *Username is not available!
                        </small>
                    </span>
                    </div>
                </div>
                <div className='form-group row' style={{marginBottom:'4px'}}>
                    <label htmlFor='Email' className='col-sm-2 col-form-label'>Email:</label>
                    <div className='col-sm-10'>
                    <input 
                    className='form-control' 
                    type='email'
                    id='Email'
                    placeholder='Enter Your Email'
                    style={wrongEmail? {border:'1px solid tomato'}:{}}
                    required
                    onChange={(e)=>{
                        setUser({...user, Email: e.target.value})
                        setWrongEmail(false)
                    }}
                    /> 
                    <span className='text-danger p-2' style={wrongEmail?{visibility:'visible'}:{visibility: 'hidden'}}>
                        <small>*An account with this email Already Exists</small>
                    </span>
                    </div>
                </div>
                <div className='form-group row' style={{marginBottom:'25px'}}>
                    <label htmlFor='Password' className='col-sm-2 col-form-label'>Password:</label>
                    <div className='col-sm-10'>
                    <input 
                    className='form-control' 
                    type={showPassword? 'text' : 'password'}
                    id='Password'
                    placeholder='Create Password'
                    style={match?{}:{border: '1px solid tomato'}}
                    required
                    onChange={(e)=>{
                        setUser({...user, Password: e.target.value})
                        setMatch(true)
                    }}
                    />
                    </div>
                </div>
                <div className='form-group row mb-4'>
                    <label htmlFor='ConfirmPassword' className='col-sm-2 col-form-label'>Confirm Password:</label>
                    <div className='col-sm-10' >
                    <input 
                    className='form-control mb-1' 
                    type={showPassword? 'text' : 'password'}
                    id='ConfirmPassword'
                    placeholder='Confirm Password'
                    style={match?{}:{border: '1px solid tomato'}}
                    required
                    onChange={(e)=>{
                        setUser({...user, ConfirmPassword: e.target.value})
                        setMatch(true)
                    }}
                    />
                    <span className='text-danger p-2' style={match? {visibility:'hidden'}:{visibility:'visible'}}><small>*Passwords do not match!!</small></span>
                        <div className='form-check mt-2'>
                            <input
                            type='checkbox'
                            className='form-check-input'
                            value={showPassword}
                            onChange={()=>{
                                setShowPassword((prev)=>!prev)
                            }}/>
                            <label>Show Password</label>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center mb-4'>
                    <button type='submit' className='btn btn-success'>Register</button>
                </div>

                <h6 className='text-center mb-3'>Already have an account?</h6>
                <div className='d-flex justify-content-center'>
                    <Link to={'/'} className='btn btn-info' style={{color: 'white'}}>Log In</Link>
                </div>

            </form>

        </div>
    </div>
  )
}

export default Signup