import { useEffect, useState } from "react"
import { BookDetail, BookReviewItem, BookReviewItemWrite } from "../models/book.model"
import { fetchBook, likeBook, unlikeBook } from "../api/books.api";
import { useAuthStore } from "../store/authStore";
import { useAlert } from "./useAlert";
import { addCart } from "../api/carts.api";
import { addBookReview, fetchBookReview } from "@/api/review.api";
import { useToast } from "./useToast";

export const useBook = (bookId : string | undefined) => {
    const [book, setBook] = useState<BookDetail | null>(null);
    const {isloggedIn} = useAuthStore();
    const showAlert = useAlert();
    const [cartAdded, setCartAdded] = useState(false);
    const [reviews, setReview] = useState<BookReviewItem[]>([]);
    const {showToast} = useToast();


    const likeToggle = () => {
        // 권한 확인(로그인)
       if (!isloggedIn) {
        showAlert('로그인이 필요합니다.');
        return;
       }

        if (!book) return;

        if (book.liked) {
            unlikeBook(book.id).then(() => {
                setBook({ // 좋아요 취소
                    ...book,
                    liked : false,
                    likes : book.likes - 1
                });
                showToast('좋아요가 취소되었습니다.');
            });
        } else {
            likeBook(book.id).then(() => {
                setBook({ // 좋아요 누르기
                    ...book,
                    liked : true,
                    likes : book.likes + 1
                });
                showToast('좋아요가 성공되었습니다.');
            });
        };
    };

    const addToCart = (quantity : number) => {
        if (!book) return;
        
        addCart({
            book_id : book.id,
            quantity : quantity
        }).then(() => {
            setCartAdded(true);
            setTimeout(() => {
                setCartAdded(false);
            }, 3000);
        });
    };

    useEffect(() => {
        if (!bookId) return;
        
        fetchBook(bookId)
            .then((book) => {
                setBook(book);
            })
            .catch((error) => {
                console.error("Failed to fetch book details:", error);
            });
    
        fetchBookReview(bookId)
            .then((reviews) => {
                // reviews가 배열인지 객체인지 확인하고 처리
                if (Array.isArray(reviews)) {
                    setReview(reviews);
                } else if (reviews && reviews.data) {
                    setReview(reviews.data); // 객체일 경우 data 속성에 배열이 있을 수 있음
                } else {
                    console.error("Invalid reviews data format:", reviews);
                    setReview([]);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch reviews:", error);
                setReview([]);
            });
    }, [bookId]);

    const addReview = (data : BookReviewItemWrite) => {
        if (!book) return;

        addBookReview(book.id.toString(), data).then((res) => {
            fetchBookReview(book.id.toString())
            .then((reviews) => {
                // reviews가 배열인지 객체인지 확인하고 처리
                if (Array.isArray(reviews)) {
                    setReview(reviews);
                } else if (reviews && reviews.data) {
                    setReview(reviews.data); // 객체일 경우 data 속성에 배열이 있을 수 있음
                } else {
                    console.error("Invalid reviews data format:", reviews);
                    setReview([]);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch reviews:", error);
                setReview([]);
            });
        })
    }
    

    return {book, likeToggle, addToCart, cartAdded, reviews, addReview};
};