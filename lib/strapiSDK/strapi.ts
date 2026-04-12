// This is a local mock/wrapper for the Strapi client to avoid breaking existing code
// It redirect calls to our local Next.js API routes

class LocalApiClient {
  // Helper to normalize MongoDB _id to Strapi id
  private normalize(data: any): any {
    if (!data) return data;
    if (Array.isArray(data)) {
      return data.map(item => this.normalize(item));
    }
    if (typeof data === 'object') {
      const normalized: any = { ...data };
      if (data._id) {
        normalized.id = data._id.toString();
      }
      // Recursively normalize children
      for (const key in normalized) {
        normalized[key] = this.normalize(normalized[key]);
      }
      return normalized;
    }
    return data;
  }

  async find(collection: string, query: any = {}) {
    const url = new URL(`/api/${collection}`, window.location.origin);
    const res = await fetch(url.toString());
    const data = await res.json();
    const result = Array.isArray(data) ? { data } : data;
    return this.normalize(result);
  }

  async findOne(collection: string, id: string, query: any = {}) {
    const res = await fetch(`/api/${collection}/${id}`);
    const data = await res.json();
    return this.normalize({ data });
  }

  async create(collection: string, data: any) {
    const res = await fetch(`/api/${collection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    return this.normalize(resData);
  }

  async update(collection: string, id: string, data: any) {
    const res = await fetch(`/api/${collection}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    return this.normalize(resData);
  }

  async delete(collection: string, id: string) {
    const res = await fetch(`/api/${collection}/${id}`, {
      method: "DELETE",
    });
    const resData = await res.json();
    return this.normalize(resData);
  }

  axios = {
    get: async (url: string) => {
      const localUrl = url.startsWith("/") ? `/api${url}` : `/api/${url}`;
      const res = await fetch(localUrl);
      const data = await res.json();
      return { data: this.normalize(data) };
    },
    post: async (url: string, data: any) => {
      const localUrl = url.startsWith("/") ? `/api${url}` : `/api/${url}`;
      const isFormData = data instanceof FormData;
      const res = await fetch(localUrl, {
        method: "POST",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });
      const resData = await res.json();
      return { data: this.normalize(resData) };
    },
    put: async (url: string, data: any) => {
      const localUrl = url.startsWith("/") ? `/api${url}` : `/api/${url}`;
      const isFormData = data instanceof FormData;
      const res = await fetch(localUrl, {
        method: "PUT",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });
      const resData = await res.json();
      return { data: this.normalize(resData) };
    },
    delete: async (url: string) => {
      const localUrl = url.startsWith("/") ? `/api${url}` : `/api/${url}`;
      const res = await fetch(localUrl, {
        method: "DELETE",
      });
      const resData = await res.json();
      return { data: this.normalize(resData) };
    }
  }
}

export const strapi = new LocalApiClient() as any;