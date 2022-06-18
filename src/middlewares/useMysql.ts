// 이 파일의 목적 : mysql을 모든 api에서 사용할 수 있게끔 미들웨어 만듦
import { Request, Response, NextFunction } from 'express'
import mysql from '../modules/mysql'

interface RequestWithConnection extends Request {
    mysqlConnection?: any
}
//미들웨어 핸들러를 어싱크로 선언했을 때 오류 발생하면 제대로 처리를 못함
export const useMysql = (
    req: RequestWithConnection,
    res: Response,
    next: NextFunction
) => {
    mysql
        .connect()
        .then((connection) => {
            req.mysqlConnection = connection
            next()
        })
        .catch((e: Error) => {
            next(e)
        })
}
