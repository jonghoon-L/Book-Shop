import styled from "styled-components"
import { BookDetail } from "../../models/book.model";
import Button from "../Common/Button";
import { FaHeart } from "react-icons/fa";

interface Props {
    book : BookDetail;
    onClick : () => void;
}

function LikeButton({book, onClick} : Props) {
    return(
        <LikeButtonStyle 
        size="medium" 
        scheme={book.liked ? 'like' : 'normal'} 
        onClick={onClick}>
            <FaHeart />
            {book.likes}
        </LikeButtonStyle>
    );
}

const LikeButtonStyle = styled(Button)`
    display : flex;
    gap : 6px;

    svg {
        color : inherit;
        * {
            color : inherit;
        }
    }
`;

export default LikeButton;