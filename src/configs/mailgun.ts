import dotenv from 'dotenv'
dotenv.config() //dotenv.config()는 현재 디렉토리의 .env파일을 자동으로 인식하여 환경변수를 세팅한다.

export default {
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY as string,
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN as string,
    MAILGUN_FROM: process.env.MAILGUN_FROM as string,
}
