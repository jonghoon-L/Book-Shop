import React from "react";
import styled from "styled-components"
import { ColorKey, HeadingSize } from "../../style/theme";

interface Props {
    children : React.ReactNode;
    size : HeadingSize;
    color ?: ColorKey; // optional
}

const TitleStyle = styled.h1<Omit<Props, 'children'>>`
    font-size : ${({theme, size}) => theme.heading[size].fontSize};
    color : ${({theme, color}) => color ? theme.color[color] : theme.color.primary};
`; // Props의 타입이지만 children은 제외

function Title({children, size, color} : Props) {
    return <TitleStyle size = {size} color = {color}> {children} </TitleStyle>
}

export default Title;