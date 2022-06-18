import express, { Router } from 'express'
import mysql from '../../modules/mysql'

import { Request, Response, NextFunction } from 'express'
interface RequestWithConnection extends Request {
    //extends 키워드는 클래스를 다른 클래스의 자식으로 만들기 위해
    //Request 클래스로 부터 RequestWithConnection 클래스를 만든다
    mysqlConnection: any
}

const router = express.Router()
//특정 user가 소유하고 있는 게시글 읽기
router.get(
    '/users/:userIdx/posts',
    async (request: Request, response: Response) => {
        //userIdx의 값을 받아오기
        const req = request as RequestWithConnection
        //as
        const res = response

        const { userIdx } = req.params //url에서 userIdx의 값을 받아와 변수에 넣는다.

        const connection = await req.mysqlConnection //????제대로 이해하기 왜하는 건지 모르겠다???
        const selectUsersPostsResult: {
            //타입 지정해야 없는 값을 썼을 때 에러를 출력해준다. 휴먼에러 발생을 줄여줌. 타입 지정하는 걸 권
            title: string
            contents: string
            id: string
        }[] = await connection.run(
            `SELECT title, contents, u.id
        From posts AS p
        INNER JOIN users AS u
        ON p.author_idx = u.idx
        WHERE p.author_idx = ?;`,
            [userIdx]
        )
        console.log('selectUsersPostsResult : ', selectUsersPostsResult) //selectUsersPostsResult : [ { title: '제목', contents: '내용', id: '뱁새' } ]

        const responseBodyData = selectUsersPostsResult.map((data) => {
            //56qnsWma 설명
            // []배열 형태임
            const { title, contents, id: userId } = data
            return { title, contents, id: userId }
        })
        res.send(responseBodyData)
    }
) //특정유저에게 가려면 패스파라미터

//특정 유저의 게시글 추가 title, contents
router.post(
    '/users/:userIdx/posts',
    async (request: Request, response: Response) => {
        const req = request as RequestWithConnection
        const res = response
        const { userIdx } = req.params
        const { title, contents } = req.body
        const connection = await mysql.connect() //db와 연동

        const countUsersResult = await connection.run(
            `SELECT COUNT(*) AS count FROM users WHERE idx = ?;`,
            [userIdx]
        )
        //console.log(countUsersResult)
        if (countUsersResult[0].count !== 1) {
            throw new Error('해당되는 idx의 유저가 존재하지 않습니다')
        }
        await connection.run(
            `INSERT INTO  posts (title, contents, author_idx) VALUES (?, ?, ?)`,
            [title, contents, userIdx]
        )
        res.send({ success: true })
    }
)

//PUT 특정 유저의 게시글에서 특정 idx의 게시글 수정 contents
router.put(
    '/users/:userIdx/posts/:postIdx',
    async (request: Request, response: Response) => {
        const req = request as RequestWithConnection
        const res = response
        const { userIdx, postIdx } = req.params
        const { title, contents } = req.body
        const connection = req.mysqlConnection //db와 연동

        try {
            const countUsersPost = await connection.run(
                `SELECT COUNT(*) AS count FROM posts WHERE author_idx = ? AND idx = ?`,
                [userIdx, postIdx]
            )
            if (countUsersPost[0].count !== 1) {
                throw new Error('해당 포스트는 존재하지 않습니다')
            }

            await connection.run(
                `UPDATE posts SET contents = ? where idx = ?`,
                [contents, postIdx]
            )
            res.send({ success: true })
        } catch (e) {
            res.send({ success: false, errorMessage: `${e}` })
        }
    }
)

//DELDTE 특정 유저의 게시글에서 특정 idx의 게시글 삭제
router.delete(
    '/users/:userIdx/posts/:postIdx',
    async (request: Request, response: Response) => {
        const req = request as RequestWithConnection
        const res = response
        const { userIdx, postIdx } = req.params
        const { title, contents } = req.body
        const connection = req.mysqlConnection //db와 연동

        try {
            const countUsers = await connection.run(
                `SELECT COUNT(*) AS count FROM posts WHERE author_idx = ? AND idx = ?`,
                [userIdx]
            )
            if (countUsers[0].count !== 1) {
                throw new Error('해당 사용자는 존재하지 않습니다')
            }

            const countUsersPost = await connection.run(
                `SELECT COUNT(*) AS count FROM posts WHERE author_idx = ? AND idx = ?`,
                [postIdx]
            )
            if (countUsersPost[0].count !== 1) {
                throw new Error('해당 포스트는 존재하지 않습니다')
            }

            await connection.run(`DELETE FROM posts where idx = ?`, [postIdx])
            res.send({ success: true })
        } catch (e) {
            res.send({ success: false, errorMessage: `${e}` })
        }
    }
)

export default router
