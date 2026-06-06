import re
import json
import logging
from typing import Any, List, Optional

logger = logging.getLogger(__name__)

# Regular expression to parse nested join queries like "*, companies(name, id)" or "alias:table(cols)"
nested_pattern = re.compile(r'(?:(\w+):)?(\w+)(?:!(\w+))?\((.*?)\)')

# Explicit foreign key join rules for relation resolving
JOIN_RULES = {
    ("company_saved_talent", "users"): "users.id = company_saved_talent.user_id",
    ("jobs", "companies"): "companies.id = jobs.company_id",
    ("companies", "users"): "users.id = companies.created_by_user_id",
    ("users", "profiles"): "profiles.user_id = users.id",
    ("users", "ai_scores"): "ai_scores.user_id = users.id",
    ("applications", "users"): "users.id = applications.candidate_id",
    ("applications", "jobs"): "jobs.id = applications.job_id",
    ("user_roles", "roles"): "roles.id = user_roles.role_id",
    ("user_roles", "users"): "users.id = user_roles.user_id",
    ("connections", "users"): "users.id = connections.target_id",
    ("user_skills_relational", "skills"): "skills.id = user_skills_relational.skill_id",
    ("user_skill_nodes", "skills"): "skills.id = user_skill_nodes.skill_id",
    ("conversations", "messages"): "messages.conversation_id = conversations.id",
    ("conversations", "conversation_participants"): "conversation_participants.conversation_id = conversations.id",
    ("search_jobs", "jobs"): "jobs.id = search_jobs.job_id",
}

TABLE_COLUMNS = {
    "profiles": ["id", "user_id", "created_at", "updated_at", "embedding", "open_to_work", "social_links", "linkedin_url", "portfolio_url", "profile_banner", "current_position", "headline", "about", "resume_url", "banner_url", "visibility_mode", "github_url"],
    "skills": ["id", "name", "category"],
    "users": ["id", "search_vector", "is_active", "github_data", "created_at", "avatar_url", "username", "email", "password_hash", "user_code", "first_name", "last_name", "full_name"],
    "companies": ["id", "company_name", "created_by_user_id", "created_at", "industry"],
    "jobs": ["id", "company_id", "title", "description", "skills_required", "experience_level", "salary_range", "job_type", "location", "is_active", "created_at"],
    "search_candidates": ["user_id", "full_name", "skills", "experience_level", "proof_score", "location", "search_vector", "updated_at"],
    "search_jobs": ["job_id", "title", "skills", "salary_range", "experience_level", "job_type", "search_vector", "updated_at"],
    "messages": ["id", "conversation_id", "sender_id", "content", "is_read", "created_at", "updated_at"],
    "conversation_participants": ["id", "conversation_id", "user_id", "last_read_at", "created_at"],
}

import datetime

ARRAY_COLUMNS = {"roles", "required_skills", "skills_required", "skills_taught", "stack", "skills", "required_field_keys"}
iso_regex = re.compile(r'^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$')

def serialize_param(col: str, val: Any) -> Any:
    col_name = col.split(".")[-1] if "." in col else col
    if isinstance(val, list) and col_name in ARRAY_COLUMNS:
        return val
    if isinstance(val, str) and (col_name.endswith("_at") or col_name.endswith("_on") or iso_regex.match(val)):
        try:
            val_clean = val
            if val.endswith('Z'):
                val_clean = val[:-1] + '+00:00'
            return datetime.datetime.fromisoformat(val_clean)
        except Exception:
            pass
    if isinstance(val, (dict, list)):
        return json.dumps(val)
    return val



class DatabaseResponse:
    def __init__(self, data: Any, count: Optional[int] = None):
        self.data = data
        self.count = count

class AwaitableDatabaseResponse:
    def __init__(self, coro):
        self._coro = coro
        self._resolved = None

    def __await__(self):
        return self._coro.__await__()

    def _resolve(self):
        if self._resolved is None:
            import asyncio
            import nest_asyncio
            nest_asyncio.apply()
            loop = asyncio.get_event_loop()
            self._resolved = loop.run_until_complete(self._coro)
        return self._resolved

    @property
    def data(self):
        res = self._resolve()
        return res.data if res else None

    @property
    def count(self):
        res = self._resolve()
        return res.count if res else None

class QueryBuilder:
    def __init__(self, table: str):
        self.table = table
        self.method = "SELECT"
        self.select_columns = "*"
        self.filters = []
        self.orders = []
        self.limit_val = None
        self.offset_val = None
        self.insert_data = None
        self.update_data = None
        self.upsert_data = None
        self.single_row = False
        self.count_opt = None
        self.on_conflict_cols = "id"

    def select(self, columns: str = "*", count: Optional[str] = None):
        self.select_columns = columns
        self.count_opt = count
        return self

    def insert(self, data: Any):
        self.method = "INSERT"
        self.insert_data = data
        return self

    def update(self, data: Any):
        self.method = "UPDATE"
        self.update_data = data
        return self

    def upsert(self, data: Any, on_conflict: Optional[str] = None):
        self.method = "UPSERT"
        self.upsert_data = data
        if on_conflict:
            self.on_conflict_cols = on_conflict
        return self

    def delete(self):
        self.method = "DELETE"
        return self

    def eq(self, column: str, value: Any):
        self.filters.append((column, "=", value))
        return self

    def neq(self, column: str, value: Any):
        self.filters.append((column, "!=", value))
        return self

    def gt(self, column: str, value: Any):
        self.filters.append((column, ">", value))
        return self

    def lt(self, column: str, value: Any):
        self.filters.append((column, "<", value))
        return self

    def gte(self, column: str, value: Any):
        self.filters.append((column, ">=", value))
        return self

    def lte(self, column: str, value: Any):
        self.filters.append((column, "<=", value))
        return self

    def like(self, column: str, value: Any):
        self.filters.append((column, "LIKE", value))
        return self

    def ilike(self, column: str, value: Any):
        self.filters.append((column, "ILIKE", value))
        return self

    def in_(self, column: str, values: List[Any]):
        self.filters.append((column, "IN", list(values)))
        return self

    def is_(self, column: str, value: Any):
        if value is None or str(value).lower() == "null":
            self.filters.append((column, "IS", "NULL"))
        else:
            self.filters.append((column, "IS", value))
        return self

    def text_search(self, column: str, query: str, config: Optional[str] = None):
        col_name = "search_vector" if column == "fts" else column
        self.filters.append((col_name, "TEXT_SEARCH", query))
        return self

    def overlaps(self, column: str, value: List[Any]):
        self.filters.append((column, "OVERLAPS", value))
        return self

    def order(self, column: str, desc: bool = False, ascending: bool = True, nullsfirst: bool = False):
        direction = "DESC" if desc or not ascending else "ASC"
        self.orders.append(f"{column} {direction}")
        return self

    def limit(self, count: int):
        self.limit_val = count
        return self

    def range(self, start: int, end: int):
        self.limit_val = end - start + 1
        self.offset_val = start
        return self

    def single(self):
        self.single_row = True
        return self

    def _resolve_relation(self, target_table: str, fk_col: Optional[str] = None, alias: Optional[str] = None) -> str:
        # Generate the LEFT JOIN clause
        alias_name = alias or target_table
        if fk_col:
            return f"LEFT JOIN {target_table} AS {alias_name} ON {alias_name}.id = {self.table}.{fk_col}"
        
        # Check rule mapping
        pair = (self.table, target_table)
        if pair in JOIN_RULES:
            condition = JOIN_RULES[pair].replace(target_table, alias_name)
            return f"LEFT JOIN {target_table} AS {alias_name} ON {condition}"
        
        # Fallback heuristic: assume target_table has table_id or user_id
        if self.table == "users":
            return f"LEFT JOIN {target_table} AS {alias_name} ON {alias_name}.user_id = {self.table}.id"
        return f"LEFT JOIN {target_table} AS {alias_name} ON {alias_name}.id = {self.table}.{target_table}_id"

    def execute(self) -> DatabaseResponse:
        import db.engine as engine
        import asyncio
        import threading
        
        # Get the database loop and thread
        db_loop = getattr(engine, "db_loop", None)
        db_thread_id = getattr(engine, "db_thread_id", None)
        
        if not db_loop:
            try:
                db_loop = asyncio.get_running_loop()
            except RuntimeError:
                db_loop = None

        if db_loop and db_loop.is_running():
            # If we are inside an async context, always return an awaitable
            try:
                asyncio.get_running_loop()
                return AwaitableDatabaseResponse(self.execute_async())
            except RuntimeError:
                # We are in a synchronous thread but the db_loop is running elsewhere
                future = asyncio.run_coroutine_threadsafe(self.execute_async(), db_loop)
                return future.result()
        else:
            new_loop = asyncio.new_event_loop()
            try:
                engine.db_loop = new_loop
                engine.db_thread_id = threading.get_ident()
                return new_loop.run_until_complete(self.execute_async())
            finally:
                new_loop.close()
                engine.db_loop = None
                engine.db_thread_id = None

    def __await__(self):
        return self.execute_async().__await__()

    async def execute_async(self) -> DatabaseResponse:
        import db.engine as engine
        pool = engine.pool
        if not pool:
            logger.critical("Database pool not available.")
            raise RuntimeError("Database pool not available.")

        sql = ""
        params = []
        joins = []
        aliases = []
        alias_cols = {}

        # ─── BUILD SELECT QUERY ──────────────────────────────────────────────
        if self.method == "SELECT":
            cols_to_select = []
            
            # Parse Joins in select columns
            # E.g. "*, companies(name, id)"
            clean_select = self.select_columns
            matches = list(nested_pattern.finditer(self.select_columns))
            
            if matches:
                # Remove join strings to isolate root columns
                for match in matches:
                    clean_select = clean_select.replace(match.group(0), "")
                
                # Parse relation sections
                for match in matches:
                    alias = match.group(1) or match.group(2)
                    target_table = match.group(2)
                    fk_col = match.group(3)
                    cols_str = match.group(4)
                    
                    joins.append(self._resolve_relation(target_table, fk_col, alias))
                    aliases.append(alias)
                    
                    sub_cols = [c.strip() for c in cols_str.split(",") if c.strip()]
                    if "*" in sub_cols:
                        sub_cols.remove("*")
                        expanded = TABLE_COLUMNS.get(target_table, [])
                        sub_cols.extend(expanded)
                    alias_cols[alias] = sub_cols
                    for sc in sub_cols:
                        cols_to_select.append(f"{alias}.{sc} AS {alias}_{sc}")

            # Cleanup root columns
            root_cols = [c.strip() for c in clean_select.split(",") if c.strip()]
            for rc in root_cols:
                if rc == "*":
                    cols_to_select.insert(0, f"{self.table}.*")
                else:
                    cols_to_select.insert(0, f"{self.table}.{rc}")

            sql = f"SELECT {', '.join(cols_to_select)} FROM {self.table}"
            if joins:
                sql += " " + " ".join(joins)

            # Compile WHERE clauses
            if self.filters:
                where_clauses = []
                for col, op, val in self.filters:
                    # Prefix root table name to avoid ambiguities
                    col_with_prefix = f"{self.table}.{col}" if "." not in col else col
                    
                    if op == "IN":
                        placeholders = []
                        for v in val:
                            params.append(v)
                            placeholders.append(f"${len(params)}")
                        where_clauses.append(f"{col_with_prefix} IN ({', '.join(placeholders)})")
                    elif op == "IS":
                        where_clauses.append(f"{col_with_prefix} IS {val}")
                    elif op == "TEXT_SEARCH":
                        params.append(val)
                        where_clauses.append(f"{col_with_prefix} @@ websearch_to_tsquery('english', ${len(params)})")
                    elif op == "OVERLAPS":
                        params.append(serialize_param(col, val))
                        where_clauses.append(f"{col_with_prefix} && ${len(params)}")
                    else:
                        params.append(serialize_param(col, val))
                        where_clauses.append(f"{col_with_prefix} {op} ${len(params)}")
                sql += " WHERE " + " AND ".join(where_clauses)

            if self.orders:
                sql += " ORDER BY " + ", ".join([f"{self.table}.{o}" if "." not in o else o for o in self.orders])
            if self.limit_val is not None:
                sql += f" LIMIT {self.limit_val}"
            if self.offset_val is not None:
                sql += f" OFFSET {self.offset_val}"

        # ─── BUILD INSERT QUERY ──────────────────────────────────────────────
        elif self.method == "INSERT":
            if isinstance(self.insert_data, list):
                if not self.insert_data:
                    return DatabaseResponse([])
                columns = list(self.insert_data[0].keys())
                rows_placeholders = []
                for row in self.insert_data:
                    row_placeholders = []
                    for col in columns:
                        val = row[col]
                        params.append(serialize_param(col, val))
                        row_placeholders.append(f"${len(params)}")
                    rows_placeholders.append(f"({', '.join(row_placeholders)})")
                sql = f"INSERT INTO {self.table} ({', '.join(columns)}) VALUES {', '.join(rows_placeholders)} RETURNING *"
            else:
                columns = list(self.insert_data.keys())
                placeholders = []
                for col in columns:
                    val = self.insert_data[col]
                    params.append(serialize_param(col, val))
                    placeholders.append(f"${len(params)}")
                sql = f"INSERT INTO {self.table} ({', '.join(columns)}) VALUES ({', '.join(placeholders)}) RETURNING *"

        # ─── BUILD UPDATE QUERY ──────────────────────────────────────────────
        elif self.method == "UPDATE":
            columns = list(self.update_data.keys())
            set_clauses = []
            for col in columns:
                val = self.update_data[col]
                params.append(serialize_param(col, val))
                set_clauses.append(f"{col} = ${len(params)}")
            sql = f"UPDATE {self.table} SET {', '.join(set_clauses)}"
            
            if self.filters:
                where_clauses = []
                for col, op, val in self.filters:
                    if op == "IN":
                        placeholders = []
                        for v in val:
                            params.append(v)
                            placeholders.append(f"${len(params)}")
                        where_clauses.append(f"{col} IN ({', '.join(placeholders)})")
                    elif op == "IS":
                        where_clauses.append(f"{col} IS {val}")
                    elif op == "TEXT_SEARCH":
                        params.append(val)
                        where_clauses.append(f"{col} @@ websearch_to_tsquery('english', ${len(params)})")
                    elif op == "OVERLAPS":
                        params.append(serialize_param(col, val))
                        where_clauses.append(f"{col} && ${len(params)}")
                    else:
                        params.append(serialize_param(col, val))
                        where_clauses.append(f"{col} {op} ${len(params)}")
                sql += " WHERE " + " AND ".join(where_clauses)
            sql += " RETURNING *"

        # ─── BUILD UPSERT QUERY ──────────────────────────────────────────────
        elif self.method == "UPSERT":
            data_list = self.upsert_data if isinstance(self.upsert_data, list) else [self.upsert_data]
            if not data_list:
                return DatabaseResponse([])
            columns = list(data_list[0].keys())
            rows_placeholders = []
            for row in data_list:
                row_placeholders = []
                for col in columns:
                    val = row[col]
                    params.append(serialize_param(col, val))
                    row_placeholders.append(f"${len(params)}")
                rows_placeholders.append(f"({', '.join(row_placeholders)})")
            
            conflict_target = self.on_conflict_cols
            if not conflict_target.startswith("("):
                conflict_target = f"({conflict_target})"
                
            update_cols = [c for c in columns if c not in self.on_conflict_cols.replace(" ", "").split(",")]
            update_exprs = [f"{c} = EXCLUDED.{c}" for c in update_cols]
            
            sql = f"INSERT INTO {self.table} ({', '.join(columns)}) VALUES {', '.join(rows_placeholders)} "
            if update_exprs:
                sql += f"ON CONFLICT {conflict_target} DO UPDATE SET {', '.join(update_exprs)} RETURNING *"
            else:
                sql += f"ON CONFLICT {conflict_target} DO NOTHING RETURNING *"

        # ─── BUILD DELETE QUERY ──────────────────────────────────────────────
        elif self.method == "DELETE":
            sql = f"DELETE FROM {self.table}"
            if self.filters:
                where_clauses = []
                for col, op, val in self.filters:
                    if op == "IN":
                        placeholders = []
                        for v in val:
                            params.append(v)
                            placeholders.append(f"${len(params)}")
                        where_clauses.append(f"{col} IN ({', '.join(placeholders)})")
                    elif op == "IS":
                        where_clauses.append(f"{col} IS {val}")
                    elif op == "TEXT_SEARCH":
                        params.append(val)
                        where_clauses.append(f"{col} @@ websearch_to_tsquery('english', ${len(params)})")
                    elif op == "OVERLAPS":
                        params.append(serialize_param(col, val))
                        where_clauses.append(f"{col} && ${len(params)}")
                    else:
                        params.append(serialize_param(col, val))
                        where_clauses.append(f"{col} {op} ${len(params)}")
                sql += " WHERE " + " AND ".join(where_clauses)
            sql += " RETURNING *"

        # ─── EXECUTE DATABASE STATEMENT ──────────────────────────────────────
        try:
            async with pool.acquire() as conn:
                logger.debug(f"Executing SQL: {sql} with params: {params}")
                records = await conn.fetch(sql, *params)
                
                # Convert records to dicts and parse jsonb fields
                rows = []
                for r in records:
                    row_dict = dict(r)
                    
                    # Parse any serialized JSON fields back to objects
                    for key, val in row_dict.items():
                        # Convert UUIDs to strings to fix ORJSON serialization errors
                        if type(val).__name__ == "UUID" or hasattr(val, "version") and type(val).__module__ == "uuid":
                            row_dict[key] = str(val)
                        elif isinstance(val, str) and (val.startswith("{") or val.startswith("[")):
                            try:
                                row_dict[key] = json.loads(val)
                            except:
                                pass
                                
                    # Reconstruct nested relations
                    for alias in aliases:
                        nested_data = {}
                        has_data = False
                        for col in alias_cols[alias]:
                            key = f"{alias}_{col}"
                            if key in row_dict:
                                val = row_dict.pop(key)
                                if val is not None:
                                    has_data = True
                                nested_data[col] = val
                        row_dict[alias] = nested_data if has_data else None
                        
                    rows.append(row_dict)

                # Handle exact row count if requested
                total_count = None
                if self.method == "SELECT" and self.count_opt == "exact":
                    count_sql = f"SELECT COUNT(*) FROM {self.table}"
                    if joins:
                        count_sql += " " + " ".join(joins)
                    if self.filters:
                        count_sql += " WHERE " + " AND ".join(where_clauses)
                    total_count = await conn.fetchval(count_sql, *params)

                if self.single_row:
                    return DatabaseResponse(rows[0] if rows else None, count=total_count)
                return DatabaseResponse(rows, count=total_count)

        except Exception as e:
            logger.error(f"SQL execution failed: {e}\nSQL: {sql}\nParams: {params}")
            raise e

import warnings

class PostgresAdapter:
    """
    DEPRECATED: Custom PostgreSQL Query Builder mapping to Supabase-style syntax.
    DO NOT USE for new features. Use SQLAlchemy AsyncSession instead.
    """
    def __init__(self, pool=None):
        warnings.warn(
            "PostgresAdapter is deprecated and will be removed in Phase 3. "
            "Please use SQLAlchemy models from core.database instead.",
            DeprecationWarning,
            stacklevel=2
        )
        self.pool = pool
        self._table = None

    def table(self, table_name: str) -> QueryBuilder:
        return QueryBuilder(table_name)
