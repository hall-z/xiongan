import request from './request'

export const SearchService = {
  /**
   * 获取首页搜索关键字
   */
  query: (): Promise<any> => {
    return request.get('/newretail/api/mall/searchKeyword/query')
  }
}

export default SearchService