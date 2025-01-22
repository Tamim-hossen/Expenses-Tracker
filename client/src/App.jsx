import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './component/Login.jsx'
import Signup from './component/Signup.jsx'
import Home from './component/Home.jsx'
import Current from './component/Current.jsx'
import Overview from './component/Overview.jsx'
import Budget from './component/Budget.jsx'
import Expenses from './component/Expenses.jsx'
import Settings from './component/Settings.jsx'
import Create from './component/Create.jsx'
import Edit from './component/Edit.jsx'

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path= '/' element = {<Login/>}/>
        <Route path= '/signup' element = {<Signup/>}/>
        <Route path= '/home' element = {<Home/>}/>
        <Route path='/cashin' element = {<Current/>}/>
        <Route path='/overview' element = {<Overview/>}/>
        <Route path='/budget' element = {<Budget/>}/>
        <Route path='/expense' element = {<Expenses/>}/>
        <Route path='/settings' element = {<Settings/>}/>
        <Route path='/create/:param' element={<Create/>}/>
        <Route path='/edit/:id' element ={<Edit/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App