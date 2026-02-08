import React from 'react'

export default function EmployeeList({employees, loading, onDelete, onSelect, api}){
  if(loading) return <div className="card">⏳ Loading employees...</div>
  if(!employees || employees.length===0) return <div className="card"><h3>👥 Employees</h3><div style={{textAlign:'center', padding:'20px', color:'var(--text-secondary)'}}>No employees yet. Add one to get started!</div></div>

  return (
    <div className="card">
      <h3>👥 Employees ({employees.length})</h3>
      <ul className="list">
        {employees.map(e=> (
          <li key={e.employee_id}>
            <div>
              <strong>👤 {e.full_name}</strong>
              <div className="muted">🏢 {e.department} | 📧 {e.email}</div>
              <div className="muted">ID: {e.employee_id}</div>
            </div>
            <div className="actions">
              <button onClick={()=>onSelect(e)} style={{background:'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>📋 Attendance</button>
              <button className="danger" onClick={async ()=>{if(confirm('Delete this employee?')){await fetch(`${api}/employees/${e.employee_id}`,{method:'DELETE'}); onDelete()}}}>🗑️ Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

