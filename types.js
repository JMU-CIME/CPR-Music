export const SELECT_COURSE = 'SELECT_COURSE';

export const Action = Object.freeze({
  GotEnrollments: 'GotEnrollments',
  NewEnrollment: 'NewEnrollment',
  AddedRoster: 'AddedRoster',
  GotInstruments: 'GotInstruments',
  GotRoster: 'GotRoster',
  UpdatedEnrollmentInstrument: 'UpdatedEnrollmentInstrument',
  GotAssignments: 'GotAssignments',
  LoggedOut: 'LoggedOut',
  GotActivities: 'GotActivities',
  GotPieces: 'GotPieces',
  AssignedPiece: 'AssignedPiece',
  UnassignedPiece: 'UnassignedPiece',
  HaveUser: 'HaveUser',
  GotProfile: 'GotProfile',
  SelectedEnrollment: 'SelectedEnrollment',
  SelectedAssignment: 'SelectedAssignment',
  GotSingleAssignment: 'GotSingleAssignment',
  SetInstrumentActive: 'SetInstrumentActive',
  SetPieceChangeState: 'SetPieceChangeState',
});

export const ActivityState = Object.freeze({
  Inactive: 'Inactive',
  Active: 'Active',
  Erroneous: 'Erroneous',
  Success: 'Success',
});
