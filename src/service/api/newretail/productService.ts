import request from './request'
export const ProductService = {
   /**
       * 查询所有门店商品
       * @param storeId 门店id
       * @param business 业态 RETAIL 零售,CATERING 餐饮,RETAIL_CATERING 零售和餐饮
       */
      getMenuProduct: function (storeId, business) {
          var params = {
              storeId: storeId,
              business: business
          };
          return request.get('/newretail/api/mall/product/shareBalance/getMenuProduct', params);
      },
      /**
       * 查询商品分类树
       */
      getAllCategory: function () {
          return request.get('/newretail/api/mall/product/category/getAllCategory');
      },
      /**
       * 查询商品分类树+商品数量
       */
      getCategoryWithCountByStore: function (storeIds) {
          var params = {
              storeIds: storeIds,
              purposes: 'ONLINE,CURRENCY'
          };
          return request.get('/newretail/api/mall/product/category/getCategoryWithCountByStore', params);
      },
      /**
       * 根据门店Id查询查询菜单商品
       * @param {string} business 业态 RETAIL 零售,CATERING 餐饮,RETAIL_CATERING 零售和餐饮Available values : RETAIL, CATERING, DISTRIBUTION, RETAIL_CATERING, ADVANCE_SELL, SCORE
       * @param {array} categoryIds  类目Id集合
       * @param {string} storeId 门店Id
       */
      getByCategoryId: function (business, categoryIds, storeId, opt) {
          var params = {
              business: business,
              categoryIds: categoryIds,
              storeId: storeId,
              ...opt
          };
          return request.get('/newretail/api/mall/product/shareBalance/getByCategoryId', params);
      },
      /**
       * 查询门店商品
       */
      query: function (postData) {
          postData = {
              ...postData,
              isApp: true
          };
          return request.get('/newretail/api/mall/product/shareBalance/query', postData);
      },
      /**
       * 查询门店商品
       */
      queryStoreProduct: function (postData) {
          postData = {
              ...postData,
              isApp: true
          };
          return request.get('/newretail/api/mall/product/shareBalance/query', postData);
      },
      /**
       * 查询门店热门商品(仅查询上架状态)
       *  @param {string} storeId  门店Id等于storeId,
       */
      getStoreHotProduct: function (params) {
          // ?storeId=' + storeId
          return request.post('/newretail/api/mall/product/shareBalance/getStoreHotProduct', params);
      },
      /**
       * 根据门店商品详情
       * @param storeId  门店id
       * @param productId   门店商品id
       */
      getDetails: function (storeId, productId) {
          var params = {
              storeId: storeId,
              productId: productId
          };
          return request.get('/newretail/api/mall/product/shareBalance/getDetails', params);
      },
      /**
       * 根据门店商品
       * @param storeId  门店id
       * @param productId   门店商品id
       */
      queryV2: function (postData) {
          return request.post('/newretail/api/mall/product/shareBalance/queryV2', postData);
      },
      /**
       * 搜索门店商品
       * @param page 当前页码，起始于1
       * @param pageSize 每页记录数，必须大于等于0且小于等于100，等于0时表示不分页查询全部数据， 大于0时表示分页查询
       * @param keywordLikes 关键词类似于,可以匹配外部商品代码，外部商品库存代码，商品名称，商品关键字
       * @param storeId  门店id
       * @param searchCount  总记录数
       */
      getSearchProduct: function (storeIdIn, page, pageSize, keywordLikes, searchCount, business, nameLikes) {
          var params = {
              storeIdIn: storeIdIn,
              page: page,
              pageSize: pageSize,
              keywordLikes: keywordLikes,
              nameLikes: nameLikes,
              searchCount: searchCount,
              business: business,
              isApp: true
          };
          return request.get('/newretail/api/mall/product/shareBalance/query', params);
      },
      getSearchActiveProduct: function (params) {
          return request.post('/newretail/api/mall/search/queryActivity', params);
      },
      /**
       * 获得餐饮详情
       * @param productId
       * @param storeId
       */
      getCateringDetailsById: function (productId, storeId) {
          var params = {
              productId: productId,
              storeId: storeId
          };
          return request.get('/newretail/api/catering/meal/getDetailsById', params);
      },
      /**
       * 根据商品Id 查询商品规格详情 包含门店价格库存
       * @param productId
       * @param storeId
       */
      getSpecDetails: function (productId, storeId) {
          var params = {
              productId: productId,
              storeId: storeId
          };
          return request.get('/newretail/api/mall/product/shareBalance/getSpecDetails', params);
      },
      /**
       * 根据商品Id 查询商品关联商品
       * @param productId
       * @param storeId
       */
      getRelatedProducts: function (storeId, productId) {
          var params = {
              productId: productId,
              storeId: storeId
          };
          return request.get('/newretail/api/mall/product/shareBalance/getRelateProduct', params);
      },
      /**
       * 根据商品Id 查询商品关联券
       * @param productId
       * @param storeId
       */
      getAvailableCouponsByProductId: function (storeId, productId) {
          var params = {
              productId: productId,
              storeId: storeId
          };
          return request.get('/newretail/api/promotion/getAvailableCouponsByProductId', params);
      },
      /**
       * 分页查询商品列表
       * @param {商品条码} barCode
       */
      queryProduct: function (barCode, keywordLikes, page = 1, pageSize = 15) {
          let params = {
              barCode: barCode,
              keywordLikes,
              includeChild: true,
              page,
              pageSize
          };
          return request.get('/newretail/api/mall/product/query', params);
      },
      /**
       * 根据商品id获取商品详情
       * @param productId   门店商品id
       */
      getDetailsById: function (productId) {
          var params = {
              id: productId
          };
          return request.get('/newretail/api/mall/product/getDetailsById', params);
      },
      categoryGetById: function (id) {
          var params = {
              id
          };
          return request.get('/newretail/api/mall/product/category/getById', params);
      },
      // 根据商品外部编码查商品
      getByExternalCodeMall: function (externalCode) {
          var params = {
              externalCode
          };
          return request.get('/newretail/api/catering/meal/getByExternalCode', params);
      },
      // 根据门店外部编码查门店
      getByExternalCodeStore: function (externalCode) {
          var params = {
              externalCode
          };
          return request.get('/newretail/api/mall/store/getByExternalCode', params);
      }
}

export default ProductService