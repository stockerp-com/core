import { router } from '../../trpc.js';
import { changePasswordHandler } from './handlers/change-password.js';
import { refreshTokensHandler } from './handlers/refresh-tokens.handler.js';
import { signInHandler } from './handlers/sign-in.handler.js';
import { signOutHandler } from './handlers/sign-out.handler.js';
import { signUpHandler } from './handlers/sign-up.handler.js';

export const authRouter = router({
  signIn: signInHandler,
  signOut: signOutHandler,
  signUp: signUpHandler,
  refreshTokens: refreshTokensHandler,
  changePassword: changePasswordHandler,
});
