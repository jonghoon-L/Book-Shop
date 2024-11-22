const express = require('express');
const router = express.Router();
const { addLike, removeLike } = require('../controller/LikeController');
router.use(express.json()); // post에서는 router.use가 추가적으로 필요했음

// 좋아요 추가
router.post('/:id', addLike);

// 좋아요 삭제
router.delete('/:id', removeLike);

module.exports = router