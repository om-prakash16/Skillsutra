from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
import json
from core.supabase import get_supabase

router = APIRouter()

@router.get("/{table_name}")
async def db_select(
    table_name: str,
    select: str = "*",
    filters: Optional[str] = None,
    orders: Optional[str] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    single: bool = False
):
    db = get_supabase()
    q = db.table(table_name).select(select)
    
    if filters:
        try:
            parsed_filters = json.loads(filters)
            for col, op, val in parsed_filters:
                if op == "=": q = q.eq(col, val)
                elif op == "!=": q = q.neq(col, val)
                elif op == ">": q = q.gt(col, val)
                elif op == "<": q = q.lt(col, val)
                elif op == ">=": q = q.gte(col, val)
                elif op == "<=": q = q.lte(col, val)
                elif op.lower() == "like": q = q.like(col, val)
                elif op.lower() == "ilike": q = q.ilike(col, val)
                elif op.lower() == "in": q = q.in_(col, val)
                elif op.lower() == "is": q = q.is_(col, val)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid filters parameter: {e}")
            
    if orders:
        try:
            parsed_orders = json.loads(orders)
            for col, desc in parsed_orders:
                q = q.order(col, desc=desc)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid orders parameter: {e}")
            
    if limit is not None:
        q = q.limit(limit)
    if offset is not None:
        q = q.range(offset, offset + (limit or 100) - 1)
    if single:
        q = q.single()
        
    res = await q.execute()
    return {"data": res.data, "count": res.count}

@router.post("/{table_name}")
async def db_insert(table_name: str, payload: Any):
    db = get_supabase()
    res = await db.table(table_name).insert(payload).execute()
    return {"data": res.data}

@router.patch("/{table_name}")
async def db_update(table_name: str, payload: Dict[str, Any]):
    db = get_supabase()
    data = payload.get("data")
    filters = payload.get("filters")
    
    q = db.table(table_name).update(data)
    if filters:
        for col, op, val in filters:
            if op == "=": q = q.eq(col, val)
            elif op == "!=": q = q.neq(col, val)
            elif op == ">": q = q.gt(col, val)
            elif op == "<": q = q.lt(col, val)
            elif op == ">=": q = q.gte(col, val)
            elif op == "<=": q = q.lte(col, val)
            elif op.lower() == "like": q = q.like(col, val)
            elif op.lower() == "ilike": q = q.ilike(col, val)
            elif op.lower() == "in": q = q.in_(col, val)
            elif op.lower() == "is": q = q.is_(col, val)
            
    res = await q.execute()
    return {"data": res.data}

@router.delete("/{table_name}")
async def db_delete(table_name: str, filters: str):
    db = get_supabase()
    q = db.table(table_name).delete()
    try:
        parsed_filters = json.loads(filters)
        for col, op, val in parsed_filters:
            if op == "=": q = q.eq(col, val)
            elif op == "!=": q = q.neq(col, val)
            elif op == ">": q = q.gt(col, val)
            elif op == "<": q = q.lt(col, val)
            elif op == ">=": q = q.gte(col, val)
            elif op.lower() == "like": q = q.like(col, val)
            elif op.lower() == "ilike": q = q.ilike(col, val)
            elif op.lower() == "in": q = q.in_(col, val)
            elif op.lower() == "is": q = q.is_(col, val)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid filters parameter: {e}")
        
    res = await q.execute()
    return {"data": res.data}
