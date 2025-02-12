
export interface Candidate {
    cdm_id: string;
    cdm_emp_id: string;
    cdm_name: string;
    cdm_email: string;
    cdm_phone: string;
    cdm_location: string;
    cdm_profile: File;
    cdm_description: string;
    cdm_csm_id: string;
    cdm_keywords: string;
    cdm_isinternal: boolean;
    cdm_isactive: boolean;
    emp_insertdate: string;
    emp_insertby: string;
    emp_updatedate: string;
    emp_updateby: string;
  }