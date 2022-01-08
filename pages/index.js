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
      <h1>Welcome to Music CPR</h1>
      
    </Layout>
  );
};

export default Index;
