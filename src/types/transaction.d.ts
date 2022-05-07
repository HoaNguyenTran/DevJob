declare namespace TransactionGlobal {

  interface TransactionHistory {
    coin: number
    detail: string
    logType: number
    money: number
    platform: number
    transId: string
    transTime: string
    userId: number
  }

  interface TransactionHistoryResponse extends Pagination.Pagi {
    data: TransactionHistory[]
  }
}