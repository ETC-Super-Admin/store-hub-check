"use client";
import { AppStore, makeStore } from "@/redux/store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRef } from "react";
import { Provider } from "react-redux";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  const queryClientRef = useRef<QueryClient | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore(); // Create the store instance only once
  }

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1, // ลองใหม่ 1 ครั้งถ้า query ล้มเหลว
          staleTime: 5 * 60 * 1000, // ข้อมูล fresh เป็นเวลา 5 นาที
        },
      },
    });
  }

  return (
    <Provider store={storeRef.current}>
      <QueryClientProvider client={queryClientRef.current}>

        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  )
}