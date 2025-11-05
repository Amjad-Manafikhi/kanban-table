import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/Layout";
import { ReactElement, ReactNode } from "react";
import { LayoutProvider } from "@/contexts/LayoutContext";

// 👇 Extend the Next.js Page type
export type NextPageWithLayout<P = {}> = AppProps["Component"] & {
  noLayout?: boolean; // if true, skip Layout
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // ✅ Skip layout if page sets `noLayout = true`
  if (Component.noLayout) {
    return (
      <>
        <Toaster />
        <Component {...pageProps} />
      </>
    );
  }

  // ✅ Default layout
  
  return (
    <LayoutProvider>
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </LayoutProvider>
  );
}
