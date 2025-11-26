interface ExchangeGoodsListProps {
  goodId: number
  goodName: string
  coinPrice: number
  exchangeNotes: string
  exchangeLevel: number
  purchaseLimit: number
  stock: number
  goodSort: number
  createTime: string
  updateTime: string
  isSale: number
  goodImg: string
  exchangeName?: any
  sellOut?: any
}

interface goodsInfoProps {
  goodImg: string
  coinPrice: number
  goodName: string
  goodSort: number
  createTime: string
  exchangeLevel: number
  exchangeNotes: string
  isSale: number
  updateTime: string
  goodId: number
  stock: number
  purchaseLimit: number
  sellOut?: any
}

export type { ExchangeGoodsListProps, goodsInfoProps }
