import fs from 'fs/promises' //기본 내장 모듈이라 따로 npm 다운 필요 없다. 9시 27분에 설명. typescript에서 타입 지정을 위해 @types/node 깐다. typescript도 함께
import express from 'express' //서버프로그램
import cors from 'cors'
//import {connect} from 'data/modules/mysql' //import 방법 10시 52분
import mysql from './src/modules/mysql' //0521 export 설명 다시보기
import { Connection } from 'mysql2/promise'
import usersRouter from './src/api/users'

const app = express() //app은 express의 인스턴스
const PORT = 3714 //수정될 일 없이 참조하는 값들은 상수로 대문자로 해두는게 관례
const DATA_FILE_PATH = 'data/data.json'

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/v1', usersRouter)
//공통적으로 겹치는 엔드포인트 합쳐서 등록 가능

//1. app.get 직접등록
//2. router 모듈을 사용한 등록

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
)

// userRouter.get('/', async (req, res) => {
//     // /user/name
//     //읽기
//     const connection = await mysql.connect()
//     const selectData = await connection.run(`SELECT * FROM users;`)

//     //const fileJSONData = (await fs.readFile(DATA_FILE_PATH)).toString()
//     //const fileData: filedataType = JSON.parse(fileJSONData)
//     //console.log('select data: ', selectData)

//     //const [rows, field] = selectData
//     console.log('select Data: ', selectData)

//     res.send(selectData)
// })

// app.get('/user', (req, res) => {
//     //읽기
//     const data = fs.readFile(DATA_FILE_PATH).toString()
//     res.send(data)
// })

//5월 16일 멘토님 코드
// type filedataType = {
//     id: string
//     password: string
//     name: string
//     age: number
// }[] //배열 형태로 지정

// userRouter.post('/', async (req, res) => {
//     //쓰기
//     const { id, password, name, age } = req.body //9시 33분에 설명 이해가 필요해!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!구조 분해 할당!!!!!!!!!!!!!
//     const connection = await mysql.connect()

//     await connection.run(
//         `INSERT INTO users (id, password, name, age) VALUES (?,?,?,?);`,
//         [id, password, name, age]
//     )
//     res.send({
//         success: true,
//     })
// })

//const id = req.body.id
//const password = req.body.password........
// console.log('id : ', id)
// console.log('password : ', password)
// console.log('name : ', name)
// console.log('age: ', age)

// const fileJSONData = (await fs.readFile(DATA_FILE_PATH)).toString()
// console.log('fileJSONData : ', fileJSONData) //아맞다 toString() 안 붙이면 promise가 반환되지
// const fileData: filedataType = JSON.parse(fileJSONData) //방금 보낸거 말고 바로 저번에 보내서 모인애들 나옴

// const modifiedFileData: filedataType = [...fileData] //...스프레드 연산자(흩뿌리다) 9시13붐 //수정되는 데이터
// console.log('modifiedFileData : ', modifiedFileData)
// //스프레드 연산자 fileData내부의 값들을 복붙해서

// modifiedFileData.push({ id, password, name, age }) //push
// console.log('modifiedFileData push 이후: ', modifiedFileData)

// await fs.writeFile(DATA_FILE_PATH, JSON.stringify(modifiedFileData)) //이제 저장

//     const data = JSON.parse(fs.readFileSync('data/data.json').toString('utf-8'))
//     data.sort((a: any, b: any) => {
//         return a[data.length - 1] - b[data.length - 1]
//     })
//     req.body.index = data[data.length - 1].index + 1
//     data.push(req.body)
//     fs.writeFileSync('data/data.json', JSON.stringify(data))
//     res.send({ success: true, index: req.body.index })
// })

// userRouter.put('/', async (req, res) => {
//     //수정

//     const { index, id, password, name, age } = req.body
//     const connection = await mysql.connect()

//     await connection.run(
//         `UPDATE users set id = ?, password = ?, name = ?, age = ? where idx = ?;`,
//         [id, password, name, age, index]
//     )
//     res.send()
// })

// const { id, password, name, age, index } = req.body
// const fileJSONData = (await fs.readFile(DATA_FILE_PATH)).toString()
// const fileData: filedataType = JSON.parse(fileJSONData)

// const modifiedFileData: filedataType = [...fileData]
// modifiedFileData[index] = { id, name, age, password } //배열 index 번째의 데이터들을 req.body에 있는 애들로 수정

// await fs.writeFile(DATA_FILE_PATH, JSON.stringify(modifiedFileData))

// app.put('/user', (req, res) => {
//     //수정
//     const data = JSON.parse(fs.readFileSync('data/data.json').toString('utf-8'))
//     //멘토님 피드백 참조를 위했던 값은 상수로 고정을 하고
//     //수정하거나 수정된 값은 새로운 변수를 선언하여 할당해주는 것이 좋을 것
//     const willUpdateIndex = data.findIndex(
//         (value, index) => req.body.index === index
//     )
//     data[willUpdateIndex] = req.body
//     fs.writeFileSync('data/data.json', JSON.stringify(data))
//     res.send({ success: true })
// })

// userRouter.delete('/', async (req, res) => {
//     const { index } = req.body
//     const connection = await mysql.connect()

//     await connection.run(`DELETE from users where idx = ?;`, [index])
//     res.send({
//         success: true,
//     })
// })
// const fileJSONData = (await fs.readFile(DATA_FILE_PATH)).toString()
// const fileData: filedataType = JSON.parse(fileJSONData)

// const modifiedFileData: filedataType = [...fileData]
// modifiedFileData.splice(index, 1) //시작, 어디까지 삭제해>

// await fs.writeFile(DATA_FILE_PATH, JSON.stringify(modifiedFileData))

// app.delete('/user', (req, res) => {
//     //제거
//     let data = JSON.parse(fs.readFileSync('data/data.json').toString('utf-8'))
//     //근철님 코드
//     for (let d in data) {
//         //data 안에 순회
//         if (req.body.index == d) {
//             data.splice(Number(d), 1)
//             //splice() 메서드는 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경
//             //입력받은 인덱스 숫자에 postman에서 body에 넣은 내용물 담기
//             break
//         }
//     }
//     fs.writeFileSync('data/data.json', JSON.stringify(data))
//     res.send(data)
// })

//RESTful 디자인 규걱
