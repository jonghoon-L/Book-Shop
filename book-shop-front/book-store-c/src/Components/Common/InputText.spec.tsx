import {render, screen} from '@testing-library/react'
import { BookStoreThemeProvider } from '../../context/themeContext'
import InputText from './InputText';
import React from 'react';

describe('InputText 컴포넌트 테스트', () => {
    it('렌더를 확인', () => {
        render( // 1 렌더
            <BookStoreThemeProvider>
                <InputText placeholder='여기에 입력'/>  
            </BookStoreThemeProvider>
        );
        expect(screen.getByPlaceholderText('여기에 입력')).toBeInTheDocument(); // 2 확인
    });
    it('forwardRef 테스트', () => {
        const ref = React.createRef<HTMLInputElement>();
        render( // 1 렌더
            <BookStoreThemeProvider>
                <InputText placeholder='여기에 입력' ref={ref}/>  
            </BookStoreThemeProvider>
        );
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    })
});