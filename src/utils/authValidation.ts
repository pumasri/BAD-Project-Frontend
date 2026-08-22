export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 128;

export function isAuEmail(email: string) {
  return /^[^\s@]+@au\.edu$/i.test(email.trim());
}

export function isAuStudentEmail(email: string) {
  return /^u\d{7}@au\.edu$/i.test(email.trim());
}

export function isValidPassword(password: string) {
  return password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH;
}
