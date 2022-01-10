import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import Layout from "./layout";

export default function Authorized({ children }) {
  // const { data: session } = useSession();
  // useEffect(() => {
  //   console.log("\n\n\n\n");
  //   console.log({ session });
  //   if (!session) {
  //     signIn();
  //   }
  // }, [session]);
  // if (session) {
  return <Layout>{children}</Layout>;
  // } else {
  //   return <p>Redirecting...</p>;
  // }
}
