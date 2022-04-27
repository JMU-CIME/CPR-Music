import Badge from 'react-bootstrap/Badge';

export default function TranspositionBadge({ instrument }) {
  const transpositionMap = {
    'F': 'primary',
    'Eb': 'secondary',
    'Concert Pitch TC 8va': 'success',
    'Concert Pitch TC': 'danger',
    'Concert Pitch BC 8vb': 'warning',
    'Concert Pitch BC': 'info',
    'Bb': 'light',
    'Alto Clef': 'dark',
  }
  const bg = transpositionMap[instrument.transposition]
  return <Badge bg={bg} text={bg === 'light' ? 'dark' : 'light'}>{instrument.name}</Badge>
}