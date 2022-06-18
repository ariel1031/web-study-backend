//RESTful 디자인 규격
//users : 집합 (컬렉션, 도큐먼트, 도메인)
//import fs from 'fs/promises' //기본 내장 모듈이라 따로 npm 다운 필요 없다. 9시 27분에 설명. typescript에서 타입 지정을 위해 @types/node 깐다. typescript도 함께
//import {connect} from 'data/modules/mysql' //import 방법 10시 52분

import express, { Handler, ErrorRequestHandler } from 'express' //서버프로그램
import cors from 'cors'
import apiConfigs from './configs/api'
import controllers from './controllers'
import errorConfigs from './configs/error'

import { useMysql } from './middlewares/useMysql'
import { errorHandler } from './middlewares/errorHandler'
import { authorizer } from './middlewares/authorizer'

const app = express() //app은 express의 인스턴스
const PORT = 3714 //수정될 일 없이 참조하는 값들은 상수이름을 대문자로 해두는게 관례
//const DATA_FILE_PATH = 'data/data.json'

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use(useMysql)

controllers
    .registerAllApis(app, apiConfigs)
    .then(() => {
        app.use(errorHandler)
        app.listen(PORT, () =>
            console.log('Example app listening at http://localhost:3714')
        )
    })
    .catch((e) => {
        console.error(e)
        process.exit(-1)
    })
//6월 6일
//레이어드 아키텍처
//controller 계층 (함수)
//모든 api들을 설정값만 갖고와서 등록 가능하게 하는 함수 만들기
//Async wrapper => (req, res, next)
//변수 , 응답, (req, res X): (params, mysql) => return

//app.use('/test', testRouter) ///오류 ALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTERALTER
//공통적으로 겹치는 엔드포인트 합쳐서 등록 가능

//1. app.get 직접등록
//2. router 모듈을 사용한 등록
