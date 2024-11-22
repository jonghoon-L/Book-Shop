import { fetchBanners } from "@/api/banner.api";
import { fetchBestBooks, fetchBooks } from "@/api/books.api";
import { fetchReviewAll } from "@/api/review.api";
import { Banner } from "@/models/banner.model";
import { Book, BookReviewItem } from "@/models/book.model";
import { useEffect, useState } from "react"

export const useMain = () => {
    const [reviews, setReviews] = useState<BookReviewItem[]>([]);
    const [newBooks, setNewBooks] = useState<Book[]>([]);
    const [bestBooks, setBestBooks] = useState<Book[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);

    useEffect(() => {
        fetchReviewAll().then((reviews) => {
            // 데이터를 배열로 변환
            if (Array.isArray(reviews)) {
                setReviews(reviews); // 이미 배열이면 그대로 설정
            } else if (reviews && typeof reviews === "object") {
                const reviewArray = Object.values(reviews); // 객체를 배열로 변환
                setReviews(reviewArray as BookReviewItem[]);
            } else {
                setReviews([]); // 기본값 처리
            }
        }).catch((error) => {
            console.error("Failed to fetch reviews:", error);
            setReviews([]); // 실패 시 빈 배열 설정
        });

        fetchBooks({
            category_id : undefined,
            news : true,
            currentPage : 1,
            limit : 4.
        }).then(({books}) => {
            setNewBooks(books);
        });

        fetchBestBooks().then((books) => {
            setBestBooks(books);
        });

        fetchBanners().then((banners) => {
            setBanners(banners);
        });

    }, []);
    

    return { reviews , newBooks, bestBooks, banners};
};