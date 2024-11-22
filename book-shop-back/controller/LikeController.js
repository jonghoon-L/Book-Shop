const conn = require('../mariadb'); // mariadb 연결 모듈 
const {StatusCodes} = require('http-status-codes'); // status code 모듈
const jwt = require("jsonwebtoken");
const authorizationUser = require('../auth'); // JWT 인증 모듈

const addLike = function(req, res){
    const book_id = req.params.id; // params는 id로만 선언해야함
    
    let decodedJwt = authorizationUser(req, res);

    if (decodedJwt instanceof jwt.TokenExpiredError) { // expired 에러
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        });
    } else if (decodedJwt instanceof jwt.JsonWebTokenError) { // 토큰 에러
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰입니다."
        });
    } else {
        let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
        let values = [decodedJwt.id, book_id];

        conn.query(sql, values,
            function (err, results) {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                else
                    res.status(StatusCodes.OK).json(results);
            }
        )
    }
}; // 좋아요 추가

const removeLike = function(req, res){
    const book_id = req.params.id; 

    let decodedJwt = authorizationUser(req, res);
    
    if (decodedJwt instanceof jwt.TokenExpiredError) { // expired 에러
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        });
    } else if (decodedJwt instanceof jwt.JsonWebTokenError) { // 토큰 에러
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰입니다."
        });
    } else {
        let sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
        let values = [decodedJwt.id, book_id];

        conn.query(sql, values,
            function (err, results) {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                else
                    res.status(StatusCodes.OK).json(results);
            }
        )
    }
}; // 좋아요 삭제

module.exports = {
    addLike,
    removeLike
};