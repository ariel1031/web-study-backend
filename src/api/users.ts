import { connectionWithRunFunction as connection } from '../modules/mysql'
import bcrypt from 'bcrypt'
//get /users의 모든 정보 읽기(컬렉션 리스트 읽기)
const getUsers = async (params: any, mysql: connection) => {
    return {
        status: 200, //성공
        data: {
            users: ['data'],
        },
    }
}

//POST user: body parameter 입력(id, password, name, age)을 받아서 data.json의 가장 마지막 인덱스에 추가
//post / users: users 에 한 개체를 추가
//id, password, email, age , name
const postUsers = async (
    params: {
        id: string
        password: string
        email: string
        age: number
        name: string
    },
    mysql: connection
) => {
    const { id, password, email, age, name } = params

    const salt = await bcrypt.genSalt(10) //genSalt 난수 생성
    const hashedPassword = await bcrypt.hash(password, salt)

    await mysql.run(
        'INSERT INTO users (id, password, email, age, name) values (?,?,?,?,?);',
        [id, hashedPassword, email, age, name]
    )

    return { status: 201, data: {} }
}

export default {
    //익명 내보내기
    getUsers,
    postUsers,
}

//ctrl h 이름 바꾸기
//드래그하고 ctrl d하면 선택이 여러개가 동시에 변경 가능

//1. sms인증 : naver cloud (간편 sms 서비스)  //2.이메일 인증 : MailGun, AWS Route53으로 도메인 등록까지 하게 됨 (더 어려우면 혼자하기 힘들지 않을까???)
//이메일 인증으로 결정

//1. 회원가입
//회원등록 POST/users
//이메일 인증 코드 발송 = POST, /verify-codes
//이메일 인증 코드 검증 = 인증코드 읽기 GET, / verify-codes/:code

//2. 로그인 (토큰 발급)  POST / auth
//암호화 -> 복호화 가능
//해시화
//권한검사
