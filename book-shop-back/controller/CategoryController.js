const conn = require('../mariadb'); // mariadb 연결 모듈 
const {StatusCodes} = require('http-status-codes'); // status code 모듈

const allCategory = function (req, res){
    let sql = `SELECT * FROM category`;

    conn.query(sql, // body로 들어오는 것 없으므로 value x
        function (err, results) {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            else
                res.status(StatusCodes.OK).json(results);
        }
    )
} // 카테고리 전체 조회

module.exports = {
    allCategory
};