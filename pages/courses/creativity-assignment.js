import dynamic from 'next/dynamic';
import Layout from '../../components/layout';

const FlatEditor = dynamic(() => import('../../components/flatEditor'), {
  ssr: false,
});

function CreativityAssignment() {
  return (
    <Layout>
      <h1>Creativity Assignment</h1>
      <p>Path here should maybe be like course/slug/piece/slug/Creativity?</p>
      <p>
        This should be the page for completing/resubmitting this assignment type
        for the specific piece
      </p>
      <FlatEditor edit />
    </Layout>
  );
}

export default CreativityAssignment;
