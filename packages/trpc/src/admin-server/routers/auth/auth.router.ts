import { router } from '../../trpc.js';
import { logInHandler } from './handlers/log-in.handler.js';
import { logOutHandler } from './handlers/log-out.handler.js';

export const authRouter = router({
  logIn: logInHandler,
  logOut: logOutHandler,
});
