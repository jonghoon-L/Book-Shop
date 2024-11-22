import styled from "styled-components";
import Title from "../Components/Common/Title";
import BooksFilter from "../Components/books/BooksFilter";
import BooksList from "../Components/books/BooksList";
import BooksEmpty from "../Components/books/BooksEmpty";
import BooksViewSwitcher from "../Components/books/BooksViewSwitcher";
import Loading from "@/Components/Common/Loading";
import { useBooksInfinite } from "@/hooks/useBooksInfinite";
import Button from "@/Components/Common/Button";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

function Books() {
    const {books, pagination, isEmpty, isBooksLoading, fetchNextPage, hasNextPage} = useBooksInfinite();

    const moreRef = useIntersectionObserver(
        ([entry]) => {
            if(entry.isIntersecting) {
                loadMore();
            }
        }
    );

    const loadMore = () => {
        if (!hasNextPage) return;
        fetchNextPage();
    };

    if (isEmpty) {
        return <BooksEmpty />;
    };

    if(!books || !pagination || isBooksLoading) {
        return <Loading />;
    };

    return(
        <>
            <Title size="large"> 도서 검색 결과 </Title>
            <BookStyle>
                <div className="filter">
                    <BooksFilter/>
                    <BooksViewSwitcher/>
                </div>
                <BooksList books={books} />
                <div className="more" ref={moreRef}>
                    <Button size="medium" scheme="normal" onClick={() => fetchNextPage()} disabled={!hasNextPage}>
                        {hasNextPage ? '더보기' : '마지막 페이지'}
                    </Button>
                </div>
            </BookStyle>
        </>
    );
};

const BookStyle = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : space-between;
    gap : 24px;

    .filter {
        display : flex;
        justify-content : space-between;
        align-items : center;
        padding : 20px 0;
    }
`;

export default Books;