import {
  BrowserCacheLocation,
  PublicClientApplication,
} from '@azure/msal-browser';

const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID?.trim();
const tenantId = import.meta.env.VITE_MICROSOFT_TENANT_ID?.trim();

export function isMicrosoftAuthConfigured() {
  return Boolean(clientId && tenantId);
}

let applicationPromise: Promise<PublicClientApplication> | null = null;

async function getMicrosoftApplication() {
  if (!clientId || !tenantId) {
    throw new Error('Microsoft authentication is not configured yet.');
  }

  if (!applicationPromise) {
    applicationPromise = (async () => {
      const application = new PublicClientApplication({
        auth: {
          clientId,
          authority: `https://login.microsoftonline.com/${tenantId}`,
          redirectUri: window.location.origin,
        },
        cache: {
          cacheLocation: BrowserCacheLocation.MemoryStorage,
        },
      });
      await application.initialize();
      return application;
    })();
  }

  return applicationPromise;
}

export async function getMicrosoftIdentityToken() {
  const application = await getMicrosoftApplication();
  const result = await application.loginPopup({
    scopes: ['openid', 'profile', 'email'],
    prompt: 'select_account',
  });

  if (!result.idToken) {
    throw new Error('Microsoft did not return a verified identity token.');
  }

  return result.idToken;
}
