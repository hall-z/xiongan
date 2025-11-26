import request from './request'

export const UserService = {
  /**
   * 查询用户信息
   * @param userId 用户id
   */
  getById: (userId: string): Promise<any> => {
    const params = {
      id: userId
    }
    return request.get('/newretail/api/sys/user/getById', params)
  }
}

export default UserService