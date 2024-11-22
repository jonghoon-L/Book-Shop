import { FaSmileWink } from "react-icons/fa";
import styled from "styled-components";
import Title from "../Common/Title";
import { Link } from "react-router-dom";

function BooksEmpty() {
    return(
       <BookEmptyStyle>
        <div className="icon">
            <FaSmileWink />
        </div>
        <Title size="large" color="secondary">
            검색 결과가 없습니다.
        </Title>
        <p>
            <Link to='/books' >
                검색 결과로 이동
            </Link>
        </p>
       </BookEmptyStyle>
    )
}

const BookEmptyStyle = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    gap : 12px;
    padding : 120px 0;

    .icon {
        svg {
            font-size : 4rem;
            fil : #ccc;
        }
    }
`;

export default BooksEmpty;