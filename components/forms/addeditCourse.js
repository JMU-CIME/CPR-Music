import { useRouter } from "next/router";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { newCourse } from "../../actions";

export default function AddEditCourse({}) {
  const router = useRouter();

  const dispatch = useDispatch();
  const selectedCourse = useSelector((state) => state.selectedCourse);

  const [name, setName] = useState(selectedCourse?.name ?? "");
  const [startDate, setStartDate] = useState(selectedCourse?.startDate);
  const [endDate, setEndDate] = useState(selectedCourse?.endDate);
  const [rosterCSV, setRosterCSV] = useState(selectedCourse?.rosterCSV);

  const addCourse = (ev) => {
    console.log("ev", ev);

    // don't refresh the page
    ev.preventDefault();
    ev.stopPropagation();

    // tell redux we have changed data
    dispatch(newCourse({ name }));

    // navigate back to the course list
    router.push("/courses");
  };
  return (
    <Form onSubmit={addCourse}>
      <Form.Group as={Row} className="mb-3" controlId="formCourseName">
        <Form.Label column sm={2}>
          Course Name
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            placeholder="Course name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formCourseStart">
        <Form.Label column sm={2}>
          Start Date
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="date"
            placeholder="End Date"
            value={startDate}
            onChange={(ev) => setStartDate(ev.target.value)}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formCourseEnd">
        <Form.Label column sm={2}>
          End Date
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(ev) => setEndDate(ev.target.value)}
          />
        </Col>
      </Form.Group>
      {/* <Form.Group as={Row} className="mb-3" controlId="formRosterCSV">
        <Form.Label column sm={2}>
          Upload Roster
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="file"
            placeholder="Your Roster CSV"
            value={rosterCSV}
            onChange={(ev) => setRosterCSV(ev.target.value)}
          />
        </Col>
      </Form.Group> */}
      <Button type="submit">Submit</Button>
    </Form>
  );
}
