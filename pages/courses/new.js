import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch } from "react-redux";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import { newCourse } from "../../actions";
import AddEditCourse from "../../components/forms/addEditCourse";

const NewCourse = () => {
  return (
    <Layout>
      <h1>Add Course</h1>
      <AddEditCourse />
      {/* <p>Form with details...</p> */}
      {/* <p>Need to be able to upload roster here?</p> */}
    </Layout>
  );
};

export default NewCourse;
