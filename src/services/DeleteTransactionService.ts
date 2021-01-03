 import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import TransactionsRepository from '../repositories/TransactionsRepository';


class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const trasanctionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await trasanctionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction does not exist');
    }

    await trasanctionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
