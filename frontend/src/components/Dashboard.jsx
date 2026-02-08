import React, { useEffect, useState } from 'react'

export default function Dashboard({ employees, api }) {
  const [stats, setStats] = useState({ total: 0, avgPresent: '0', present: 0, absent: 0 })

  useEffect(() => {
    calculateStats()
  }, [employees, api])

  async function calculateStats() {
    if (!employees || employees.length === 0) {
      setStats({ total: 0, avgPresent: '0', present: 0, absent: 0 })
      return
    }

    let totalPresent = 0
    let totalAbsent = 0
    let totalRecords = 0

    for (const emp of employees) {
      try {
        const res = await fetch(`${api}/employees/${emp.employee_id}/attendance`)
        if (res.ok) {
          const data = await res.json()
          const records = data.attendance || []
          const presentCount = records.filter(a => a.status === 'Present').length
          const absentCount = records.filter(a => a.status === 'Absent').length
          totalPresent += presentCount
          totalAbsent += absentCount
          totalRecords += records.length
        }
      } catch (e) {
        console.error('Error fetching attendance:', e)
      }
    }

    const avgPresent = totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : '0'
    setStats({ total: employees.length, avgPresent, present: totalPresent, absent: totalAbsent })
  }

  return (
    <div className="card dashboard">
      <h3>📊 Dashboard Summary</h3>
      <div className="stats">
        <div className="stat">
          <strong>👥</strong>
          <div style={{fontSize:'24px', margin:'8px 0'}}>{stats.total}</div>
          <span>Total Employees</span>
        </div>
        <div className="stat">
          <strong style={{color:'var(--success)'}}>✅</strong>
          <div style={{fontSize:'24px', margin:'8px 0', color:'var(--success)'}}>{stats.present}</div>
          <span>Days Present</span>
        </div>
        <div className="stat">
          <strong style={{color:'var(--danger)'}}>❌</strong>
          <div style={{fontSize:'24px', margin:'8px 0', color:'var(--danger)'}}>{stats.absent}</div>
          <span>Days Absent</span>
        </div>
        <div className="stat">
          <strong style={{color:'var(--accent)'}}>📈</strong>
          <div style={{fontSize:'24px', margin:'8px 0', color:'var(--accent)'}}>{stats.avgPresent}%</div>
          <span>Avg Attendance</span>
        </div>
      </div>
    </div>
  )
}

