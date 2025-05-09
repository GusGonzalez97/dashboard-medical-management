import { PatologySeverity } from "@/types/medical-record";
import { patologyList } from "../mocks/medical-records";

export const groupedPatologies = patologyList.reduce<Record<PatologySeverity, typeof patologyList>>((acc, pat) => {
    if (!acc[pat.severity]) acc[pat.severity] = [];
    acc[pat.severity].push(pat);
    return acc;
  }, {
    [PatologySeverity.LOW]: [],
    [PatologySeverity.MEDIUM]: [],
    [PatologySeverity.MEDIUMHIGH]: [],
    [PatologySeverity.HIGH]: [],
    [PatologySeverity.CRITICAL]: [],
  });

  export const severityOrder = [
    PatologySeverity.LOW,
    PatologySeverity.MEDIUM,
    PatologySeverity.MEDIUMHIGH,
    PatologySeverity.HIGH,
    PatologySeverity.CRITICAL,
  ];

