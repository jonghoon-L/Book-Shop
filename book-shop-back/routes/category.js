const express = require('express');
const router = express.Router();
const {allCategory} = require('../controller/CategoryController');
router.use(express.json()); // post에서는 router.use가 추가적으로 필요했음

// 카테고리 전체 조회
router.get('/', allCategory);

module.exports = router