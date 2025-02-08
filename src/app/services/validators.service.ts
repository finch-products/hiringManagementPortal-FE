import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }
  // Pattern for general text with alphanumeric characters, spaces, and special characters
  generalPattern() {
    return "^(?=.*[a-zA-Z0-9])[a-zA-Z0-9 !@#$%^&*()-_+=?<>]*$"
}

// Pattern for a field that allows letters, numbers, spaces, newlines, and special characters
detailPattern() {
    return "^[a-zA-Z0-9 !@#$%^&*()-_+=?<>\\n]*$"; 
}

// pattern for phone number
phonePattern(){
    return "^[6-9][0-9]{9}$"
}

namePattern(){

    return "^[A-Za-z.]+(?: [A-Za-z.]*)*\s*$";

}
}
