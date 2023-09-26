import { PhoneNumberCountry } from './phone-number-country.model';

export interface Contact {
  id: number;
  email: string;
  phoneNumber: string;
  phoneNumberCountry: PhoneNumberCountry;
  phoneNumber2: string;
  phoneNumber2Country: PhoneNumberCountry | null,
  web: string;
  createdAt: Date;
  updatedAt: Date;
}
