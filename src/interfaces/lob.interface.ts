interface EmployeeRef {
    emp_name: string;
    emp_id: string;
    emp_uniqueid: string,
    emp_email: string,
    emp_phone: string,
    emp_location:string

  }

export interface LOB {
    lob_name: string;
    lob_description: string;
    lob_clientpartner: EmployeeRef;
    lob_deliverymanager: EmployeeRef;
    lob_insertby_id: EmployeeRef;
    lob_updateby_id: EmployeeRef;
    lob_insertdate: Date;
    lob_updatedate: Date;
}