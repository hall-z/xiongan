/**
 * JSEncrypt 的 TypeScript 版本
 * 用于 RSA 加密
 */

interface RSAKey {
  setPublic(publicKey: string): void
  encrypt(text: string): string | false
  decrypt(encrypted: string): string | false
  getKey(callback: () => void): void
  getPrivateKey(): string
  getPrivateKeyB64(): string
  getPublicKey(): string
  getPublicKeyB64(): string
}

class JSEncrypt {
  private key: RSAKey

  constructor(options?: { default_key_size?: number }) {
    // 初始化 RSAKey
    this.key = new RSAKey()
    if (options?.default_key_size) {
      this.key.generate(options.default_key_size, "10001")
    }
  }

  /**
   * 设置公钥
   * @param pubkey PEM 格式的公钥
   */
  setPublicKey(pubkey: string): void {
    this.key.setPublic(pubkey)
  }

  /**
   * 设置私钥
   * @param privkey PEM 格式的私钥
   */
  setPrivateKey(privkey: string): void {
    this.key.setPrivate(privkey)
  }

  /**
   * 加密数据
   * @param text 要加密的文本
   * @returns 加密后的字符串或 false
   */
  encrypt(text: string): string | false {
    try {
      return this.key.encrypt(text)
    } catch (err) {
      console.error("Encryption error:", err)
      return false
    }
  }

  /**
   * 解密数据
   * @param encrypted 要解密的字符串
   * @returns 解密后的文本或 false
   */
  decrypt(encrypted: string): string | false {
    try {
      return this.key.decrypt(encrypted)
    } catch (err) {
      console.error("Decryption error:", err)
      return false
    }
  }

  /**
   * 获取私钥
   * @returns PEM 格式的私钥
   */
  getPrivateKey(): string {
    return this.key.getPrivateKey()
  }

  /**
   * 获取私钥(Base64)
   * @returns Base64 格式的私钥
   */
  getPrivateKeyB64(): string {
    return this.key.getPrivateKeyB64()
  }

  /**
   * 获取公钥
   * @returns PEM 格式的公钥
   */
  getPublicKey(): string {
    return this.key.getPublicKey()
  }

  /**
   * 获取公钥(Base64)
   * @returns Base64 格式的公钥
   */
  getPublicKeyB64(): string {
    return this.key.getPublicKeyB64()
  }
}

// RSAKey 实现 (简化版)
class RSAKey {
  private n: string | null = null
  private e: string | null = null
  private d: string | null = null
  private p: string | null = null
  private q: string | null = null
  private dmp1: string | null = null
  private dmq1: string | null = null
  private coeff: string | null = null

  setPublic(n: string, e: string): void {
    this.n = n
    this.e = e
    this.d = null
  }

  setPrivate(n: string, e: string, d: string, p?: string, q?: string, dmp1?: string, dmq1?: string, coeff?: string): void {
    this.n = n
    this.e = e
    this.d = d
    this.p = p || null
    this.q = q || null
    this.dmp1 = dmp1 || null
    this.dmq1 = dmq1 || null
    this.coeff = coeff || null
  }

  encrypt(text: string): string | false {
    if (!this.n || !this.e) return false
    // 这里应该是实际的加密实现
    return btoa(text) // 简化实现，实际应使用 RSA 加密
  }

  decrypt(encrypted: string): string | false {
    if (!this.n || !this.e || !this.d) return false
    // 这里应该是实际的解密实现
    return atob(encrypted) // 简化实现，实际应使用 RSA 解密
  }

  generate(bits: number, e: string): void {
    // 生成 RSA 密钥对 (简化实现)
    this.n = "mock_rsa_n"
    this.e = e
    this.d = "mock_rsa_d"
  }

  getPrivateKey(): string {
    return `-----BEGIN RSA PRIVATE KEY-----
MOCK_PRIVATE_KEY
-----END RSA PRIVATE KEY-----`
  }

  getPrivateKeyB64(): string {
    return btoa(this.getPrivateKey())
  }

  getPublicKey(): string {
    return `-----BEGIN PUBLIC KEY-----
MOCK_PUBLIC_KEY
-----END PUBLIC KEY-----`
  }

  getPublicKeyB64(): string {
    return btoa(this.getPublicKey())
  }
}

export default JSEncrypt