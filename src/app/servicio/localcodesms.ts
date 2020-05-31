export interface Localcodesms {
 
    token: string;
    user: User;
    sip: SIP;
}

export interface SIP {
    username: string;
    uipass: string;
    credit: string;
}

export class User {
    name: string;
    phone: string;
    address: null;
    birthdate: null;
    email: string;
    country_code: null;
}
export interface Password {
   email: string;
}

export interface ChangePass {
    email: string;
    code: string;
    password_new: string;
    password_confirmed: string;
 }
 export interface HistoryCall {
    email: string;
    code: string;
    password_new: string;
    password_confirmed: string;
 }