
import * as Yup from 'yup';


export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email().required('Molimo vas unesite pravilan email.'),
  password: Yup.string()
    .required('Molimo vas unesite lozinku.'),
});

export const InviteUserDetailsSchema = Yup.object().shape({
    name: Yup.string()
    .required('Molimo vas unesite pravilan ime.'),
    email: Yup.string()
    .email().required('Molimo vas unesite pravilan email.'),
    phone: Yup.string()
    .min(6, 'Minimalno 6 brojeva.')
    .required('Molimo vas unesite broj telefona.'),
});

export const DriverSchema = Yup.object().shape({
  name: Yup.string()
    .required('Molimo vas unesite pravilan email.'),
  password: Yup.string()
    .required('Molimo vas unesite lozinku.'),
  phone: Yup.string()
    .min(6, 'Minimalno 6 brojeva.')
    .required('Molimo vas unesite broj telefona.'),
});


export const FirmRegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Molimo vas unesite pravilan ime.'),
  email: Yup.string()
    .email().required('Molimo vas unesite pravilan email.'),
  phone: Yup.string()
    .min(6, 'Minimalno 6 brojeva.')
    .required('Molimo vas unesite broj telefona.'),
  password: Yup.string()
    .required('Molimo vas unesite lozinku.'),
});


export const AddVehicleSchema = Yup.object().shape({
  vehicleTypeId: Yup.string()
    .required('Tip vozila je obavezan.'),
  licensePlate: Yup.string()
    .required('Registarska tablica je obavezan.')
    .min(7, 'Registarska tablica mora imati najmanje 7 karaktera.')
    .max(7, 'Registarska tablica mora imati najviše 7 karaktera.'),
});

export const AddCargoSchema = Yup.object().shape({
  goodsTypeId: Yup.string()
    .required('Vrsta tereta je obavezna.'),
  weight: Yup.number()
    .moreThan(0, 'Neto težina tereta mora biti veća od 0.')
    .required('Neto težina je obavezna.'),
});

export const PriceDetailsShema = Yup.object().shape({
  customPrice: Yup.number()
    .required('Unesite cenu.'),
  customPricePerUnit: Yup.number()
    .required('Unesite cenu.'),
  method: Yup.string()
    .required('Način plaćanja je obavezan.'),
});

export const AddDriverSchema = Yup.object().shape({
  name: Yup.string()
    .required('Molimo vas unesite puno ime i prezime.'),
  pin: Yup.string()
    .min(4, 'Minimalno 4 brojeva.')
    .max(4, 'Maximalno 4 brojeva.')
    .required('Molimo vas unesite pin.'),
  phone: Yup.string()
    .min(6, 'Minimalno 6 brojeva.')
    .required('Molimo vas unesite broj telefona.'),
});

export const AddGroupSchema = Yup.object().shape({
  name: Yup.string()
    .required('Molimo vas unesite ime.'),
  description: Yup.string()
    .required('Molimo vas unesite Opis.')
});


export const CompanyDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .required('Naziv firme je obavezan'),
  registrationNumber: Yup.string()
    .min(8, 'Minimalno 8 brojeva.')
    .max(8, 'Maximalno 8 brojeva.')
    .required('PIB je obavezan.'),
  taxpayerRegisterNumber: Yup.string()
    .min(9, 'Minimalno 9 brojeva.')
    .max(9, 'Maximalno 9 brojeva.')
    .required('Telefon broj je obavezan.'),
  address: Yup.string()
    .required('Adresa je obavezna.'),
  city: Yup.string()
    .required('Grad je obavezan'),
  country: Yup.string()
    .required('Drzava je obavezna.'),
  phoneNumber: Yup.string()
    .required('Molimo vas unesite lozinku.'),
  email: Yup.string()
    .email().required('Molimo vas unesite pravilan email.'),
});