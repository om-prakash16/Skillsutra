class SupabaseQueryBuilder {
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
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
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

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const authEmulator = {
  async signInWithPassword({ email, password }: any) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    try {
      const res = await fetch(`${API_URL}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, requested_role: 'user' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Login failed');
      
      const data = json.data || json;
      return {
        data: {
          session: {
            access_token: data.access_token,
            user: { id: data.user_id, email, user_metadata: { role: data.role } }
          },
          user: { id: data.user_id, email, user_metadata: { role: data.role } }
        },
        error: null
      };
    } catch (err: any) {
      return { data: { session: null, user: null }, error: { message: err.message } };
    }
  },
  
  async signInWithOAuth({ provider, options }: any) {
    const role = options?.queryParams?.role || 'user';
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    
    try {
      const response = await fetch(`${API_URL}/auth/wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: `DEV_${role.toUpperCase()}_999`,
          signature: "MOCK_DEMO_SIGNATURE",
          message: "Demo Google sign in",
          requested_role: role
        })
      });
      const json = await response.json();
      const data = json.data || json;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("auth_token", data.access_token);
        document.cookie = `auth_token=${data.access_token}; path=/; SameSite=Lax`;
        window.location.href = options?.redirectTo || '/';
      }
      return { data: {}, error: null };
    } catch (e: any) {
      return { data: null, error: { message: e.message } };
    }
  },
  
  async signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
    return { error: null };
  },
  
  async getSession() {
    if (typeof window === 'undefined') return { data: { session: null }, error: null };
    const token = localStorage.getItem('auth_token');
    if (!token) return { data: { session: null }, error: null };
    
    const payload = parseJwt(token);
    if (!payload) return { data: { session: null }, error: null };
    
    return {
      data: {
        session: {
          access_token: token,
          user: {
            id: payload.sub || payload.id,
            email: payload.email || `${payload.roles?.[0] || 'user'}@example.com`,
            user_metadata: { role: payload.roles?.[0] || 'user' }
          }
        }
      },
      error: null
    };
  },
  
  async getUser(token?: string) {
    const t = token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
    if (!t) return { data: { user: null }, error: null };
    const payload = parseJwt(t);
    if (!payload) return { data: { user: null }, error: null };
    return {
      data: {
        user: {
          id: payload.sub || payload.id,
          email: payload.email || `${payload.roles?.[0] || 'user'}@example.com`,
          user_metadata: { role: payload.roles?.[0] || 'user' }
        }
      },
      error: null
    };
  },
  
  onAuthStateChange(callback: any) {
    this.getSession().then(({ data: { session } }) => {
      callback('SIGNED_IN', session);
    });
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};

export const supabase = {
  from(tableName: string) {
    return new SupabaseQueryBuilder(tableName);
  },
  auth: authEmulator
};
