import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Layout from "../components/layout";

const Index = () => {
  const dispatch = useDispatch();

  return (
    <Layout>
      <h1>Home</h1>
      <Link href="/show-redux-state">
        <a>Click to see current Redux State</a>
      </Link>
    </Layout>
  );
};

export default Index;
