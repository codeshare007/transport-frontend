export interface UserDetails {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface CompanyDetails {
  name: string;
  registrationNumber: string;
  taxpayerRegisterNumber: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  faxNumber: string;
  email: string;
  website: string;
}

export interface RegisterDataProps {
  userDetails: UserDetails;
  leadId: string;
  companyDetails?: CompanyDetails;
}
export interface LoginDetails {
  email: string;
  password: string;
  save: boolean;
}

export interface ForgotPassword {
  email: string;
}
