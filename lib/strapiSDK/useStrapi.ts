import useSWR from "swr";

const fetcher = async (collection: string, query: any = {}) => {
  // Convert Strapi-style query to URL search params if needed, 
  // or just call the local API route.
  // For now, we'll just call /api/[collection]
  const url = new URL(`/api/${collection}`, window.location.origin);
  
  // Basic query mapping (very simplified)
  if (query.pagination) {
    url.searchParams.append('page', query.pagination.page);
    url.searchParams.append('pageSize', query.pagination.pageSize);
  }
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  
  // Wrap in { data: ... } to match Strapi's response format if the components expect it
  return Array.isArray(data) ? { data } : data;
};

export function useStrapi(collection: string, query = {}, options = {}) {
  return useSWR([collection, query], ([c, q]) => fetcher(c, q), {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    ...options,
  });
}