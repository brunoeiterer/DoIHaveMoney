import type { User } from "../../lib/types/User";

export interface AuthSession {
  accessToken: string | null;
  user: User | null;
}

let latestSession: AuthSession = { accessToken: null, user: null };
let reactStateUpdater: ((session: AuthSession) => void) | null = null;

export const getAccessToken = () => latestSession.accessToken;
export const getCurrentUser = () => latestSession.user;
export const setReactStateUpdater = (
  updater: ((session: AuthSession) => void) | null,
) => {
  reactStateUpdater = updater;
};

export const setAuthSession = (
  accessToken: string | null,
  user: User | null,
) => {
  latestSession = { accessToken, user };
  if (reactStateUpdater) {
    reactStateUpdater({ accessToken, user });
  }
};
