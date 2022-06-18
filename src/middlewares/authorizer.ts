// 이 파일의 목적 : 아무나 api 요청하는거 방지하기 위해, 적법한 사용자만이 회원들만 사용할 수 있는 게시글 만들기 등등 할 수 있게 함
import { Request, Response, NextFunction } from 'express'
import { connectionWithRunFunction } from '../modules/mysql'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

interface RequestWithConnection extends Request {
    mysqlConnection?: any
}

export const authorizer = (
    //권한부여자
    req: RequestWithConnection,
    res: Response,
    next: NextFunction
) => {
    const { authorization: bearerToken } = req.headers
    const { mysqlConnection: connection } = req

    const token = bearerToken?.replace('Bearer ', '') || ''
    const SECRET = process.env.JWT_SECRET as string
    let payload = {}
    try {
        payload = JWT.verify(token, SECRET) //유효한가 확인해줌/payload반환
    } catch (e) {
        throw new Error('E3000')
    }

    const { id, iat } = payload as any //auth.ts에 /iat:timestamp

    connection
        ?.run('SELECT COUNT(*) AS count FROM users WHERE id = ?;', [id])
        .then((selectCountResult: { count: number }[]) => {
            const { count } = selectCountResult[0] //첫번째 값 밖에 없지
            if (count > 1) {
                //id가 1개 이상일 때
                console.log('auth success')
                next()
            } else {
                next(new Error('E3000')) //아이디가 아ㅖ 존재하지 않을때
            }
        })
        .catch((e: Error) => {
            next(e)
        })
}

//console.log('payload : ', payload) //payload :  { id: 'ariel1031', iat: 1655122535 }
