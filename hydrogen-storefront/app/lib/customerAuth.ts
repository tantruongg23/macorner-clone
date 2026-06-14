import type {HydrogenSession} from '@shopify/hydrogen';

const TOKEN_KEY = 'customerAccessToken';
const EXPIRES_KEY = 'customerAccessTokenExpiresAt';
const FIRST_NAME_KEY = 'customerFirstName';

/** Returns the stored customer access token, or null if missing/expired. */
export function getCustomerAccessToken(session: HydrogenSession): string | null {
  const token = session.get(TOKEN_KEY) as string | undefined;
  const expiresAt = session.get(EXPIRES_KEY) as string | undefined;
  if (!token || !expiresAt) return null;
  if (new Date(expiresAt).getTime() <= Date.now()) return null;
  return token;
}

export function getCustomerFirstName(session: HydrogenSession): string | null {
  return (session.get(FIRST_NAME_KEY) as string | undefined) ?? null;
}

export function setCustomerSession(
  session: HydrogenSession,
  customerAccessToken: {accessToken: string; expiresAt: string},
  firstName?: string | null,
) {
  session.set(TOKEN_KEY, customerAccessToken.accessToken);
  session.set(EXPIRES_KEY, customerAccessToken.expiresAt);
  if (firstName) {
    session.set(FIRST_NAME_KEY, firstName);
  } else {
    session.unset(FIRST_NAME_KEY);
  }
}

export function clearCustomerSession(session: HydrogenSession) {
  session.unset(TOKEN_KEY);
  session.unset(EXPIRES_KEY);
  session.unset(FIRST_NAME_KEY);
}
