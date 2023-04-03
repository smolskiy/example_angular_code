import { ISelectItem, ITableColumnData } from '@shared/models';
import { Statuses } from '@constants';
import { SubmissionKeys } from '../../submission/models';

export const SETTINGS_COLUMNS_TABLE: ITableColumnData[] = [
  {
    key: 'name',
    title: 'T_TABLE.ORGANIZATION_NAME',
    sorting: true,
  },
  {
    key: 'contractStartDate',
    title: 'T_TABLE.CONTRACT_START_DATE',
    sorting: true,
  },
  {
    key: 'contractEndDate',
    title: 'T_TABLE.CONTRACT_END_DATE',
    sorting: true,
  },
  {
    key: 'contractType',
    title: 'T_TABLE.TYPE_OF_CONTRACT',
    sorting: false,
  },
  {
    key: 'status',
    title: 'T_TABLE.PAYMENT_STATUS',
    sorting: false,
  },
  {
    key: 'totalSeatLicenses',
    title: 'T_TABLE.TOTAL_SEAT_LICENSES',
    sorting: true,
  },
];

export const ORGANIZATION_INFO_TABLE_COLUMNS: ITableColumnData[] = [
  { key: 'firstName', title: 'T_TABLE.FIRST_NAME', sorting: true },
  { key: 'lastName', title: 'T_TABLE.LAST_NAME', sorting: true },
  { key: 'role', title: 'T_TABLE.ROLE', sorting: true },
  { key: 'email', title: 'T_TABLE.EMAIL', sorting: true },
  { key: 'phoneNumber', title: 'T_TABLE.PHONE_NUMBER', sorting: true },
];

export const SUBMISSION_TABLE_COLUMNS: ITableColumnData[] = [
  {
    key: SubmissionKeys.SubmissionId,
    title: 'T_TABLE.SUBMISSION_ID',
    sorting: true,
  },
  {
    key: SubmissionKeys.Submitter,
    title: 'T_TABLE.SUBMITTER',
    sorting: true,
  },
  {
    key: SubmissionKeys.CreatedAt,
    title: 'T_TABLE.SUBMISSION_DATE',
    sorting: true,
  },
  {
    key: SubmissionKeys.Status,
    title: 'T_TABLE.APPROVAL_STATUS',
    sorting: false,
  },
  {
    key: SubmissionKeys.Amount,
    title: 'T_TABLE.TOTAL_AMOUNT',
    sorting: false,
  },
  {
    key: SubmissionKeys.Currency,
    title: 'T_TABLE.CURRENCY',
    sorting: false,
  },
];

export const STATUS_OPTIONS: ISelectItem[] = [
  {
    label: 'T_FILTER.STATUS',
    value: '',
  },
  {
    label: 'T_STATUSES.ACTIVE',
    value: Statuses.Active,
  },
  {
    label: 'T_STATUSES.SUSPENDED',
    value: Statuses.Suspended,
  },
  {
    label: 'T_STATUSES.DELETED',
    value: Statuses.Deleted,
  },
];

export const TYPE_OF_CONTRACT_OPTIONS: ISelectItem[] = [
  {
    label: 'T_FILTER.TYPE_OF_CONTRACT',
    value: '',
  },
  {
    label: 'T_PERIOD.YEARLY',
    value: 'Yearly',
  },
  {
    label: 'T_PERIOD.MONTHLY',
    value: 'Monthly',
  },
];

export const SUBMISSION_VERSION_TABLE_COLUMNS: ITableColumnData[] = [
  {
    key: 'version',
    title: 'T_TABLE.VERSION',
    sorting: true,
  },
  {
    key: 'date',
    title: 'T_TABLE.DATE_TIME',
    sorting: true,
  },
  {
    key: 'performedBy',
    title: 'T_TABLE.PERFORMED',
    sorting: false,
  },
  {
    key: 'field',
    title: 'T_TABLE.FIELD',
    sorting: false,
  },
  {
    key: 'previous',
    title: 'T_TABLE.PREVIOUS',
    sorting: false,
  },
  {
    key: 'changed',
    title: 'T_TABLE.CHANGED',
    sorting: false,
  },
  {
    key: 'comment',
    title: 'T_TABLE.COMMENT',
    sorting: false,
  },
];
