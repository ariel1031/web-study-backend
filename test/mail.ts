const mailgun = require('mailgun-js')
const DOMAIN = 'mail.outtacosmic.click'
const API_KEY = '64989282832150335b9f43f5cbb8910f-50f43e91-2f145ddb'
const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN })
const data = {
    from: 'ariel1031@mail.outtacosmic.click', //보내는 사람. 자주쓰는 계정 @ 도메인
    to: 'ariel1031@daum.net', //누구에게
    subject: '화이팅',
    text: '방학이니까 잘 해보자구~~!!',
}
mg.messages().send(data, function (error: any, body: any) {
    console.log(body)
})
