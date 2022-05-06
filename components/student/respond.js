import RTE from "../teacher/grade/rte";

export default function RespondActivity() {
  return <>
    <textarea name="response" id="response" rows="10" style={{width: '100%'}}/>
    <RTE submission={{}}/>
    </>
}