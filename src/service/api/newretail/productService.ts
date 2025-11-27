import request from './request'

interface QueryParams {
  page?: number
  pageSize?: number
  [key: string]: any
}

interface GetMenuProductParams {
  storeId: string
  business: string
}

interface GetCategoryWithCountParams {
  storeIds: string[]
  purposes?: string
}

interface GetByCategoryIdParams {
  business: string
  categoryIds: string[]
  storeId: string
  [key: string]: any
}

interface SearchProductParams {
  storeIdIn?: string
  page?: number
  pageSize?: number
  keywordLikes?: string
  nameLikes?: string
  searchCount?: boolean
  business?: string
  isApp?: boolean
}

interface ProductDetailsParams {
  productId: string
  storeId: string
}

interface QueryProductParams {
  barCode?: string
  keywordLikes?: string
  includeChild?: boolean
  page?: number
  pageSize?: number
}

export const ProductService = {
  /**
   * 查询所有门店商品
   * @param storeId 门店id
   * @param business 业态 RETAIL 零售,CATERING 餐饮,RETAIL_CATERING 零售和餐饮
   */
  getMenuProduct: (params: GetMenuProductParams): Promise<any> => {
    return request.get('/newretail/api/mall/product/shareBalance/getMenuProduct', params)
  },

  /**
   * 查询商品分类树
   */
  getAllCategory: (): Promise<any> => {
    return request.get('/newretail/api/mall/product/category/getAllCategory')
  },

  /**
   * 查询商品分类树+商品数量
   */
  getCategoryWithCountByStore: (storeIds) => {
    const requestParams = {
      storeIds,
      purposes: 'ONLINE,CURRENCY'
    }
    return request.get('/newretail/api/mall/product/category/getCategoryWithCountByStore', requestParams)
  },

  /**
   * 根据门店Id查询查询菜单商品
   * @param business 业态 RETAIL 零售,CATERING 餐饮,RETAIL_CATERING 零售和餐饮
   * @param categoryIds 类目Id集合
   * @param storeId 门店Id
   */
  getByCategoryId: (params: GetByCategoryIdParams): Promise<any> => {
    return request.get('/newretail/api/mall/product/shareBalance/getByCategoryId', params)
  },

  /**
   * 查询门店商品
   */
  query: (postData: any) => {
    const params = {
      ...postData,
      isApp: true
    }
    return request.get('/newretail/api/mall/product/shareBalance/query', params)
  },

  /**
   * 查询门店商品
   */
  queryStoreProduct: (postData?: QueryParams): Promise<any> => {
    const params = {
      ...postData,
      isApp: true
    }
    return request.get('/newretail/api/mall/product/shareBalance/query', params)
  },

  /**
   * 查询门店热门商品(仅查询上架状态)
   * @param storeId 门店Id
   */
  getStoreHotProduct: (params: any): Promise<any> => {
    return request.post('/newretail/api/mall/product/shareBalance/getStoreHotProduct', params)
  },

  /**
   * 根据门店商品详情
   * @param storeId 门店id
   * @param productId 门店商品id
   */
  getDetails: (params: ProductDetailsParams): Promise<any> => {
    return request.get('/newretail/api/mall/product/shareBalance/getDetails', params)
  },

  /**
   * 根据门店商品查询V2
   */
  queryV2: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/product/shareBalance/queryV2', postData)
  },

  /**
   * 搜索门店商品
   */
  getSearchProduct: (params: SearchProductParams): Promise<any> => {
    const requestParams = {
      storeIdIn: params.storeIdIn,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      keywordLikes: params.keywordLikes,
      nameLikes: params.nameLikes,
      searchCount: params.searchCount,
      business: params.business,
      isApp: true
    }
    return request.get('/newretail/api/mall/product/shareBalance/query', requestParams)
  },

  /**
   * 搜索活动商品
   */
  getSearchActiveProduct: (params: any): Promise<any> => {
    return request.post('/newretail/api/mall/search/queryActivity', params)
  },

  /**
   * 获得餐饮详情
   * @param productId 商品ID
   * @param storeId 门店ID
   */
  getCateringDetailsById: (params: ProductDetailsParams): Promise<any> => {
    return request.get('/newretail/api/catering/meal/getDetailsById', params)
  },

  /**
   * 根据商品Id查询商品规格详情 包含门店价格库存
   * @param productId 商品ID
   * @param storeId 门店ID
   */
  getSpecDetails: (params: ProductDetailsParams): Promise<any> => {
    return request.get('/newretail/api/mall/product/shareBalance/getSpecDetails', params)
  },

  /**
   * 根据商品Id查询商品关联商品
   * @param productId 商品ID
   * @param storeId 门店ID
   */
  getRelatedProducts: (params: ProductDetailsParams): Promise<any> => {
    return request.get('/newretail/api/mall/product/shareBalance/getRelateProduct', params)
  },

  /**
   * 根据商品Id查询商品关联券
   * @param productId 商品ID
   * @param storeId 门店ID
   */
  getAvailableCouponsByProductId: (params: ProductDetailsParams): Promise<any> => {
    return request.get('/newretail/api/promotion/getAvailableCouponsByProductId', params)
  },

  /**
   * 分页查询商品列表
   * @param barCode 商品条码
   * @param keywordLikes 关键词
   */
  queryProduct: (params: QueryProductParams): Promise<any> => {
    const requestParams = {
      barCode: params.barCode,
      keywordLikes: params.keywordLikes,
      includeChild: params.includeChild !== undefined ? params.includeChild : true,
      page: params.page || 1,
      pageSize: params.pageSize || 15
    }
    return request.get('/newretail/api/mall/product/query', requestParams)
  },

  /**
   * 根据商品id获取商品详情
   * @param productId 商品ID
   */
  getDetailsById: (productId: string): Promise<any> => {
    const params = { id: productId }
    return request.get('/newretail/api/mall/product/getDetailsById', params)
  },

  /**
   * 根据分类ID获取分类详情
   * @param id 分类ID
   */
  categoryGetById: (id: string): Promise<any> => {
    const params = { id }
    return request.get('/newretail/api/mall/product/category/getById', params)
  },

  /**
   * 根据商品外部编码查商品
   * @param externalCode 外部编码
   */
  getByExternalCodeMall: (externalCode: string): Promise<any> => {
    const params = { externalCode }
    return request.get('/newretail/api/catering/meal/getByExternalCode', params)
  },

  /**
   * 根据门店外部编码查门店
   * @param externalCode 外部编码
   */
  getByExternalCodeStore: (externalCode: string): Promise<any> => {
    const params = { externalCode }
    return request.get('/newretail/api/mall/store/getByExternalCode', params)
  }
}

export default ProductService