import React, { useEffect, useState } from 'react'
import EmployeeList from './components/EmployeeList'
import AddEmployee from './components/AddEmployee'
import Attendance from './components/Attendance'
import Dashboard from './components/Dashboard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App(){
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  const fetchEmployees = async ()=>{
    setLoading(true)
    try{
      const res = await fetch(`${API}/employees`)
      const data = await res.json()
      setEmployees(data)
    }catch(e){
      console.error(e)
    }finally{setLoading(false)}
  }

  useEffect(()=>{fetchEmployees()},[]) 

  return (
    <div className="container">
      <header>
        <h1>HRMS Lite</h1>
      </header>
      <main>
        <section className="left">
          <Dashboard employees={employees} api={API} />
          <AddEmployee onAdded={fetchEmployees} api={API} />
          <EmployeeList employees={employees} loading={loading} onDelete={fetchEmployees} onSelect={setSelected} api={API} />
        </section>
        <section className="right">
          <Attendance employee={selected} api={API} />
        </section>
      </main>
    </div>
  )
}
