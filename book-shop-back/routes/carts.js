const express = require('express');
const router = express.Router();
const { addToCart, getCartItems, deleteCartItem } = require('../controller/CartController');
router.use(express.json()); // post에서는 router.use가 추가적으로 필요했음

// 장바구니 담기
router.post('/', addToCart);

// 특정 회원의 장바구니 조회 및 선택한 장바구니 상품 목록 조회
router.get('/', getCartItems);

// 장바구니 도서 삭제
router.delete('/:id', deleteCartItem);

module.exports = router