// import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    // eslint-disable-next-line eqeqeq
    if (type == 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    let trasactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!trasactionCategory) {
      trasactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(trasactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: trasactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
