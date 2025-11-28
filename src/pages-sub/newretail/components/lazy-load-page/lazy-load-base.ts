//获取应用实例
const app = getApp();

/**
 * 判断组件是否在可显示区域内
 * minHeight 用于判断元素高度，防止在未加载元素时重复加载数据
 */
const determineComponentInVisibleArea = (targetClass, that = this, relativeToBox, minHeight) => {
    return new Promise((resolve, reject) => {
        try {
            if (uni.createIntersectionObserver) {
                let creatFn = uni.createIntersectionObserver();
                if (relativeToBox) {
                    creatFn
                        .relativeToViewport({
                            bottom: 0
                        })
                        .observe(relativeToBox, (res) => {
                            if (res && res.boundingClientRect.bottom - app.globalData.systemInfo.screenHeight < 0 && (!minHeight || res.boundingClientRect.height > minHeight)) {
                                resolve(res);
                            } else {
                                resolve(null);
                            }
                        });
                } else {
                    creatFn
                        .relativeToViewport({
                            bottom: 0
                        })
                        .observe(targetClass, (res) => {
                            if (res.boundingClientRect.top > 0) {
                                resolve(res);
                            } else {
                                resolve('null');
                            }
                        });
                }
            } else {
                const windowHeight =
                    {
                        // ...wx.getSystemInfoSync(),
                        ...uni.getSystemInfoSync()
                    }.windowHeight || 667;
                uni.createSelectorQuery()
                    .in(that)
                    .select(targetClass)
                    .boundingClientRect(function (i) {
                        if (i && i.top != null && i.top - 50 < windowHeight) {
                            resolve(res);
                        } else {
                            resolve(null);
                        }
                    })
                    .exec();
            }
        } catch (error) {
            console.log('CatchClause', error);
            console.log('CatchClause', error);
            reject(error);
        }
    });
};
export default  {
  /**
   * 判断组件是否在可显示区域内
   */
  determineComponentInVisibleArea: determineComponentInVisibleArea
};
