import {render, screen} from '@testing-library/react'
import Title from './Title'
import { BookStoreThemeProvider } from '../../context/themeContext'

describe('Title 컴포넌트 테스트', () => {
    it('렌더를 확인', () => {
        render( // 1 렌더
            <BookStoreThemeProvider>
                <Title size='large'> 제목 </Title>
            </BookStoreThemeProvider>
        );
        expect(screen.getByText('제목')).toBeInTheDocument(); // 2 확인
    });

    it('size props 적용', () => {
        const {container} = render( // 1 렌더
            <BookStoreThemeProvider>
                <Title size='large'> 제목 </Title>
            </BookStoreThemeProvider>
        );
        expect(container?.firstChild).toHaveStyle({fontSize : '2ren'});
    });

    it('color props 적용',() => {
        const {container} = render( // 1 렌더
            <BookStoreThemeProvider>
                <Title size='large'> 제목 </Title>
            </BookStoreThemeProvider>
        );
        expect(container?.firstChild).toHaveStyle({color : 'brown'});
    })
});