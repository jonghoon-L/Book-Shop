const mariadb = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes'); // status code 모듈
const jwt = require("jsonwebtoken");
const authorizationUser = require('../auth'); // JWT 인증 모듈

const order = async function (req, res){
    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: '3632015jj',
        database: 'BookShop',
        dateStrings: true
    });

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

        const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

        // delivery
        let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);`;
        let values = [delivery.address, delivery.receiver, delivery.contact];
        let [results] = await conn.execute(sql, values);
        let delivery_id = results.insertId;

        // orders
        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
            VALUES (?, ?, ?, ?, ?)`;
        values = [firstBookTitle, totalQuantity, totalPrice, decodedJwt.id, delivery_id];
        [results] = await conn.execute(sql, values);
        let order_id = results.insertId;

        // body의 items를 가지고 장바구니에서 book_id, quantity를 조회
        sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?);`
        let [orderItems, fields] = await conn.query(sql, [items]);

        // orderedBook
        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`;
        values = []; // 2차원 배열의 요소들을 하나씩 꺼냄
        orderItems.forEach((item) => { // 장바구니에서 조회한 값으로 삽입
            values.push([order_id, item.book_id, item.quantity]);
        })

        results[0] = await conn.query(sql, [values]);

        // 장바구니 삭제
        let result = await deleteCartItems(conn, items);

        return res.status(StatusCodes.OK).json(result);
    }

}; // 주문하기

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;
    let values = [];

    return await conn.query(sql, [items]);
}; // 장바구니 삭제

const getOrders = async function(req, res){
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
        const conn = await mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: '3632015jj',
            database: 'BookShop',
            dateStrings: true
        });

        let sql = `SELECT orders.id, created_at, address, receiver,
                contact, book_title, total_quantity, total_price
                FROM orders LEFT JOIN delivery
                ON orders.delivery_id = delivery.id;`;

        let [rows, fields] = await conn.query(sql);
        return res.status(StatusCodes.OK).json(rows);
    }
}; // 주문 목록 조회

const getOrderDetail = async function(req, res){
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
        const orderId = req.params.id;

        const conn = await mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: '3632015jj',
            database: 'BookShop',
            dateStrings: true
        });

        let sql = `SELECT book_id, title, author, price, quantity 
                FROM orderedBook LEFT JOIN books
                ON orderedBook.book_id = books.id
                WHERE order_id = ?`;

        let [rows, fields] = await conn.query(sql, [orderId]);
        return res.status(StatusCodes.OK).json(rows);
    }
}; // 주문 상세 상품 조회

module.exports = {
    order, 
    getOrders, 
    getOrderDetail
};