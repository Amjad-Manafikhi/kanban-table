import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/Layout";
import { LayoutProvider } from "@/contexts/LayoutContext";
// import { useRouter } from "next/router";
// import  Cookies from 'js-cookie'

// 👇 Extend the Next.js Page type
export type NextPageWithLayout = AppProps["Component"] & {
  noLayout?: boolean; // if true, skip Layout
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // const router = useRouter();
  // const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const isLogged = Cookies.get("loggedIn") === "true";
  //   setLoggedIn(isLogged);
  // }, [Cookies]);

  // useEffect(() => {
  //   console.log(router.pathname,loggedIn,"findmeee")
  //   if (loggedIn === null) return; // wait until cookie is read

  //   if (loggedIn && (router.pathname === "/login" || router.pathname === "/signup")) {
  //     router.replace("/"); // use replace instead of push
  //   } else if (!loggedIn && router.pathname !== "/login" && router.pathname !== "/signup") {
  //     router.replace("/login");
  //   }
  // }, [loggedIn, router.pathname]);


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
