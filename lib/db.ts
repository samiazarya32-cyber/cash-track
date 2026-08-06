import Dexie, { Table } from 'dexie';

export interface Transaction {
  id?: number;
  type: 'INCOME' | 'EXPENSE' | 'DEBT_GIVEN' | 'DEBT_TAKEN';
  amount: number;
  currency: string;
  category: string;
  contactName?: string;
  description: string;
  date: string;
}

export interface Product {
  id?: number;
  name: string;
  stock: number;
  price: number;
}

class CashTrackDB extends Dexie {
  transactions!: Table<Transaction>;
  products!: Table<Product>;

  constructor() {
    super('CashTrackDB');
    this.version(1).stores({
      transactions: '++id, type, currency, date',
      products: '++id, name, stock'
    });
  }
}

export const db = new CashTrackDB();
