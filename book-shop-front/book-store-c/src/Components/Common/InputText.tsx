import React, { ForwardedRef } from "react";
import styled from "styled-components";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> { // Input 태그로 들어오는 모든 attribute에 맞게 
    placeholder ?: string;
    inputType ?: 'text' | 'email' | 'password' | 'number';
}

const InputText = React.forwardRef(({placeholder, inputType, onChange, ...props} : Props, ref : ForwardedRef<HTMLInputElement>) => {
    return(
        <InputTextStyle placeholder={placeholder} ref
        ={ref} type={inputType} onChange={onChange} {...props}/>
    )
})

const InputTextStyle = styled.input`
    padding : 0.25rem 0.75rem;
    border : 1px solid ${({theme}) => theme.border};
    border-radius : ${({theme}) => theme.borderRadius.default};
    font-size : 1rem;
    line-height : 1.5;
    color : ${({theme}) => theme.color.text};
`;

export default InputText;