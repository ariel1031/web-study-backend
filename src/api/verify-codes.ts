import mailgun from 'mailgun-js'
import { connectionWithRunFunction as connection } from '../modules/mysql'
import mailgunConfigs from '../configs/mailgun'

// 이메일 인증 코드 검증 = 인증코드 읽기 get,/ verify-codes/:verifyCodeIdx
//code, email
const verifyEmailCode = async (params: any, mysql: connection) => {
    const { verifyCodeIdx, code, email } = params
    const countVerifyCodeResult = await mysql.run(
        `SELECT COUNT(*) as count FROM verify-codes WHERE idx = ? AND email = ? AND code =?`,
        [verifyCodeIdx, email, code]
    )
    if (countVerifyCodeResult[0].count !== 1) {
        throw new Error('E4000')
    }

    return {
        status: 200, //성공
        data: {
            isVerified: true,
        },
    }
}

//이메일 인증 코드
const sendEmailCode = async (params: { email: string }, mysql: connection) => {
    const { email } = params //이메일 갖고 오기
    const { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM } = mailgunConfigs

    const code = `${Math.floor(Math.random() * 1000000)}`.padStart(6, '0')
    console.log(email, code)
    const insertCodeResult = await mysql.run(
        `INSERT INTO verify_codes (email, code) VALUES (?, ?)`,
        [email, code]
    )
    const { insertId: idx } = insertCodeResult

    const mailgunClient = new mailgun({
        apiKey: MAILGUN_API_KEY,
        domain: MAILGUN_DOMAIN,
    }) //이 부분 .env로

    const sendConfig = {
        from: MAILGUN_FROM, //보내는 사람. 자주쓰는 계정 @ 도메인
        to: email, //누구에게
        subject: '인증코드 발송 메일입니다',
        text: `인증코드 ${code} 입니다.`,
    }
    console.log(code)
    await mailgunClient.messages().send(sendConfig, (error) => {
        console.log('error', error)
    })
    return { status: 201, data: { idx } }
}
//,

export default {
    //익명 내보내기
    verifyEmailCode,
    sendEmailCode,
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
