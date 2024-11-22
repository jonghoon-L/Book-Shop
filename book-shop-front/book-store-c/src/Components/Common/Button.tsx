import styled from "styled-components"
import { ButtonScheme, ButtonSize } from "../../style/theme";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>{ // 매개변수 설정
    children : React.ReactNode;
    size : ButtonSize
    scheme : ButtonScheme
    disabled ?: boolean;
    isLoading ?: boolean;
}

function Button({children, size, scheme, disabled, isLoading, ...props} : Props) {
    return(
        <ButtonStyle // 매개변수 받아오기
        size={size} scheme={scheme} disabled={disabled} isLoading={isLoading} {...props}> 
            {children} 
        </ButtonStyle>
    )
}

const ButtonStyle = styled.button<Omit<Props, 'children'>>`
    font-size : ${({theme, size}) => theme.button[size].fontSize};
    color : ${({theme, scheme}) => theme.buttonScheme[scheme].color};
    background-color : ${({theme, scheme}) => theme.buttonScheme[scheme].backgroundColor};
    border : 0;
    border-radius : ${({theme}) => theme.borderRadius.default};
    padding : ${({theme, size}) => theme.button[size].padding};
    opacity : ${({disabled}) => (disabled ? 0.5 : 1)}; 
    pointer-events : ${({disabled}) => (disabled ? 'none' : 'auto')}; 
    cursor : ${({disabled}) => (disabled ? 'none' : 'pointer')}; 
`;

export default Button;