import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { CashBalanceHistoryService } from '../../services/cash-balance-history.services';
import { EducationalContentService } from '../../services/edu-content.services.';
import { MemoizedEduContentType } from '../../types/edu-content.types';
import { formatCashBalanceHistory } from '../../formatter/cash-balance-history.formatter';
import { TransactionResponseType } from '../../types/cash-balance-history.type';
import { CashBalanceHistoryModel } from '../../db/rdb/models';

const cashBalanceHistoryService = new CashBalanceHistoryService();
const eduContentService = new EducationalContentService();

export async function getUserCashBalanceHistories(req: AppAuthenticatedRequest, res: Response) {
  try{
    const oldestTransactionId = req.body.oldest_transaction_id ? (req.body.oldest_transaction_id !== "" ? req.body.oldest_transaction_id : null ) : null;
    const limit: number = 10;
    const cashBalanceHistoryData = await cashBalanceHistoryService.getUserCashBalanceHistoryInfScroll(req.user!.id, oldestTransactionId, limit);

    let eduContentToFetch: string[] = [];
    cashBalanceHistoryData[1].map((item: CashBalanceHistoryModel) => {
      if(item.edu_content_id)
        eduContentToFetch = [...eduContentToFetch, item.edu_content_id]
    })

    eduContentToFetch = [...new Set(eduContentToFetch)] as string[];

    const eduContents = await eduContentService.getEducationalContentByUniqueIds(eduContentToFetch, false, 'id uniqueId category title price is_premium')

    let memoizedEduContents = {} as unknown as MemoizedEduContentType;
    eduContents.map((item: any) => {
      memoizedEduContents = { ...memoizedEduContents, [item.uniqueId]: item }
    })

    const formattedTransactions = formatCashBalanceHistory(cashBalanceHistoryData[1] as unknown as TransactionResponseType[], memoizedEduContents)

    return res.json({
      data:{
        next: Number(cashBalanceHistoryData[0]) > 0 ? cashBalanceHistoryData[0] : 0,
        transactions: formattedTransactions,
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