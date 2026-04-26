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

export function useStrapiOne(collection: string, id: string, query = {}, options = {}) {
  return useSWR([collection, id, query], ([c, i, q]) => strapi.findOne(c, i, q), {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    ...options,
  });
}