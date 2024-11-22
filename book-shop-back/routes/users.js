const express = require('express'); // express 모듈
const router = express.Router(); 
const {body, validationResult} = require('express-validator'); // validator(유효성 검사) 모듈
const {join, login, PasswordResetrequest, passwordReset} = require('../controller/UserController'); // join 모듈

router.use(express.json()); // post에서는 router.use가 추가적으로 필요했음

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (err.isEmpty()) {
        return next(); // 다음 할 일 찾아가라(미들 웨어, 함수)
     } 
    else {
        return res.status(400).json(err.array()) // return은 바로 종료시킴
     }

} // 유효성 검사 함수

router.post(
    '/join', 
    [
        body('email').notEmpty().isEmail().withMessage('이메일을 제대로 입력'),
        body('password').notEmpty().isString().withMessage('비밀번호 입력'),
        validate
    ] ,
    join
); // 회원 가입
router.post(
    '/login', 
    [
        body('email').notEmpty().isEmail().withMessage('이메일을 제대로 입력'),
        body('password').notEmpty().isString().withMessage('비밀번호 입력'),
        validate
    ] ,
    login
); // 로그인
router.post('/reset', PasswordResetrequest); // 비밀번호 초기화 요청
router.put('/reset', passwordReset); // 비밀번호 초기화 

module.exports = router