import express, { Request, Response } from 'express'
import mysql from '../modules/mysql'
import { Connection } from 'mysql2/promise'
const router = express.Router()

type filedataType = {
    id: string
    password: string
    name: string
    age: number
}[] //배열 형태로 지정

interface RequestWithConnection extends Request {
    //상속을 해준다
    mysqlConnection: any
}

//get /users의 모든 정보 읽기(컬렉션 리스트 읽기)
router.get('/users', async (request: Request, response: Response) => {
    const req = request as RequestWithConnection //request를 RequestWithConnection 형으로
    const res = response
    const connection = req.mysqlConnection
    console.log('text connection: ', connection)

    //const connection = await mysql.connect() //이거 말고 useMysql에서 갖고 와서 쓸거야
    const selectData = await connection.run(`SELECT * FROM users;`)

    res.send(selectData)
})

// get / users/5: users의 한 개체의 정보 읽기
//users의 모든 정보 읽기 (컬렉션 리스트 읽기)
router.get('/users/:userIdx', async (request: Request, response: Response) => {
    const req = request as RequestWithConnection //request를 RequestWithConnection 형으로
    const res = response
    const { userIdx } = req.params
    const connection = await mysql.connect()
    const [selectUserResult] = await connection.run(
        `SELECT * FROM users where idx = ?;`, //쿼리에서 인덱스대로 불러온다.
        [userIdx]
    )

    res.send(selectUserResult)
})

//POST user: body parameter 입력(id, password, name, age)을 받아서 data.json의 가장 마지막 인덱스에 추가
//post / users: users 에 한 개체를 추가
router.post('/users', async (request: Request, response: Response) => {
    //이거는 특정 index에 쓰기 이거 불가능하니까
    //쓰기
    const req = request as RequestWithConnection //request를 RequestWithConnection 형으로
    const res = response
    const { id, password, name, age } = req.body //9시 33분에 설명 이해가 필요해!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!구조 분해 할당!!!!!!!!!!!!!
    const connection = await mysql.connect()

    await connection.run(
        `INSERT INTO users (id, password, name, age) VALUES (?,?,?,?);`,
        [id, password, name, age]
    )
    res.send({
        success: true,
    })
})

//post / users: users 컬렉션을 "전부" 수정한다. 잘 사용되진 않음.
//users 테이블의 모든 정보 제거
//users의 오토인크리먼트 초기화 0부터 시작하게
//users 새로운 user정보를 다수 추가.
//전부다 덮어쓰기!

//12시13분
router.put('/users/:userIdx', async (request: Request, response: Response) => {
    const req = request as RequestWithConnection //request를 RequestWithConnection 형으로
    const res = response
    const { userIdx } = req.body
    const { index, id, password, name, age } = req.body
    const connection = await mysql.connect()

    await connection.run(
        `UPDATE users set id = ?, password = ?, name = ?, age = ? where idx = ?;`,
        [id, password, name, age, index]
    )

    res.send({ success: true })
})

router.put('/users', async (request: Request, response: Response) => {
    const req = request as RequestWithConnection //request를 RequestWithConnection 형으로
    const res = response
    const { userIdx } = req.body
    const { index, id, password, name, age } = req.body
    const connection = await mysql.connect()

    try {
        await connection.beginTransaction()
        await connection.run(`UPDATE users SET id = ?, password = ?;`, [
            id,
            password,
            userIdx,
        ])
        await connection.run(
            `UPDATE users SET name = ?, age = ?; WHERE idx = ?`,
            [id, password, userIdx]
        )

        await connection.commit()
    } catch (e) {
        console.log(e)
        await connection.rollback() //트랜젝션은 한방에 끝까지 정해둔 쿼리를 성공해야 그걸 확정지으니까
        //rollback하면 수정이 반영되지 않지. 없던일!
    }

    //수정

    // const { index, id, password, name, age } = req.body
    // const connection = await mysql.connect()

    // await connection.run(
    //     `UPDATE users set id = ?, password = ?, name = ?, age = ? where idx = ?;`,
    //     [id, password, name, age, index]
    // )

    res.send({ success: true })
})

//delete /users: users 컬렉션을 전부 제거한다.꼭필요하지 않은 이상 아ㅖ 안만드는걸 추천
router.delete('/users', async (request: Request, response: Response) => {
    const req = request as RequestWithConnection //request를 RequestWithConnection 형으로
    const res = response
    const connection = await mysql.connect()

    await connection.run(`DELETE from users`)
    res.send({
        success: true,
    })
})

//delete /users/5: 5번 정보 지우기
router.delete(
    '/users/:usersIdx',
    async (request: Request, response: Response) => {
        const req = request as RequestWithConnection //request를 RequestWithConnection 형으로
        const res = response
        const { index } = req.body
        const connection = await mysql.connect()

        await connection.run(`DELETE from users where idx = ?;`, [index])
        res.send({
            success: true,
        })
    }
)

export default router

//ctrl h 이름 바꾸기
//드래그하고 ctrl d하면 선택이 여러개가 동시에 변경 가능
