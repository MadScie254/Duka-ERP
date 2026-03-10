export const APP_NAME = "DukaERP";

export enum PaymentMethod {
  MPESA = "M-PESA",
  CASH = "CASH",
  CREDIT = "MKOPO",
  CARD = "CARD",
}

export enum TransactionType {
  SALE = "SALE",
  EXPENSE = "EXPENSE",
  PAYMENT = "PAYMENT",
}

export enum DebtStatus {
  UNPAID = "UNPAID",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
}
