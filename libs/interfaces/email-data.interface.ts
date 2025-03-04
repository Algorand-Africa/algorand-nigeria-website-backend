import { BADGE_HIERARCHY } from 'libs/enums';

export interface EmailData {
  name?: string;
  link?: string;
  date?: string;
}

export interface TeamPlayerBadgeEmailData extends EmailData {
  designation: BADGE_HIERARCHY;
  value: string;
}

export interface ScholarBadgeEmailData extends EmailData {
  designation: BADGE_HIERARCHY;
  curriculumName: string;
}

export interface AchieverBadgeEmailData extends EmailData {
  value: string;
  designation: BADGE_HIERARCHY;
}

export interface ProblemSolverBadgeEmailData extends EmailData {
  value: string;
  designation: BADGE_HIERARCHY;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DabblerBadgeEmailData extends EmailData {}

export interface ExplorerBadgeEmailData extends EmailData {
  designation: BADGE_HIERARCHY;
}

export interface TeamLeaderBadgeEmailData extends EmailData {
  designation: BADGE_HIERARCHY;
  value: string;
}

export interface CompanyInterestEmailData extends EmailData {
  companyName: string;
}

export interface TalentResponseEmailData extends EmailData {
  companyName: string;
  talentName: string;
}

export interface ScheduleInterviewEmailData extends EmailData {
  companyName: string;
}
