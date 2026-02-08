import React, {useState} from 'react'

export default function AddEmployee({onAdded, api}){
  const [form, setForm] = useState({employee_id:'', full_name:'', email:'', department:''})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function submit(e){
    e.preventDefault()
    setBusy(true); setError(null); setSuccess(false)
    try{
      const res = await fetch(`${api}/employees`,{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify(form)
      })
      if(!res.ok){
        const err = await res.json()
        throw new Error(err.detail || 'Failed to add employee')
      }
      setForm({employee_id:'', full_name:'', email:'', department:''})
      setSuccess(true)
      setTimeout(()=>setSuccess(false), 3000)
      onAdded()
    }catch(err){setError(err.message)}
    finally{setBusy(false)}
  }

  return (
    <div className="card">
      <h3>➕ Add New Employee</h3>
      <form onSubmit={submit} className="form">
        <input placeholder="Employee ID (e.g., EMP001)" value={form.employee_id} onChange={e=>setForm({...form, employee_id:e.target.value})} required />
        <input placeholder="Full Name" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} required />
        <input placeholder="Email Address" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input placeholder="Department" value={form.department} onChange={e=>setForm({...form, department:e.target.value})} required />
        <div className="form-actions">
          <button disabled={busy}>{busy? '⏳ Adding...':'➕ Add Employee'}</button>
        </div>
        {error && <div className="error">❌ {error}</div>}
        {success && <div className="success">✅ Employee added successfully!</div>}
      </form>
    </div>
  )
}
