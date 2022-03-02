import makeRequired from '../middlewares/makeRequired';
import isAuth from '../middlewares/isAuth';
import { changePasswordController, loginController, signUpController } from '../controllers/auth';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', makeRequired(['email', 'password']), loginController);

authRouter.post('/signup', makeRequired(['fullName', 'email', 'password']), signUpController);

authRouter.post('/change-password', isAuth, makeRequired(['newPassword']), changePasswordController)


export default authRouter;