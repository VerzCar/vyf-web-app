import { Address } from './address.model';
import { Contact } from './contact.model';
import { Gender } from './gender.model';
import { Profile } from './profile.model';

export interface User {
    id: number;
    identityId: string;
    username: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    address?: Address;
    contact?: Contact;
    profile: Profile;
    createdAt: Date;
    updatedAt: Date;
}
