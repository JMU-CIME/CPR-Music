import { useSelector } from "react-redux";
import Authorized from "../../components/authorized"

const EditCourse = () => {
  const pieces = useSelector((state) => {
    return state.pieces
  })
  return <Authorized>
    <h1>Edit Course</h1>
    <h2>People</h2>
    <p>Need to be able to upload roster here...</p>
    <h2>Pieces</h2>
    <p>(Like for adding new pieces to the course)</p>
    <p>(probably should be 2 lists, those already assigned/added and those available to add)</p>
    <ul>
      {
        pieces.map((piece) => <li key={piece.id}>{piece.name}</li>)
      }
    </ul>
  </Authorized>;
};

export default EditCourse;
