import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Spinner from 'react-bootstrap/Spinner';
import { newCourse } from '../../actions';
import { getEnrollments, mutateCourse } from '../../api';

export default function AddEditCourse() {
  const router = useRouter();
  const { slug } = router.query;
  console.log('add/edit slug', slug);

  const dispatch = useDispatch();

  // const enrollments = useSelector((state) => state.enrollments);
  const userInfo = useSelector((state) => state.currentUser);

  const {
    isLoading,
    error,
    data: enrollments,
  } = useQuery('enrollments', getEnrollments);
  // const router = useRouter();
  // const { slug } = router.query;
  
  const currentEnrollment = slug &&
    enrollments ? enrollments.filter((elem) => elem.course.slug === slug)[0] : null;

  // const selectedEnrollment = enrollments.items.filter((enrollment) => enrollment.course.slug === slug)[0];
  const selectedCourse = currentEnrollment?.course;
  console.log('selectedCourse', selectedCourse);

  const today = new Date();
  const sampleEnd = new Date();
  sampleEnd.setMonth(sampleEnd.getMonth() + 3);
  sampleEnd.setDate(0);

  // const [name, setName] = useState(selectedCourse ? selectedCourse.name : '');
  // const [startDate, setStartDate] = useState(
  //   selectedCourse
  //     ? selectedCourse.start_date
  //     : today.toISOString().substring(0, 10)
  // );
  // const [endDate, setEndDate] = useState(
  //   selectedCourse
  //     ? selectedCourse.end_date
  //     : sampleEnd.toISOString().substring(0, 10)
  // );

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (selectedCourse) {
      setName(selectedCourse.name);
      setStartDate(selectedCourse.start_date);
      setEndDate(selectedCourse.end_date);
    }
  }, [slug, selectedCourse])

  const queryClient = useQueryClient();
  const courseMutation = useMutation(mutateCourse(slug), {
    onMutate: async (updatedCourse) => {
      console.log('updatedCourse', updatedCourse);
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries('enrollments');
      // Snapshot the previous value
      const previousEnrollments = queryClient.getQueryData('enrollments');
      // Optimistically update to the new value
      queryClient.setQueryData('enrollments', (old) => {
        // console.log('old', old);
        if (old) {
          return [
            ...old.map((enrollment) =>
              enrollment.id === updatedCourse.id ? updatedCourse : enrollment
            ),
          ];
        }
        return [];
      });
      // Return a context object with the snapshotted value
      return { previousEnrollments };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newGrade, context) => {
      queryClient.setQueryData('enrollments', context.previousEnrollments);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('enrollments');
    },
  });

  if (!!slug && isLoading) {
    return (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  const verb = selectedCourse ? 'Edit' : 'Create';

  const editCourse = (ev) => {
    courseMutation.mutate({
      name,
      start_date: startDate,
      end_date: endDate,
    });
  };

  const addCourse = (ev) => {
    // don't refresh the page
    ev.preventDefault();
    ev.stopPropagation();
    if (slug) {
      // we're editing!
      console.log('editing course');
      return editCourse(ev);
    }
    console.log('addCourse ev', ev);

    return dispatch(
      newCourse({
        name,
        startDate,
        endDate,
        token: userInfo.token,
        userId: userInfo.id,
      })
    ).then((newSlug) => {
      router.push(`/courses/${newSlug}/edit`);
    });
  };
  return (
    <div className="my-5">
      <h2>{verb} Course</h2>
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
              onChange={(ev) => {
                console.log('setName');
                setName(ev.target.value);
              }}
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
              placeholder="Start Date"
              value={startDate}
              onChange={(ev) => {
                console.log('setStartDate');
                setStartDate(ev.target.value);
              }}
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
              onChange={(ev) => {
                console.log('setEndDate');
                setEndDate(ev.target.value);
              }}
            />
          </Col>
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
