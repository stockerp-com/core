import { router } from '../../trpc.js';
import { changePasswordHandler } from './handlers/change-password.js';
import { refreshTokensHandler } from './handlers/refresh-tokens.handler.js';
import { signInHandler } from './handlers/sign-in.handler.js';
import { signOutHandler } from './handlers/sign-out.handler.js';
import { signUpHandler } from './handlers/sign-up.handler.js';
import { restorePasswordRouter } from './reset-password/reset-password.router.js';

export const authRouter = router({
  // Handlers:
  signIn: signInHandler,
  signOut: signOutHandler,
  signUp: signUpHandler,
  refreshTokens: refreshTokensHandler,
  changePassword: changePasswordHandler,
  // Routers:
  restorePassword: restorePasswordRouter,
});
