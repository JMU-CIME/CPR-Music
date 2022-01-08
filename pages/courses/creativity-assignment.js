import dynamic from "next/dynamic";
import Authorized from "../../components/authorized"
const FlatEditor = dynamic(() => import("../../components/flatEditor"), {
  ssr: false,
});

const CreativityAssignment = () => {
  return (
    <Authorized>

      <h1>Creativity Assignment</h1>
      <p>Path here should maybe be like course/slug/piece/slug/Creativity?</p>
      <p>
        This should be the page for completing/resubmitting this assignment type
        for the specific piece
      </p>
      <FlatEditor />      
    </Authorized>
  );
};

export default CreativityAssignment;
