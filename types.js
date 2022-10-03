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
  DidInstrument: 'DidInstrument',
  BeginUpload: 'BeginUpload',
  UploadSucceeded: 'UploadSucceeded',
  UploadFailed: 'UploadFailed',
});

export const ActivityState = Object.freeze({
  Inactive: 'Inactive',
  Active: 'Active',
  Erroneous: 'Erroneous',
  Success: 'Success',
});

export const UploadStatusEnum = Object.freeze({
  Inactive: 0,
  Active: 1,
  Success: 2,
  Erroneous: 3,
});
