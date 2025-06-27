import { router } from './trpc';
import hiProcedure from './routes/example/hi/route';
import sessionProcedure from './routes/auth/session/route';
import userProcedure from './routes/auth/user/route';
import listDonationsProcedure from './routes/donations/list/route';
import getDonationProcedure from './routes/donations/get/route';
import createDonationProcedure from './routes/donations/create/route';
import listTasksProcedure from './routes/tasks/list/route';

export const appRouter = router({
  example: router({
    hi: hiProcedure,
  }),
  auth: router({
    session: sessionProcedure,
    user: userProcedure,
  }),
  donations: router({
    list: listDonationsProcedure,
    get: getDonationProcedure,
    create: createDonationProcedure,
  }),
  tasks: router({
    list: listTasksProcedure,
  }),
});

export type AppRouter = typeof appRouter;