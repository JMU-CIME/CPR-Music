import Badge from 'react-bootstrap/Badge';

export default function TranspositionBadge({ instrument, transposition }) {
  const transpositionMap = {
    'F': {bg: 'primary', text:'white'},
    'Eb': {bg: 'secondary', text:'white'},
    'Concert Pitch TC 8va': {bg: 'success', text:'white'},
    'Concert Pitch TC': {bg: 'danger', text:'white'},
    'Concert Pitch BC 8vb': {bg: 'warning', text:'dark'},
    'Concert Pitch BC': {bg: 'info', text:'white'},
    'Bb': {bg: 'light', text:'dark'},
    'Alto Clef': {bg: 'dark', text:'white'},
  }
  const colors = transpositionMap[transposition]
  return <Badge bg={colors.bg} text={colors.text}>{instrument}</Badge>
}