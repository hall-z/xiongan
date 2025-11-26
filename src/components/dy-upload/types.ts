/*
 * @Description: 自定义上传组件
 * @Date: 2024-08-06 14:55:48
 * @LastEditors: wxfeiang wxfeiang@qq.com
 * @LastEditTime: 2025-04-13 17:00:53
 * @FilePath: /xa_card_mini/src/components/dy-upload/types.ts
 * Copyright (c) 2024 by ${git_name} email: ${git_email}, All Rights Reserved.
 */

import { PRIVACY_UPLOAD } from '@/service/api/system'
import { useUserStore } from '@/store'
import { sign } from '@/utils/aes/encryptUtils'
import type { ExtractPropTypes } from 'vue'
import {
  makeBooleanProp,
  makeNumberProp,
  makeStringProp,
} from 'wot-design-uni/components/common/props'

const fliePrefix = import.meta.env.VITE_UPLOAD_BASEURL

const actionUrl = PRIVACY_UPLOAD
const userStore = useUserStore()
const header = {
  sign: sign({ appkey: 'app' }),
  Authorization: userStore.getAuthorization().appSign,
}

// export type ButtonSize = 'small' | 'medium' | 'large'

// 图片数据组
export interface FilesList {
  name: string
  url: string
  meta?: any // 元信息
}
export const uploadProps = {
  /**
   * modelValue 上传后图片地址
   */
  modelValue: makeStringProp(''),
  /**
   *  默认图片上传地址
   */
  action: makeStringProp(actionUrl),
  /**
   *  默认图片上传  header
   */
  header: {
    type: Object,
    default: () => {
      return header
    },
  },
  /**
   *  其他数据
   */
  formData: Object,
  /**
   *  使用自定义显示 (卡片上传...)
   */
  showFileDy: makeBooleanProp(false),
  /**
   *  默认图片只上传1张
   * */
  name: makeStringProp('file'),

  /**
   *  默认图片只上传1张
   */
  limit: makeNumberProp(1),

  /**
   *  默认图片只上传1张
   */
  showFileList: makeBooleanProp(false),

  /**
   *  默认多图
   */
  multiple: makeBooleanProp(false),

  /**
   *  默认尺寸
   */
  maxSize: makeNumberProp(1024 * 10),
  /**
   * 文件显示需要的前缀
   */

  fliePrefix: makeStringProp(fliePrefix),
  /**
   * 文件预览形式
   */
  disabled: makeBooleanProp(false),
  /**
   * 文件预览形式
   */

  imageMode: makeStringProp('aspectFit'),

  /**
   *  是否加密数据
   */
  isAes: makeBooleanProp(false),

  /**
   * 原组件素有的属性
   */
  defaultAttrs: {
    type: Object,
    default: () => {
      return {
        // 'show-limit-num': true,
        // disabled: true,
      }
    },
  },
}

export type UploadProps = ExtractPropTypes<typeof uploadProps>
