
import * as z from "zod";
import { isValidPhoneNumber } from 'react-phone-number-input';

export const signupSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  phoneNumber: z.string().refine((phone) => {
    if (!phone) return false;
    return isValidPhoneNumber(phone);
  }, "Veuillez entrer un numéro de téléphone valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
  // Company information fields
  siren: z.string().min(9, "Le SIREN doit contenir exactement 9 chiffres").max(9, "Le SIREN doit contenir exactement 9 chiffres"),
  companyName: z.string().min(2, "La raison sociale est requise"),
  legalForm: z.string().min(1, "La forme juridique est requise"),
  siret: z.string().min(14, "Le SIRET doit contenir exactement 14 chiffres").max(14, "Le SIRET doit contenir exactement 14 chiffres"),
  vatNumber: z.string().min(1, "Le numéro de TVA est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  postalCode: z.string().min(5, "Le code postal doit contenir 5 chiffres").max(5, "Le code postal doit contenir 5 chiffres"),
  city: z.string().min(1, "La ville est requise"),
  nafCode: z.string().min(1, "Le code NAF est requis"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type SignupFormValues = z.infer<typeof signupSchema>;
