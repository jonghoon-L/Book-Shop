import styled from "styled-components";
import BooksItem from "./BookItem";
import { Book } from "../../models/book.model";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { QUERYSTRING } from "../../constants/querystring";
import { ViewMode } from "./BooksViewSwitcher";

interface Props {
    books : Book[];
}

function BooksList({books} : Props) {
    const [view, SetView] = useState<ViewMode>('grid');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get(QUERYSTRING.VIEW)) {
            SetView(params.get(QUERYSTRING.VIEW) as ViewMode);
        }
    }, [location.search]);

    return(
       <BooksListStyle view={view}>
        {books?.map((item) => (
            <BooksItem key = {item.id} book={item} view={view}/>
        ))}
       </BooksListStyle>
    )
}

interface BooksListStyleProps {
    view : ViewMode;
}

const BooksListStyle = styled.div<BooksListStyleProps>`
    display : grid;
    grid-template-columns : ${({view}) => (view === 'grid' ? 'repeat(4, 1fr)' : 'repeat(1,1fr)')}
    gap : 24px;
`;

export default BooksList;