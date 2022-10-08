import { FaCheck, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { UploadStatusEnum } from '../types';

export default function StatusIndicator({statusId}) {
  const { submissions } = useSelector((state) => state.submission);

  const status = submissions[statusId];

  return (
    /* eslint-disable no-nested-ternary */
    status === UploadStatusEnum.Active ? (
      <FaSpinner
        className={
          status === UploadStatusEnum.Active ? 'fa-spin' : 'hiding'
        }
      />
    ) : status === UploadStatusEnum.Erroneous ? (
      <FaTimesCircle
        className={
          status === UploadStatusEnum.Erroneous ? 'show-out' : 'hiding'
        }
      />
    ) : status === UploadStatusEnum.Success ? (
      <FaCheck
        className={
          status === UploadStatusEnum.Success ? 'show-out' : 'hiding'
        }
      />
    ) : null
  );
}
