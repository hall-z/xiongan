import CryptoJS from 'crypto-js'
const secretStr = 'c1e73438-9892-4f31-a334-1e83b147a760'
let key = CryptoJS.enc.Utf8.parse(secretStr.slice(0, 16))
let iv = CryptoJS.enc.Utf8.parse(secretStr.slice(0, 16))

// 解密方法
export function Decrypt(word: any, aesRes: any, aesResiv: any) {
  if (aesRes) {
    key = CryptoJS.enc.Utf8.parse(aesRes.slice(0, 16))
    iv = CryptoJS.enc.Utf8.parse(aesResiv.slice(0, 16))
  }
  const base64 = CryptoJS.enc.Base64.parse(word)
  const srcs = CryptoJS.enc.Base64.stringify(base64)
  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr
}

// 加密方法
export function Encrypt(word: any) {
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const base64Str = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  return base64Str
}
