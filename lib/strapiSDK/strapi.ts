// This is a local mock/wrapper for the Strapi client to avoid breaking existing code
// It redirect calls to our local Next.js API routes

class LocalApiClient {
  async find(collection: string, query: any = {}) {
    const url = new URL(`/api/${collection}`, window.location.origin);
    const res = await fetch(url.toString());
    const data = await res.json();
    return Array.isArray(data) ? { data } : data;
  }

  async findOne(collection: string, id: string, query: any = {}) {
    const res = await fetch(`/api/${collection}/${id}`);
    const data = await res.json();
    return { data };
  }

  async create(collection: string, data: any) {
    const res = await fetch(`/api/${collection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async update(collection: string, id: string, data: any) {
    const res = await fetch(`/api/${collection}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async delete(collection: string, id: string) {
    const res = await fetch(`/api/${collection}/${id}`, {
      method: "DELETE",
    });
    return res.json();
  }

  // Simplified axios-like object
  axios = {
    get: async (url: string) => {
      // Handle Strapi-style URLs like /users?filters...
      const localUrl = url.startsWith("/") ? `/api${url}` : `/api/${url}`;
      const res = await fetch(localUrl);
      const data = await res.json();
      return { data };
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
      return { data: resData };
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
      return { data: resData };
    },
    delete: async (url: string) => {
      const localUrl = url.startsWith("/") ? `/api${url}` : `/api/${url}`;
      const res = await fetch(localUrl, {
        method: "DELETE",
      });
      const resData = await res.json();
      return { data: resData };
    }
  }
}

export const strapi = new LocalApiClient() as any;