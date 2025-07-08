import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { Response } from 'express';
import { TierService } from '../../services/tier.services';
import { StripeService } from '../../services/stripe.services';
import { getEnvVar } from '../../utils/common.utils';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { AppUserBalanceService } from '../../services/app-user-balance.services';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { CustomException } from '../../errors/CustomException.error';
import { formatGetAllTiers, formatPackagePageData, formatSingleTier, formatUserActiveTiers } from '../../formatter/tier.formatter';
import { stripePaymentType } from '../../constants/enums';

const tierService = new TierService();
const appUserBalanceService = new AppUserBalanceService();
const stripeService = new StripeService();

export async function getAllTiers(req: AppAuthenticatedRequest, res: Response) {
  try{
    const allTiersData = await tierService.getAllTiers(['id', 'name', 'price', 'duration', 'coins_rewarded', 'perks', 'exclusive_access', 'exclusive_perks']);

    const allTiers = formatGetAllTiers(allTiersData);

    return res.json({
      data:{
        tiers: allTiers
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

export async function getSingleTierById(req: AppAuthenticatedRequest, res: Response) {
  try{
    const tierId = req.params.id
    if(!tierId)
      throw new BadRequestException('Tier id not given !');

    const tierData = await tierService.getTierById(tierId, ['id', 'name', 'price', 'duration', 'coins_rewarded', 'perks', 'exclusive_access', 'exclusive_perks']);
    if(!tierData)
      throw new NotFoundException('Tier with this id not found !');

    const tier = formatSingleTier(tierData);

    return res.json({
      data:{
        tier: tier
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

export async function getUserActiveTiers(req: AppAuthenticatedRequest, res: Response) {
  try {
    const appUserBalance = await appUserBalanceService.findAppUserBalanceByUserId(req.user!.id, ['cash_balance']);

    const tierData = await tierService.getUserSubscribedTiers(req.user!.id);
    const userTiers = formatUserActiveTiers(tierData)
  
    return res.json({
      data:{
        user_cash_balance: appUserBalance.coin_balance,
        user_tiers: userTiers,
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

export async function purchaseTier(req: AppAuthenticatedRequest, res: Response) {
  try {
    const tierId = req.body.tier_id

    const tier = await tierService.getTierById(tierId);
    if(!tier)
      throw new NotFoundException('Tier not found!');
  
    // # Remove later if client wants auto-renewal on
    req.body.auto_renewal = false
  
    const additionalData = { userId: req.user!.id, paymentType: stripePaymentType.TierSubscription, tierId: tier.id, autoRenewal: req.body.auto_renewal ? 'yes' : 'no' };
    const priceId = req.body.auto_renewal ? tier.stripe_price_id_recurring : tier.stripe_price_id_single;
    const redirectBaseUrl = getEnvVar('STRIPE_REDIRECT_BASE_URL');
    const session = await stripeService.createCheckoutSession(req.user!, priceId, redirectBaseUrl, additionalData, req.body.auto_renewal);
  
    return res.json({
      data:{
        message: 'Checkout generated.',
        stripe_session: session
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

export async function getPackagePageData(req: AppAuthenticatedRequest, res: Response) {
  try {
    const packagePageData = await tierService.getPackagePageData(req.user!.id);
    const getAllTiers =  await tierService.getAllTiers(['id', 'name', 'order']);
    const memoizedAllTiers: any = {}
    getAllTiers.map((tier) => memoizedAllTiers[tier.order] = tier.id)
    const formattedPackagePageData = formatPackagePageData(packagePageData, memoizedAllTiers)

    return res.json({
      data: {
        package_page_data: formattedPackagePageData,
      },
      status_code: 200
    })
  } catch (e) {
    if (e instanceof CustomException) {
      return res
        .status(e.statusCode)
        .json({ 
          error:{
            message: e.message
          },
          status_code: e.statusCode
        });
    }

    return res
      .status(500)
      .json({
        error:{
          message: 'Something went wrong! Please try again.',
        },
        status_code: 500
      });
  }
}