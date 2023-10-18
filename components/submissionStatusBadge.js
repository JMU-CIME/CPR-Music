import Badge from 'react-bootstrap/Badge';

export default function SubmissionsStatusBadge({ assn }) {
  const statusMap = {
    todo: { bg: 'danger', text: 'white', content: 'todo' },
    done: { bg: 'success', text: 'white', content: 'done' },
  };
  const status = assn?.submissions?.length > 0 ? 'done' : 'todo'

  const colors = statusMap[status]
  return <Badge bg={colors.bg} text={colors.text}>{colors.content}</Badge>
}