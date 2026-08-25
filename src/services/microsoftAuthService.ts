import { getMicrosoftLoginUrl } from './authService';

export function startMicrosoftLogin() {
  window.location.assign(getMicrosoftLoginUrl());
}
