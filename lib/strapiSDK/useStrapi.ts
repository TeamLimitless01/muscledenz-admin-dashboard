import useSWR from "swr";
import { strapi } from "./strapi";

const fetcher = async (collection: string, query: any = {}) => {
  // Use the central strapi client which handles normalization (_id -> id)
  const res = await strapi.find(collection, query);
  return res;
};

export function useStrapi(collection: string, query = {}, options = {}) {
  return useSWR([collection, query], ([c, q]) => fetcher(c, q), {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    ...options,
  });
}