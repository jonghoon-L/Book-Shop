const express = require('express');
const router = express.Router();
const {allBooks, eachBooks} = require('../controller/BookController');
router.use(express.json()); // post에서는 router.use가 추가적으로 필요했음

// 전체 도서 및 카테고리 별 도서 조회
router.get('/', allBooks);

// 개별 도서 조회
router.get('/:id', eachBooks);

module.exports = router