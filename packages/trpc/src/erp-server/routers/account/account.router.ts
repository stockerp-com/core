import { router } from '../../trpc.js';
import { editProfileHandler } from './handlers/edit-profile.handler.js';

export const accountRouter = router({
  // Handlers:
  editProfile: editProfileHandler,
});
