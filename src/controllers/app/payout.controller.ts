import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { PayoutService } from '../../services/app/payout.services';
import { formatPayoutRequests } from '../../formatter/payout-request.formatter';
import { PayoutRequestResponseType } from '../../types/payout-request.type';
import { AppUserBalanceService } from '../../services/app-user-balance.services';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { CurrencyData } from '../../types/currency.type';
import { CurrencyRepository } from '../../db/rdb/repositories/currency.repository';

const payoutService = new PayoutService();
const userBalanceService = new AppUserBalanceService();
const currencyRepository = new CurrencyRepository();

export async function getAppUserPayoutInfScroll(req: AppAuthenticatedRequest, res: Response) {
  try{
    const userBalance = await userBalanceService.findAppUserBalanceByUserId(req.user!.id, ['cash_balance'])

    const oldestPayoutReqId = req.body.oldest_payout_req_id ? (req.body.oldest_payout_req_id !== "" ? req.body.oldest_payout_req_id : null ) : null;
    const limit: number = 10;
    const payoutsData = await payoutService.getAppUserPayoutsInfScroll(req.user!.id, oldestPayoutReqId, limit);

    const formattedTransactions = formatPayoutRequests(payoutsData[1] as unknown as PayoutRequestResponseType[])

    return res.json({
      data:{
        available_payout: userBalance,
        next: Number(payoutsData[0]) > 0 ? payoutsData[0] : 0,
        sc_transactions: formattedTransactions,
      },
      status_code: 200
    });
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

export async function appUserPayoutRequestCheckValidity(req: AppAuthenticatedRequest, res: Response) {
  try{
    const userBalance = await userBalanceService.findAppUserBalanceByUserId(req.user!.id, ['cash_balance'])

    if(req.body.amount > userBalance.cash_balance)
      throw new BadRequestException('Amount exceeds your current balance. Please enter a lower amount.')

    return res.json({
      data:{
        message: 'Payout request is valid.',
      },
      status_code: 200
    });
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

export async function createAppUserPayoutRequest(req: AppAuthenticatedRequest, res: Response) {
  try{
    const userBalance = await userBalanceService.findAppUserBalanceByUserId(req.user!.id, ['cash_balance'])

    if(req.body.amount > userBalance.cash_balance)
      throw new BadRequestException('Amount exceeds your current balance. Please enter a lower amount.')

    const defaultCurrency: CurrencyData = await currencyRepository.findCurrencyByShortCode('AUD');

    await payoutService.appUserCreatePayoutRequest(req.user!.id, req.body, defaultCurrency.id);

    return res.json({
      data:{
        message: 'Payout request submitted successfully!',
      },
      status_code: 200
    });
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