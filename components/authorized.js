// import { useSession, signIn } from "next-auth/react";
// import { useRouter } from "next/router";
// import { useEffect } from "react";
// import Layout from "./layout";

// export default function Authorized({ children }) {
//   const { data: session } = useSession();
//   const router = useRouter();
//   useEffect(() => {
//     console.log("\n\n\n\n");
//     console.log({ session });
//     if (!session) {
//       signIn(null, { callbackUrl: router.pathname });
//     }
//   }, [session]);
//   if (session) {
//     return <Layout>{children}</Layout>;
//   } else {
//     return <p>Redirecting...</p>;
//   }
// }

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
const AuthContext = createContext();

function AuthProvider({ children }) {
  const { pathname, events } = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Check that a new route is OK
    const handleRouteChange = (url) => {
      if (!PUBLIC_PATHS.includes(url) && !session) {
        signIn(null, url);
      }
    };

    // Check that initial route is OK
    if (!PUBLIC_PATHS.includes(url) && !session) {
      signIn(null, url);
    }

    // Monitor routes
    events.on("routeChangeStart", handleRouteChange);
    return () => {
      events.off("routeChangeStart", handleRouteChange);
    };
  }, [pathname]);

  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
