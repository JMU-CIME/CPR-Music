import { Spinner } from 'react-bootstrap';
import { FaCheck, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { UploadStatusEnum } from '../types';

export default function StatusIndicator({statusId}) {
  const { submissions } = useSelector((state) => state.submission);

  // console.log('statuses', submissions)
  const status = submissions?.[statusId];
  // console.log('status', status)
  return (
    /* eslint-disable no-nested-ternary */
    status === UploadStatusEnum.Active ? (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    ) : status === UploadStatusEnum.Erroneous ? (
      <FaTimesCircle className="show-out" />
    ) : status === UploadStatusEnum.Success ? (
      <FaCheck className="show-out" />
    ) : null
  );
}
