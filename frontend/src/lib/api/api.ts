import { createAlova } from "alova";
import adapterFetch from "alova/fetch";

export type ApiResponse<TData> = {
  success: boolean;
  status: number;
  message: string;
  data?: TData;
};

export const ApiService = createAlova({
    baseURL: process.env.NEXT_PUBLIC_API || "https://api.example.com",
    requestAdapter: adapterFetch(),
    responded: (response) => response.json(),
    cacheFor: {
        GET: 0,
    },
    beforeRequest: (request) => {
        request.config.headers = {
            ...request.config.headers,
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Origin': '*',
            'x-client-platform': 'web',
        }
    },
})