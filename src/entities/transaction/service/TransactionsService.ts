import {categoriesService} from "@/entities/category/service/CategoriesService";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";

import {accountsService} from "@/entities/account/service/AccountsService";
import type {IAccountsService} from "@/entities/account/service/IAccountsService";
import {type Transaction, TRANSFER_IN_CATEGORY_ID, TRANSFER_OUT_CATEGORY_ID} from "../model/Transaction";
import type {ITransactionsRepository} from "../repository/ITransactionsRepository";
import {TransactionsLocalStorageRepository} from "../repository/TransactionsLocalStorageRepository";
import type {
  ITransactionsService,
  TransactionCreatePayload,
  TransactionExtended,
  TransactionsFilter,
  TransactionUpdatePayload,
  TransferExtended,
  TransferPayload,
} from "./ITransactionsService";

export class TransactionsService implements ITransactionsService {
  private readonly repository: ITransactionsRepository;
  private readonly categoriesService: ICategoriesService;
  private readonly accountService: IAccountsService;

  constructor(
    repository: ITransactionsRepository,
    categoriesService: ICategoriesService,
    accountsService: IAccountsService
  ) {
    this.repository = repository;
    this.categoriesService = categoriesService;
    this.accountService = accountsService;
  }

  async getAll(filter: TransactionsFilter): Promise<TransactionExtended[]> {
    const categories = await this.categoriesService.getAll({});

    const categoriesMap = new Map(categories.map(c => [c.id, c]));

    let categoryIds: string[] | undefined;

    if (filter.categoryType) {
      categoryIds = categories.filter(c => c.type === filter.categoryType).map(c => c.id);
    }

    if (filter.categoryId) {
      categoryIds = categoryIds ? categoryIds.filter(id => id === filter.categoryId) : [filter.categoryId];
    }

    if (categoryIds && categoryIds.length === 0) {
      return [];
    }

    const transactions = await this.repository.getAll({
      startDate: filter.startDate,
      endDate: filter.endDate,
      accountId: filter.accountId,
      categoryIds: categoryIds ? new Map(categoryIds.map(id => [id, true])) : undefined,
      withoutTransactions: filter.excludeTransfers,
    });

    return transactions.map(tx => {
      if (tx.transferId) {
        return {
          ...tx,
          categoryName: tx.categoryId === TRANSFER_IN_CATEGORY_ID ? "Входящий перевод" : "Исходящий перевод",
          categoryType: tx.categoryId === TRANSFER_IN_CATEGORY_ID ? "income" : "expense",
          categoryShortName: "💸",
        };
      }
      const category = categoriesMap.get(tx.categoryId);

      return {
        ...tx,
        categoryName: category?.name ?? "Неизвестная категория",
        categoryType: category?.type,
        categoryShortName: category?.shortName,
      };
    });
  }

  async getById(id: string): Promise<TransactionExtended | null> {
    const tx = await this.repository.getById(id);

    if (!tx) return null;

    const category = await this.categoriesService.getById(tx.categoryId);

    if (tx.transferId) {
      return {
        ...tx,
        categoryName: tx.categoryId === TRANSFER_IN_CATEGORY_ID ? "Входящий перевод" : "Исходящий перевод",
        categoryType: tx.categoryId === TRANSFER_IN_CATEGORY_ID ? "income" : "expense",
        categoryShortName: "💸",
      };
    }

    return {...tx, categoryType: category?.type, categoryName: category?.name ?? "Неизвестная категория"};
  }

  async getTransferById(transferId: string): Promise<TransferExtended | null> {
    const transferTxs = await this.repository.getAll({transferId});

    if (transferTxs.length === 0) {
      return null;
    }

    if (transferTxs.length !== 2) {
      throw new Error("Transfer corrupted");
    }

    const fromTx = transferTxs.find(tx => tx.categoryId === TRANSFER_OUT_CATEGORY_ID);
    const toTx = transferTxs.find(tx => tx.categoryId === TRANSFER_IN_CATEGORY_ID);

    if (!fromTx || !toTx) {
      throw new Error("Transfer corrupted");
    }

    return {
      transferId,
      fromAccountId: fromTx.accountId,
      toAccountId: toTx.accountId,
      amount: fromTx.amount,
      date: fromTx.date,
    };
  }

  // TODO: дописать проверку на лишние поля
  private async validateTransaction(tx: TransactionUpdatePayload): Promise<void> {
    const errors: string[] = [];

    if (tx.amount === undefined || typeof tx.amount !== "number" || tx.amount <= 0) {
      errors.push("Сумма должна быть положительным числом");
    }

    if (!tx.categoryId || typeof tx.categoryId !== "string") {
      errors.push("Не указана категория");
    } else {
      const category = await this.categoriesService.getById(tx.categoryId);
      if (!category) {
        errors.push("Категория не найдена");
      }
    }

    if (!tx.accountId || typeof tx.accountId !== "string") {
      errors.push("Не указан счёт");
    } else {
      const account = await this.accountService.getById(tx.accountId);
      if (!account) {
        errors.push("Счёт не найден");
      }
    }

    if (!tx.date || isNaN(Date.parse(tx.date))) {
      errors.push("Дата должна быть в формате ISO и быть валидной");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
  }

  async create(tx: TransactionCreatePayload): Promise<Transaction> {
    await this.validateTransaction(tx);
    return this.repository.create(tx);
  }

  async update(id: string, tx: TransactionUpdatePayload): Promise<Transaction | null> {
    await this.validateTransaction(tx);
    return this.repository.update(id, tx);
  }

  async delete(id: string): Promise<void> {
    const tx = await this.repository.getById(id);

    if (tx?.transferId) {
      throw new Error("Нельзя удалить транзакцию перевода напрямую");
    }
    return this.repository.delete(id);
  }

  private async validateTransfer(fromAccountId: string, toAccountId: string, amount: number, date: string) {
    const errors: string[] = [];

    if (!fromAccountId || !toAccountId) {
      errors.push("Не указаны счета");
    }

    if (fromAccountId === toAccountId) {
      errors.push("Счета должны отличаться");
    }

    if (amount <= 0) {
      errors.push("Сумма должна быть положительной");
    }

    if (!date || isNaN(Date.parse(date))) {
      errors.push("Некорректная дата");
    }

    const from = await this.accountService.getById(fromAccountId);
    const to = await this.accountService.getById(toAccountId);

    if (!from) errors.push("Счет отправителя не найден");
    if (!to) errors.push("Счет получателя не найден");

    if (errors.length) {
      throw new Error(errors.join(" "));
    }
  }

  async createTransfer(payload: TransferPayload) {
    await this.validateTransfer(payload.fromAccountId, payload.toAccountId, payload.amount, payload.date);

    return this.repository.createTransfer(
      {
        accountId: payload.fromAccountId,
        categoryId: TRANSFER_OUT_CATEGORY_ID,
        amount: payload.amount,
        date: payload.date,
      },
      {
        accountId: payload.toAccountId,
        categoryId: TRANSFER_IN_CATEGORY_ID,
        amount: payload.amount,
        date: payload.date,
      }
    );
  }
  async updateTransfer(transferId: string, payload: TransferPayload) {
    await this.validateTransfer(payload.fromAccountId, payload.toAccountId, payload.amount, payload.date);

    await this.repository.updateTransfer(transferId, payload);
  }

  async deleteTransfer(transferId: string) {
    await this.repository.deleteTransfer(transferId);
  }
}

export const transactionsService = new TransactionsService(
  new TransactionsLocalStorageRepository(),
  categoriesService,
  accountsService
);
