import { connectionWithRunFunction as connection } from '../../modules/mysql'
import JWT from 'jsonwebtoken'

const getUserInfo = async (params: { userIdx: string }, mysql: connection) => {
    const { userIdx } = params
    return {
        status: 200,
        data: userInfo,
    }
}

export { getUserInfo }
