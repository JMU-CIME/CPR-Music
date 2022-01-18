import { useSelector } from 'react-redux';
import Layout from '../../components/layout';

function EditCourse() {
  const pieces = useSelector((state) => state.pieces);
  return (
    <Layout>
      <h1>Edit Course</h1>
      <h2>People</h2>
      <p>Need to be able to upload roster here...</p>
      <h2>Pieces</h2>
      <p>(Like for adding new pieces to the course)</p>
      <p>
        (probably should be 2 lists, those already assigned/added and those
        available to add)
      </p>
      <ul>
        {pieces.loaded &&
          pieces.items &&
          pieces.map((piece) => <li key={piece.id}>{piece.name}</li>)}
      </ul>
    </Layout>
  );
}

export default EditCourse;
