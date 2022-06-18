import express, { Request, Response } from 'express'
interface RequestWithConnection extends Request {
    //extends 키워드는 클래스를 다른 클래스의 자식으로 만들기 위해
    //Request 클래스로 부터 RequestWithConnection 클래스를 만든다
    mysqlConnection: any
}

const router = express.Router()

router.get('/err', (req, res) => {
    throw new Error('갑작스러운 에러!')
    res.send({ text: 'hola' })
})

router.post('/async', (req, res, next) => {
    const api = async (req: RequestWithConnection, res: Response) => {
        const connection = req.mysqlConnection
        const selectUsersResult = await connection.run(`SELECT * FROM users;`)
        return {
            data: selectUsersResult,
        }
    }

    api(req as RequestWithConnection, res) //?
        .then((result) => {
            //성공적인 값
            res.json({
                success: true,
                result: result,
            })
        })
        .catch((e) => {
            //에러 핸들러로 넘기자
            next(e)
        })
})

export default router
