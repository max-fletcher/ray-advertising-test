import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AuctionService } from '../../services/auction.services.';
import { CurrencyService } from '../../services/currency.services';
import { formatHomepageData } from '../../formatter/homepage.formatter';
import { THomepageAuctionBeforeFormatting } from '../../types/auction.type';
import { EducationalContentService } from '../../services/edu-content.services.';
import { THomepageEducationalContentBeforeFormatting } from '../../types/edu-content.types';
import { BlogService } from '../../services/blog.services';
import { THomepageBlogBeforeFormatting } from '../../types/blog.types';
import { ForumService } from '../../services/forum.services';
import { THomepageForumBeforeFormatting } from '../../types/forum.types';

// const appUserService = new AppUserService();
const auctionService = new AuctionService();
const currencyService = new CurrencyService();
const eduContentService = new EducationalContentService();
const blogService = new BlogService();
const forumService = new ForumService();

export async function getHomepageData(req: AppAuthenticatedRequest, res: Response) {
  try{
    const currency = await currencyService.findCurrencyByShortCode('AUD');
    const featuredAuctions = await auctionService.getFeaturedAuctionsForHomepageService('_id uniqueId currency_id title address entry_coins jackpot starting_bid image_url', 5) as unknown as THomepageAuctionBeforeFormatting[];
    const premiumEduContent = await eduContentService.getPremiumEduContentHomepageService('_id uniqueId category access_level content_type thumbnail_url title currency_id price coins_rewarded duration', 5) as unknown as THomepageEducationalContentBeforeFormatting[];
    const upcomingAuctions = await auctionService.getUpcomingAuctionsForHomepageService('_id uniqueId currency_id title address entry_coins jackpot starting_bid image_url', 5) as unknown as THomepageAuctionBeforeFormatting[];


    // # REPLACE OLD AFTER DEMO
    const homepageEduContentOld = await eduContentService.getEduContentHomepageServiceOld('_id uniqueId category tier_order access_level content_type thumbnail_url title currency_id price coins_rewarded duration', 5) as unknown as THomepageEducationalContentBeforeFormatting[];
    // const homepageEduContent = await eduContentService.getEduContentHomepageService('_id uniqueId category tier_order access_level content_type thumbnail_url title currency_id price coins_rewarded duration', 5) as unknown as THomepageEducationalContentBeforeFormatting[];


    const homepageBlogs = await blogService.getFeaturedBlogs('_id uniqueId title thumbnail_image read_duration createdAt', 5) as unknown as THomepageBlogBeforeFormatting[];
    const homepageForums = await forumService.getFeaturedForums('_id uniqueId userId adminUserId title createdAt', 5) as unknown as THomepageForumBeforeFormatting[];

    const formattedHomepageData = formatHomepageData(featuredAuctions, premiumEduContent, upcomingAuctions, homepageEduContentOld /* homepageEduContent*/, homepageBlogs, homepageForums, currency);

    return res.json({
      data:{
        formattedHomepageData: formattedHomepageData
      },
      status_code: 200
    });
  } catch (e) {
    console.log(e);
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