import { Country } from './country.model';

export interface Address {
  id: number;
  address: string;
  city: string;
  postalCode: string;
  country: Country;
  createdAt: Date;
  updatedAt: Date;
}
