import {render, screen} from '@testing-library/react'
import Button from './Button'
import { BookStoreThemeProvider } from '../../context/themeContext'

describe('Button 컴포넌트 테스트', () => {
    it('렌더를 확인', () => {
        render( // 1 렌더
            <BookStoreThemeProvider>
                <Button size='large' scheme='primary'> 버튼 </Button>
            </BookStoreThemeProvider>
        );
        expect(screen.getByText('버튼')).toBeInTheDocument(); // 2 확인
    });
    it('size props 적용', () => {
        const {container} = render( // 1 렌더
            <BookStoreThemeProvider>
                <Button size='large'scheme='primary'> 버튼 </Button>
            </BookStoreThemeProvider>
        );
        expect(screen.getAllByRole('button')).toHaveStyle({fontSize : '1.5rem'});
    });
});