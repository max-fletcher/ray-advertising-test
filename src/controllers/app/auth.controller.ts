import { CustomException } from '../../errors/CustomException.error';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { AuthService } from '../../services/app/auth.services';
import { Request, Response } from 'express';
import { UnauthorizedException } from '../../errors/UnauthorizedException.error';
import { AppAuthenticatedRequest } from 'types/authenticate.type';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { UserClient } from '../../db/clients/postgres.client';
import { ValidationException } from '../../errors/ValidationException.error';
import { capitalizeFirstLetter } from '../../utils/string.utils';
import { mapAppUserGenerateToken } from '../../mapper/user.mapper';

const jwtMiddleware = new JwtMiddleware();
const authService = new AuthService();

const sequelize = UserClient.getInstance();

export async function authenticateAppUser(req: Request, res: Response) {
  const transaction = await sequelize.transaction();
  try {
    const authUser = await authService.loginWithPhone(req.body.phone, transaction);

    if (authUser.authenticated && authUser.data) {
      const { token, validity } = jwtMiddleware.generateAppUserToken(
        mapAppUserGenerateToken(
          authUser.data.id,
          authUser.data.name!,
          authUser.data.username,
          authUser.data.email,
          authUser.data.phone,
          authUser.data.whatsapp_no,
          authUser.data.verified!,
          authUser.data.guest!,
        )
      );

      return res.json({
        data: {
          auth: {
            jwt: token,
            validity: validity,
          },
          userInfo: {
            id: authUser.data.id,
            name: authUser.data.name,
            username: authUser.data.username,
            email: authUser.data.email,
            phone: authUser.data.phone,
            whatsapp_no: authUser.data.whatsapp_no,
            avatar_url: authUser.data.avatar_url,
            country: authUser.data.country,
            currency: authUser.data.currency,
            status: authUser.data.status,
            verified: authUser.data.verified,
            guest: authUser.data.guest,
            createdAt: authUser.data.createdAt,
          },
          balance: {
            cash_balance: Number(authUser.data.balance.cash_balance),
            coin_balance: Number(authUser.data.balance.coin_balance)
          },
          tier: authUser.data.tier,
        },
        statusCode: 200,
      });
    }

    throw new UnauthorizedException(authUser.message!);
  } catch (e: any) {
    await transaction.rollback();

    if (e.constructor.name === 'RestException') {
      return res.status(500).json({
        error: {
          message: 'Failed to send OTP. Please try again.',
        },
        code: 500,
      });
    }

    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function usernameExists(req: AppAuthenticatedRequest, res: Response) {
  try {
      const exists = await authService.usernameExists(req.body, req.user!.id)

      if (exists)
        throw new ValidationException('This username has already been taken.');

    return res.json({
      data: {
        message: "This username is available.",
      },
      status_code : 200
    })
  } catch (e) {
    if (e instanceof CustomException) {
      return res
        .status(e.statusCode)
        .json({ 
          error:{
            message: e.message
          },
          code: e.statusCode 
        });
    }

    return res
      .status(500)
      .json({
        error:{
          message: 'Something went wrong! Please try again.',
        },
        code: 500 
      });
  }
}

export async function updateNameAndUsername(req: AppAuthenticatedRequest, res: Response) {
  try {
    const updated = await authService.updateNameAndUsername(req.body, req.user!.id)

    if(!updated)
      throw new CustomException('Failed to update name and username. Please try again.', 500)

    if (updated.authenticated && updated.data) {
      const { token, validity } = jwtMiddleware.generateAppUserToken(
        mapAppUserGenerateToken(
          updated.data.id,
          updated.data.name!,
          updated.data.username,
          updated.data.email,
          updated.data.phone,
          updated.data.whatsapp_no,
          updated.data.verified!,
          updated.data.guest!,
        )
      );

      return res.json({
        data: {
          auth: {
            jwt: token,
            validity: validity,
          },
          userInfo: {
            id: updated.data.id,
            name: updated.data.name,
            username: updated.data.username,
            email: updated.data.email,
            phone: updated.data.phone,
            whatsapp_no: updated.data.whatsapp_no,
            avatar_url: updated.data.avatar_url,
            country: updated.data.country,
            currency: updated.data.currency,
            status: updated.data.status,
            verified: updated.data.verified,
            guest: updated.data.guest,
            createdAt: updated.data.createdAt,
          },
          balance: {
            cash_balance: Number(updated.data.balance.cash_balance),
            coin_balance: Number(updated.data.balance.coin_balance)
          },
          tier: updated.data.tier,
        },
        statusCode: 200,
      });
    }

    throw new UnauthorizedException(updated.message!);
  } catch (e) {
    if (e instanceof CustomException) {
      return res
        .status(e.statusCode)
        .json({ 
          error:{
            message: e.message
          },
          code: e.statusCode 
        });
    }

    return res
      .status(500)
      .json({
        error:{
          message: 'Something went wrong! Please try again.',
        },
        code: 500 
      });
  }
}

export async function verifyOTP(req: AppAuthenticatedRequest, res: Response) {
  try {
    const channel = req.params.channel ?? 'phone';
    if(channel !== 'phone' && channel !== 'email' && channel !== 'whatsapp')
      throw new BadRequestException('Invalid channel!');

    let to;
    switch (channel) {
      case 'phone':
        {
          to = req.user!.phone;
        }
        break;
      case 'email':
        {
          to = req.user!.email;
          if(!to)
            throw new BadRequestException('Email not set. Please set email and try again.');
        }
        break;
      case 'whatsapp':
        {
          to = req.user!.whatsapp_no;
          if(!to)
            throw new BadRequestException('Whatsapp no. not set. Please set Whatsapp no. and try again.');
        }
        break;
    }

    const verified = await authService.verifyOTP(to!, req.body.otp, req.user!.id);

    if (!verified)
      throw new CustomException(
        'Verification failed! Please resend OTP and try again.',
        500,
      );

    if(typeof verified === 'boolean' && verified)
      return res.json({
        data: {
          message: 'OTP verified. You may proceed.',
        },
        status_code: 200,
      });

    if(typeof verified === 'boolean' && !verified)
      throw new CustomException('Verification failed. Please try again.', 500);

    const { token, validity } = jwtMiddleware.generateAppUserToken(
      mapAppUserGenerateToken(
        verified.id,
        verified.name,
        verified.username,
        verified.email,
        verified.phone,
        verified.whatsapp_no,
        verified.verified,
        verified.guest,
      )
    );

    res.json({
      data: {
        auth: {
          jwt: token,
          validity: validity,
        },
        message: 'OTP verified. You may proceed.',
      },
      statusCode: 200,
    });

    // if(!loggedInUser.otp && !loggedInUser.otp_expires_at)
    //   throw new UnauthorizedException('OTP not set! Please resend OTP and try again.')

    // if(loggedInUser.otp !== req.body.otp)
    //   throw new UnauthorizedException('OTP mismatch!')

    // if expiration date is less than current date
    // if(datetimeYMDHis(loggedInUser.otp_expires_at) < datetimeYMDHis())
    //   throw new UnauthorizedException('OTP expired! Please resend OTP and try again.')

    // await authService.nullifyUserOtp(req.user!.id);
  } catch (e: any) {
    if (e.constructor.name === 'RestException') {
      return res.status(500).json({
        error: {
          message: 'Failed to send OTP. Please try again.',
        },
        code: 500,
      });
    }

    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function resendOTP(req: AppAuthenticatedRequest, res: Response) {
  try {
    const resent = await authService.resendOtp(req.user!);

    if (resent)
      return res.json({
        data: {
          message: 'OTP resent. Check your messages.',
        },
        status_code: 200,
      });
  } catch (e: any) {
    if (e.constructor.name === 'RestException') {
      return res.status(500).json({
        error: {
          message: 'Failed to send OTP. Please try again.',
        },
        code: 500,
      });
    }

    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function sendOTPToWhatsappOrEmail(req: AppAuthenticatedRequest, res: Response) {
  try {
    const channel = req.params.channel;
    if(channel !== 'whatsapp' && channel !== 'email')
      throw new BadRequestException('Invalid verification channel!');

    if(channel === 'whatsapp' && !req.user?.whatsapp_no)
      throw new BadRequestException('Whatsapp no. not set. Please set Whatsapp no. and try again.');

    if(channel === 'email' && !req.user?.email)
      throw new BadRequestException('Email not set. Please set email and try again.');

    const sent = await authService.sendOTPToWhatsappOrEmail(req.user!, channel);

    if (sent)
      return res.json({
        data: {
          message: 'OTP sent. Check your messages.',
        },
        status_code: 200,
      });
  } catch (e: any) {
    if (e.constructor.name === 'RestException') {
      return res.status(500).json({
        error: {
          message: 'Failed to send OTP. Please try again.',
        },
        code: 500,
      });
    }

    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function socialLogin(req: AppAuthenticatedRequest, res: Response) {
  const transaction = await sequelize.transaction();
  try {
    const provider = req.params.provider;
    if (
      provider !== 'google' &&
      provider !== 'facebook' &&
      provider !== 'apple'
    )
      throw new BadRequestException('Invalid provider!');

    const idToken = req.headers.idtoken as string;

    if (!idToken)
      return res
        .status(401)
        .json({ message: `${capitalizeFirstLetter(provider)} token missing! Please try again.` });

    switch (provider) {
      case 'google':
        {
          const verified = await authService.checkGoogleAuth(idToken);
          if (!verified)
            throw new UnauthorizedException(
              'Google verification failed. Please try again.',
            );
        }
        break;
      case 'facebook':
        console.log('Logic for facebook verification');
        break;
      case 'apple':
        console.log('Logic for apple verification');
        break;
      default:
        throw new UnauthorizedException(
          `${capitalizeFirstLetter(provider)} verification failed. Please try again.`,
        );
    }

    const authUser = await authService.loginSocialUser(
      provider,
      req.body.user,
      transaction,
    );

    if (!authUser.authenticated || !authUser.data)
      throw new UnauthorizedException(authUser.message!);

    const { token, validity } = jwtMiddleware.generateAppUserToken(
      mapAppUserGenerateToken(
        authUser.data.id,
        authUser.data.name!,
        authUser.data.username,
        authUser.data.email,
        authUser.data.phone,
        authUser.data.whatsapp_no,
        authUser.data.verified!,
        authUser.data.guest!,
      )
    );

    res.json({
      data: {
        auth: {
          jwt: token,
          validity: validity,
        },
        userInfo: {
          id: authUser.data.id,
          name: authUser.data.name,
          username: authUser.data.username,
          email: authUser.data.email,
          phone: authUser.data.phone,
          whatsapp_no: authUser.data.whatsapp_no,
          avatar_url: authUser.data.avatar_url,
          country: authUser.data.country,
          currency: authUser.data.currency,
          status: authUser.data.status,
          verified: authUser.data.verified,
          guest: authUser.data.guest,
          createdAt: authUser.data.createdAt,
        },
        balance: {
          cash_balance: Number(authUser.data.balance.cash_balance),
          coin_balance: Number(authUser.data.balance.coin_balance)
        },
        tier: authUser.data.tier,
      },
      statusCode: 200,
    });
  } catch (e) {
    console.log('Social login error: ', e);
    await transaction.rollback();

    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
        error: e
      },
      code: 500,
    });
  }
}
