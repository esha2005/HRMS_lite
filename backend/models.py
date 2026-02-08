from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field, Relationship


class Attendance(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: str = Field(index=True)
    date: date
    status: str


class Employee(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: str = Field(index=True, unique=True)
    full_name: str
    email: str
    department: str
