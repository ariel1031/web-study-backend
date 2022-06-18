import path from 'path'
import { Request, Response, NextFunction, Express } from 'express'
import { connectionWithRunFunction } from '../modules/mysql'
import { apiConfigType, apiConfigsType } from '../configs/api'
import { authorizer } from '../middlewares/authorizer'

interface RequestWithConnection extends Request {
    mysqlConnection: connectionWithRunFunction
}

const registerAllApis = async (
    //모든 함수 등록. 설정값도
    app: Express,
    configs: { [key: string]: apiConfigType }
) => {
    for (const apiName in configs) {
        const apiConfig = configs[apiName] ////config가 api.ts에서 설정 정보 가져오기

        const {
            path: urlPath,
            method,
            handlerPath,
            handlerName,
            authorizer: isRequireAuthorizer, //authorizer 필요한가??
        } = apiConfig

        const apiModulePath = path.join(__dirname, '../', '../', handlerPath)
        //dirname은 파일 이름 앞까지의 경로를 가져온다. join으로 뒤에 애들이랑 합침 루트 경로까지 올라감

        //동적 가져오기. path 약간 addslashes같은건가???? api modules 갖고 올 수 있음
        //os별로 문제없이 경로 잘 합치게 하는게 join()
        console.log(apiModulePath)
        const { default: apiModule } = await import(apiModulePath) //export 오브젝트
        const handlerFunction: (params: any, mysql: any) => Promise<any> =
            apiModule[handlerName]

        const APIHandler = (
            request: Request,
            response: Response,
            next: NextFunction
        ) => {
            const req = request as RequestWithConnection
            const res = response
            const params = req.body
            const connection = req.mysqlConnection

            handlerFunction(params, connection)
                .then(
                    (returnObj: {
                        status: number
                        data: { [key: string]: any }
                    }) => {
                        const { status, data } = returnObj

                        res.status(status)
                        res.json(data)
                    }
                )
                .catch((e) => next(e))
        }

        //
        isRequireAuthorizer
            ? app[method](urlPath, authorizer, APIHandler) //true
            : app[method](urlPath, APIHandler) //false 일때
    }
}

export default {
    registerAllApis,
}
