
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

export function formatNumber(number: number | null | undefined, decimals: number = 2): string {
  if (number === null || number === undefined || isNaN(Number(number))) return '-';
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
}

export function safeNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  
  // Si c'est déjà un nombre, le retourner
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  
  // Si c'est une chaîne, normaliser les virgules en points
  if (typeof value === 'string') {
    const normalized = value.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  // Pour tout autre type, essayer de convertir
  const parsed = parseFloat(String(value).replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
}
