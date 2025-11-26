import request from './request'

export const InvoiceService = {
  /**
   * 创建发票
   */
  create: (insert: any): Promise<any> => {
    return request.post('/newretail/api/mall/invoice/create', insert)
  },

  /**
   * 查询发票
   */
  query: (opts?: any): Promise<any> => {
    const params = { ...opts }
    return request.get('/newretail/api/mall/invoice/query', params)
  }
}

export default InvoiceService