import React, {useEffect, useState} from 'react'

export default function Attendance({employee, api}){
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [status, setStatus] = useState('Present')
  const [msg, setMsg] = useState(null)

  useEffect(()=>{ if(employee) fetchRecords() },[employee])

  async function fetchRecords(){
    if(!employee) return
    setLoading(true)
    try{
      const res = await fetch(`${api}/employees/${employee.employee_id}/attendance`)
      const data = await res.json()
      setRecords(data.attendance || [])
    }catch(e){console.error(e)}
    finally{setLoading(false)}
  }

  async function mark(e){
    e.preventDefault(); setMsg(null)
    try{
      const res = await fetch(`${api}/employees/${employee.employee_id}/attendance`,{
        method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({date, status})
      })
      if(!res.ok){ const err = await res.json(); throw new Error(err.detail || 'Failed') }
      setMsg({type:'success', text:'✅ Attendance marked successfully'})
      setTimeout(()=>setMsg(null), 3000)
      fetchRecords()
    }catch(err){ setMsg({type:'error', text:'❌ '+err.message}) }
  }

  const presentCount = records.filter(r=> r.status === 'Present').length
  const totalCount = records.length
  const percentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0

  if(!employee) return <div className="card" style={{textAlign:'center', padding:'40px 20px', color:'var(--text-secondary)'}}>👇 Select an employee to mark attendance</div>

  return (
    <div className="card">
      <h3>📋 Attendance — {employee.full_name}</h3>
      
      <div style={{background:'rgba(16,185,129,0.1)', padding:'12px', borderRadius:'8px', marginBottom:'16px', border:'1px solid rgba(16,185,129,0.3)'}}>
        <strong style={{color:'var(--success)'}}>✅ {presentCount}/{totalCount}</strong> days present 
        <div style={{fontSize:'12px', color:'var(--text-secondary)', marginTop:'4px'}}>{percentage}% attendance rate</div>
      </div>

      <form onSubmit={mark} className="form-inline">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} required />
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option>Present</option>
          <option>Absent</option>
        </select>
        <button>{status === 'Present' ? '✅ Mark Present' : '❌ Mark Absent'}</button>
      </form>
      {msg && <div className={msg.type === 'success' ? 'success' : 'error'}>{msg.text}</div>}

      <h4>📅 Attendance History</h4>
      {loading ? <div>⏳ Loading...</div> : (
        <ul className="list">
          {records.length === 0 ? (
            <li style={{textAlign:'center', color:'var(--text-secondary)'}}>No records yet</li>
          ) : (
            records.map(r=> (
              <li key={r.id} style={{background:`${r.status === 'Present' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}`}}>
                <div>
                  <strong>{r.date}</strong>
                  <div className="muted">{r.status === 'Present' ? '✅ Present' : '❌ Absent'}</div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
