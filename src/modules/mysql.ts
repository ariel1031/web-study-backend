//import dotenv from 'dotenv'
import mysql, { Connection } from 'mysql2/promise' //mysql 라이브러리는 커넥션이라는 클래스 갖고 있어
import mysqlConfig from '../configs/mysql' //상위 ../   현재 디렉토리./
const { ID, PASSWORD, HOST, DB_NAME } = mysqlConfig

//console.log(process.env.MYSQL_ID)
//환경변수 env

const DB_URL = `mysql://${ID}:${PASSWORD}@${HOST}/${DB_NAME}?ssl={"rejectUnauthorized":true}`

//'mysql://24oq62gemtui:pscale_pw_rpzbwOqYRD3AnLyitKNwKtOjDOnD2unaycrEiJ8SkSE@mqntwp1ulcey.ap-northeast-2.psdb.cloud/mydb?ssl={"rejectUnauthorized":true}'
//10시 47분

let array = [1, 2, 3, 4]
let newArray = [...array]
newArray.push

interface customconnection extends Connection {
    //타입지정하기 위해
    run?: Function
}

export interface connectionWithRunFunction extends Connection {
    run: Function
}

const connect = async () => {
    const connection: customconnection = await mysql.createConnection(DB_URL) //타입지정. run 이 존재할수도 안할수도

    const run = async (sql: string, params: any[] = []) => {
        const [rows, field] = await connection.execute(sql, params) //실행할 때 execute
        return rows //로우스 갖고오는 run
    }
    connection.run = run //connction에 run이라는 함수를 추가시키기
    return connection as connectionWithRunFunction //타입을 커넥션 위드 런 으로 지정
}

export default {
    //하나의 값으로 내보냈다.
    connect,
}

//깃헙 빗버켓 같은 저장소에 올리더라도 db의 id pw는 해석 못하게 환경변수 설정하기
