from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from pydantic import BaseModel
import uuid
import random

# Use existing DB dependency pattern, mocking here for simplicity
from db.database import get_db_connection

from models.company import (
    CompanyCreate, CompanyResponse,
    JobCreate, JobResponse, JobSchemaFieldResponse,
    TalentBookmarkCreate, TalentBookmarkResponse
)

router = APIRouter()

# --- Companies ---

@router.post("/companies", response_model=CompanyResponse)
async def create_company(company: CompanyCreate, wallet_address: str):
    """Create a new company profile for a user."""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO companies (owner_wallet, name, website, industry, company_size, location, logo_url, about_company)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, owner_wallet, name, website, industry, company_size, location, logo_url, about_company, is_verified, created_at
            """,
            (wallet_address, company.name, company.website, company.industry, 
             company.company_size, company.location, company.logo_url, company.about_company)
        )
        row = cur.fetchone()
        conn.commit()
        if not row:
            raise HTTPException(status_code=400, detail="Failed to create company")
            
        columns = [desc[0] for desc in cur.description]
        company_dict = dict(zip(columns, row))
        company_dict['id'] = str(company_dict['id'])
        return CompanyResponse(**company_dict)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.get("/companies/me", response_model=List[CompanyResponse])
async def get_my_companies(wallet_address: str):
    """Get all companies owned by a specific wallet."""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            SELECT id, owner_wallet, name, website, industry, company_size, location, logo_url, about_company, is_verified, created_at 
            FROM companies WHERE owner_wallet = %s
            """, (wallet_address,)
        )
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        companies = []
        for row in rows:
            cdict = dict(zip(columns, row))
            cdict['id'] = str(cdict['id'])
            companies.append(CompanyResponse(**cdict))
        return companies
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# --- Jobs ---

@router.get("/company/job-schema", response_model=List[JobSchemaFieldResponse])
async def get_job_schema():
    """Retrieve dynamic fields for job posting form."""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM job_schema_fields ORDER BY display_order ASC")
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        fields = []
        for row in rows:
            fdict = dict(zip(columns, row))
            fdict['id'] = str(fdict['id'])
            fields.append(JobSchemaFieldResponse(**fdict))
        return fields
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

import json
@router.post("/companies/{company_id}/jobs", response_model=JobResponse)
async def create_job(company_id: str, job: JobCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO jobs (company_id, title, description, required_skills, employment_type, location_type, salary_range, deadline, min_reputation_score, dynamic_fields)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, company_id, title, description, required_skills, is_active, created_at
            """,
            (company_id, job.title, job.description, job.required_skills, job.employment_type, job.location_type, 
             job.salary_range, job.deadline, job.min_reputation_score, json.dumps(job.dynamic_fields))
        )
        row = cur.fetchone()
        conn.commit()
        if not row:
            raise HTTPException(status_code=400, detail="Failed to create job")
            
        columns = [desc[0] for desc in cur.description]
        jdict = dict(zip(columns, row))
        jdict['id'] = str(jdict['id'])
        jdict['company_id'] = str(jdict['company_id'])
        return JobResponse(**jdict)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# --- Applications & AI Match Mock ---

class ApplicationStatusUpdate(BaseModel):
    status: str # 'pending', 'shortlisted', 'interview', 'hired', 'rejected'

@router.put("/company/applications/{application_id}/status")
async def update_application_status(application_id: str, payload: ApplicationStatusUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE applications SET status = %s, updated_at = NOW() WHERE id = %s RETURNING id",
            (payload.status, application_id)
        )
        row = cur.fetchone()
        conn.commit()
        if not row:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"status": "success", "new_status": payload.status}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.post("/company/mock-applicant/{job_id}")
async def create_mock_applicant_with_ai_score(job_id: str):
    """Mocks an application with a calculated AI Match Score for demonstration."""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Generate random wallet and score
        mock_wallet = f"mock_{uuid.uuid4().hex[:8]}"
        ai_score = round(random.uniform(65.0, 99.5), 2)
        
        # Ensure user exists first
        cur.execute(
            "INSERT INTO users (wallet_address, full_name) VALUES (%s, %s) ON CONFLICT DO NOTHING",
            (mock_wallet, f"Candidate {mock_wallet[-4:]}")
        )
        
        cur.execute(
            """
            INSERT INTO applications (job_id, candidate_wallet, ai_match_score)
            VALUES (%s, %s, %s)
            RETURNING id, ai_match_score
            """,
            (job_id, mock_wallet, ai_score)
        )
        row = cur.fetchone()
        conn.commit()
        return {"application_id": str(row[0]), "ai_score": float(row[1]), "wallet": mock_wallet}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
