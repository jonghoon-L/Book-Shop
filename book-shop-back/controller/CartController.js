const conn = require('../mariadb'); // mariadb 연결 모듈 
const {StatusCodes} = require('http-status-codes'); // status code 모듈
const jwt = require("jsonwebtoken");
const authorizationUser = require('../auth'); // JWT 인증 모듈

const addToCart = function(req, res){
    const {book_id, quantity} = req.body;
    
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
        let sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;
        let values = [book_id, quantity, decodedJwt.id];

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
} // 장바구니 담기

const getCartItems = function(req, res){
    const {selected} = req.body;

    let decodedJwt = authorizationUser(req, res);

    if (decodedJwt instanceof jwt.TokenExpiredError) { // expired 에러
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        }); 
    } else if (decodedJwt instanceof jwt.JsonWebTokenError) { // 토큰 에러
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰입니다."
        });
    } else { // 기본은 장바구니 전체 조회
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
                FROM cartItems LEFT JOIN books
                ON cartItems.book_id = books.id
                WHERE user_id = ?`;

        let values = [decodedJwt.id];

        if(selected) { // 장바구니 선택 조회
            sql += ` AND cartItems.id IN (?)`;
            values.push(selected);
        }

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

} // 특정 회원의 선택한 장바구니 목록 조회

const deleteCartItem = function(req, res){
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
        const cartItemId = req.params.id;

        let sql = `DELETE FROM cartItems WHERE id = ?`;

        conn.query(sql, cartItemId,
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
} // 장바구니 삭제

module.exports = {
    addToCart, 
    getCartItems, 
    deleteCartItem
};