const conn = require('../mariadb'); // mariadb 연결 모듈 
const {StatusCodes} = require('http-status-codes'); // status code 모듈
const jwt = require("jsonwebtoken");
const authorizationUser = require('../auth'); // JWT 인증 모듈

const allBooks = function (req, res) {
    let allBooksRes = {};
    let { category_id , news, limit, currentPage } = req.query;
    // limit : page 당 도서 수
    // currentPage : 현재 몇 페이지 인지
    // offset : limit * (currentPage - 1)
    let offset = limit * (currentPage - 1);

    let sql =`SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM books`; // 기본 SQL 
    let values = [];

    if(category_id && news){
        sql += ` WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW()`;
        values.push(category_id);
    } else if(category_id){
        sql += ` WHERE category_id = ?`;
        values.push(category_id);
    } else if(news) {
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW()`;
    } // 둘 다 없으면 그냥 전체 도서 조회
    
    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), offset);

    conn.query(sql, values,
        function (err, results) {
            if (err) { // 쿼리에 문제가 있는 경우
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else if (results.length) {
                results.map(function(result){
                    result.pubDate = result.pub_date;
                    delete result.pub_date;
                });
                allBooksRes.books = results;
            }
            else
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "해당 책이 없습니다."
                })
        }
    )

    sql = "SELECT found_rows();";

    conn.query(sql,
        function (err, results) {
            if (err) { // 쿼리에 문제가 있는 경우
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            let pagination = {}; // pagination 구성
            pagination.currentPage = parseInt(currentPage);
            pagination.totalCount = results[0]["found_rows()"];

            allBooksRes.pagination = pagination;

            return res.status(StatusCodes.OK).json(allBooksRes);
        }
    )
}; // 카테고리 + 신간, 카테고리별, 신간, 전체 도서 목록 조회

const eachBooks = function (req, res) {

    let decodedJwt = authorizationUser(req, res);

    if (decodedJwt instanceof jwt.TokenExpiredError) { // expired 에러
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        });
    } else if (decodedJwt instanceof jwt.JsonWebTokenError) { // 토큰 에러
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰입니다."
        });
    } else if (decodedJwt instanceof ReferenceError) { // 토큰이 없는 비로그인 상태
        let book_id = req.params.id;

        let sql = `SELECT *,
                        (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes
                    FROM books 
                    LEFT JOIN category 
				    ON books.category_id = category.category_id
                    WHERE books.id=?;`;

        let values = [book_id];

        conn.query(sql, values,
            function (err, results) {
                if (err) { // 쿼리에 문제가 있는 경우
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                } else if (results.length)
                    return res.status(StatusCodes.OK).json(results[0]);
                else
                    return res.status(StatusCodes.NOT_FOUND).json({
                        message: "해당 책이 없습니다."
                })
            }
        )
    } else {
        let book_id = req.params.id;

        let sql = `SELECT *,
                        (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
                        (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
                    FROM books 
                    LEFT JOIN category 
				    ON books.category_id = category.category_id
                    WHERE books.id=?;`;

        let values = [decodedJwt.id, book_id, book_id];

        conn.query(sql, values,
            function (err, results) {
                if (err) { // 쿼리에 문제가 있는 경우
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                } else if (results.length)
                    return res.status(StatusCodes.OK).json(results[0]);
                else
                    return res.status(StatusCodes.NOT_FOUND).json({
                        message: "해당 책이 없습니다."
                })
            }
        )
    }
}; // 개별 도서 조회

module.exports = {
    allBooks,
    eachBooks
};