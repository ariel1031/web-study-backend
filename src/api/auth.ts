//2. 로그인 (토큰 발급)  POST / auth
// 로그인
import { connectionWithRunFunction as connection } from '../modules/mysql'
//검사
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'

const postAuth = async (
    params: { id: string; password: string },
    mysql: connection
) => {
    const { id, password } = params
    const selectHashedPassword = await mysql.run(
        'SELECT password FROM users WHERE id =?;',
        [id]
    )
    const isEqual = await bcrypt.compare(
        password,
        selectHashedPassword[0].password
    )
    console.log(isEqual)

    if (!isEqual) {
        throw new Error('E2000')
    }

    const payload = { id }
    const secret = 'web-study'
    const token = JWT.sign(payload, secret) //jwt.sign(payload(담아져서 클라이언트에게 전송되는 데이터), 시크릿키)

    return {
        status: 201,
        data: {
            token: token,
        },
    }
}

export default {
    postAuth,
}
