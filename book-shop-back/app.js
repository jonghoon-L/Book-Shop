// express 모듈
const express = require('express');
const app = express();
const cors = require('cors');

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

// CORS 설정
const corsOptions = {
    origin: process.env.CORS_ORIGIN, // .env 파일에서 설정한 도메인 사용
    credentials: true,               // 인증 정보 포함 설정
};

// CORS 미들웨어 적용
app.use(cors(corsOptions));

// OPTIONS 요청에 대한 CORS 처리
app.options('*', cors());  // 모든 OPTIONS 요청에 대해 CORS 처리

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// 라우팅 기능
const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
