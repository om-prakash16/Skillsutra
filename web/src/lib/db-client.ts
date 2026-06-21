/**
 * Database Client
 * 
 * Query builder that routes database operations through the FastAPI backend.
 * This is a pure HTTP-over-REST database proxy — no external dependencies.
 */

class DbQueryBuilder {
  private table: string;
  private method: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' = 'SELECT';
  private selectCols: string = '*';
  private filters: Array<[string, string, any]> = [];
  private orders: Array<[string, boolean]> = [];
  private limitVal: number | null = null;
  private offsetVal: number | null = null;
  private insertData: any = null;
  private updateData: any = null;
  private singleRow: boolean = false;
  private countOpt: string | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*', options?: { count?: string; head?: boolean }) {
    this.selectCols = columns;
    if (options?.count) this.countOpt = options.count;
    if (options?.head) this.limitVal = 0;
    return this;
  }

  insert(data: any) {
    this.method = 'INSERT';
    this.insertData = data;
    return this;
  }

  update(data: any) {
    this.method = 'UPDATE';
    this.updateData = data;
    return this;
  }

  delete() {
    this.method = 'DELETE';
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push([column, '=', value]);
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push([column, '!=', value]);
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this.orders.push([column, !ascending]);
    return this;
  }

  limit(count: number) {
    this.limitVal = count;
    return this;
  }

  single() {
    this.singleRow = true;
    return this;
  }

  async execute() {
    const API_URL = typeof window !== 'undefined'
      ? "/api/v1"
      : (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1');
    let url = `${API_URL}/db/${this.table}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = { headers };

    if (this.method === 'SELECT') {
      const params = new URLSearchParams();
      params.append('select', this.selectCols);
      if (this.filters.length > 0) {
        params.append('filters', JSON.stringify(this.filters));
      }
      if (this.orders.length > 0) {
        params.append('orders', JSON.stringify(this.orders));
      }
      if (this.limitVal !== null) {
        params.append('limit', this.limitVal.toString());
      }
      if (this.singleRow) {
        params.append('single', 'true');
      }
      url = `${url}?${params.toString()}`;
      options.method = 'GET';
    } else if (this.method === 'INSERT') {
      options.method = 'POST';
      options.body = JSON.stringify(this.insertData);
    } else if (this.method === 'UPDATE') {
      options.method = 'PATCH';
      options.body = JSON.stringify({
        data: this.updateData,
        filters: this.filters
      });
    } else if (this.method === 'DELETE') {
      options.method = 'DELETE';
      url = `${url}?filters=${encodeURIComponent(JSON.stringify(this.filters))}`;
    }

    try {
      const res = await fetch(url, options);
      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: json.detail || 'Database request failed' } };
      }
      
      let data = json.data;
      if (this.singleRow && Array.isArray(data)) {
        data = data[0] || null;
      }
      return { data, error: null, count: json.count };
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'Network error' } };
    }
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

/**
 * Database client singleton.
 * 
 * Usage:
 *   import { db } from "@/lib/db-client"
 *   const { data } = await db.from("users").select("*").eq("id", userId)
 */
export const db = {
  from(tableName: string) {
    return new DbQueryBuilder(tableName);
  },
};
