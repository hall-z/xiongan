import type { ExtractPropTypes } from 'vue'
// TODO: 后续补全..
export const htmlProps = {
  // 文本内容
  html: {
    type: String,
  },
  dyHeight: {
    type: String,
  },
}

export type richtextProps = ExtractPropTypes<typeof htmlProps>
