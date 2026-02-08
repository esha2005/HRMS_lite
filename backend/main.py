from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, create_engine, select
from models import Employee, Attendance
from pydantic import BaseModel, EmailStr, validator
from datetime import date

DATABASE_URL = "sqlite:///hrms.db"

engine = create_engine(DATABASE_URL, echo=False)

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @validator("employee_id")
    def id_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("employee_id is required")
        return v.strip()


class AttendanceCreate(BaseModel):
    date: date
    status: str

    @validator("status")
    def valid_status(cls, v):
        if v not in ("Present", "Absent"):
            raise ValueError("status must be 'Present' or 'Absent'")
        return v


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.post("/employees", status_code=status.HTTP_201_CREATED)
def create_employee(payload: EmployeeCreate):
    with Session(engine) as session:
        # duplicate check
        stmt = select(Employee).where(
            (Employee.employee_id == payload.employee_id) | (Employee.email == payload.email)
        )
        existing = session.exec(stmt).first()
        if existing:
            raise HTTPException(status_code=400, detail="Employee with same ID or email already exists")

        emp = Employee(
            employee_id=payload.employee_id,
            full_name=payload.full_name,
            email=str(payload.email),
            department=payload.department,
        )
        session.add(emp)
        session.commit()
        session.refresh(emp)
        return emp


@app.get("/employees")
def list_employees():
    with Session(engine) as session:
        employees = session.exec(select(Employee)).all()
        return employees


@app.delete("/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str):
    with Session(engine) as session:
        stmt = select(Employee).where(Employee.employee_id == employee_id)
        emp = session.exec(stmt).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")
        session.delete(emp)
        session.commit()
        return None


@app.post("/employees/{employee_id}/attendance", status_code=status.HTTP_201_CREATED)
def mark_attendance(employee_id: str, payload: AttendanceCreate):
    with Session(engine) as session:
        stmt = select(Employee).where(Employee.employee_id == employee_id)
        emp = session.exec(stmt).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")

        att = Attendance(employee_id=employee_id, date=payload.date, status=payload.status)
        session.add(att)
        session.commit()
        session.refresh(att)
        return att


@app.get("/employees/{employee_id}/attendance")
def get_attendance(employee_id: str):
    with Session(engine) as session:
        stmt = select(Employee).where(Employee.employee_id == employee_id)
        emp = session.exec(stmt).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")

        att_stmt = select(Attendance).where(Attendance.employee_id == employee_id).order_by(Attendance.date.desc())
        records = session.exec(att_stmt).all()
        return {"employee": emp, "attendance": records}
