import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { startClock } from "../actions";
import Examples from "../components/examples";
import Layout from "../components/layout";

const Index = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(startClock());
  }, [dispatch]);

  return (
    <Layout>
      <h1>Home</h1>
      <Examples />
      <Link href="/show-redux-state">
        <a>Click to see current Redux State</a>
      </Link>
    </Layout>
  );
};

export default Index;
