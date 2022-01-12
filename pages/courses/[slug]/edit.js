import { useEffect } from "react";
import Layout from "../../../components/layout";

export default function EditCourse() {
  useEffect(() => {}, []);
  return (
    <Layout>
      <h1>Edit Course</h1>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  console.log("params", params);
  const { slug } = params;
  return {
    props: {
      slug,
    },
  };
}
