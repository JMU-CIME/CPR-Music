import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Layout from "../components/layout";

const Index = () => {
  const dispatch = useDispatch();

  return (
    <Layout>
      <h1>Welcome to Music CPR</h1>
    </Layout>
  );
};

export default Index;
