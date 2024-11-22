const conn = require('../mariadb'); // mariadb 연결 모듈 
const {StatusCodes} = require('http-status-codes'); // status code 모듈
const jwt = require('jsonwebtoken'); // jwt 모듈
const crypto = require('crypto'); // 암호화 모듈
const dotenv = require('dotenv'); // dotenv 모듈
dotenv.config();

const join = function(req, res) { // 회원가입 콜백 함수
    const {email, password} = req.body

    let sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`

    // 암호화된 비밀번호와 salt 값을 같이 db에 저장
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt , 10000, 10, 'sha512').toString('base64');

    let values = [email, hashPassword, salt];

    conn.query(sql, values,
        function (err, results) {
            if(err){ 
                console.log(err)
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else if(results.affectedRows){
                return res.status(StatusCodes.CREATED).json(results);
            } else { // affectedRows가 0인 경우 고려
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
        }
    );
};

const login = function(req, res){ // 로그인 콜백 함수
    const { email, password } = req.body
    let sql = `SELECT * FROM users WHERE email = ?`

    conn.query(sql, email, 
        function (err, results) {
            if(err){ 
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];

            // salt값 꺼내서 날 것으로 들어온 비밀번호를 암호화 해보고
            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt , 10000, 10, 'sha512').toString('base64');
            
            // db 비밀번호랑 비교
            if (loginUser && loginUser.password == hashPassword) {
                // jwt 발급
                const token = jwt.sign({
                    id : loginUser.id,
                    email : loginUser.email,
                }, process.env.PRIVATE_KEY, {
                    expiresIn: '50m',
                    issuer: 'znhxxn'
                });

                // 발급한 토큰 쿠키에 담기
                res.cookie("token", token, {
                    httpOnly : true
                });
                console.log(token);

                return res.status(StatusCodes.OK).json({...results[0],
                token: token});
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "로그인 실패"
                }).end();
            }
        }
    );
};

const PasswordResetrequest = function(req, res){ // 비밀번호 초기화 요청 콜백
    const { email } = req.body;
    let sql = `SELECT * FROM users WHERE email = ?`;

    conn.query(sql, email, 
        function (err, results) {
            if(err){ 
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            // 이메일로 유저가 있는지 찾아본다
            const user = results[0];
            if (user) {
                return res.status(StatusCodes.OK).json({
                    email: email
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
};

const passwordReset = function(req, res){ // 비밀번호 초기화 콜백
    const {email, password} = req.body;

    let sql = `UPDATE users SET password = ? , salt = ?
                WHERE email = ?`;

    // 암호화된 비밀번호와 salt 값을 같이 db에 저장
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt , 10000, 10, 'sha512').toString('base64');
    
    let values = [hashPassword, salt, email];

    conn.query(sql, values,
        function (err, results) {
            if(err){ 
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else if(results.affectedRows == 0) { // email, password가 없는 경우
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        }
    ) 
};

module.exports = {
    join, 
    login, 
    PasswordResetrequest, 
    passwordReset 
};