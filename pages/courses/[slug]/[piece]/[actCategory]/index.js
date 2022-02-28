import { useRouter } from "next/router";
import CreativityActivity from "../../../../../components/student/creativity";
import RespondActivity from "../../../../../components/student/respond";

export default function () {

  const router = useRouter();
  const { slug, piece, actCategory } = router.query;
  // TODO: branch on actCategory
  return actCategory === 'Create' ? <CreativityActivity/> : <RespondActivity/>
}