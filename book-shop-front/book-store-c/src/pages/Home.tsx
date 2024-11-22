import Banner from "@/Components/Common/banner/Banner";
import Title from "@/Components/Common/Title";
import MainBest from "@/Components/main/MainBest";
import MainNewBooks from "@/Components/main/MainNewBooks";
import MainReview from "@/Components/main/MainReview";
import { useMain } from "@/hooks/useMain";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styled from "styled-components";

function Home() {
    const { reviews, newBooks, bestBooks, banners } = useMain();
    const { isMobile } = useMediaQuery();

    return(
        <HomeStyle>
            <Banner banners={banners}/>
            <section className="section">
                <Title size="large"> 베스트 셀러 </Title>
                <MainBest books={bestBooks}/>
            </section>
            <section className="section">
                <Title size="large"> 신간 안내 </Title>
                <MainNewBooks books={newBooks}/>
            </section>
            <section className="section">
                <Title size="large"> 리뷰 </Title>
                <MainReview reviews={reviews}/>
            </section>
        </HomeStyle>
    )
}

const HomeStyle = styled.div`
    display : flex;
    flex-direction : column;
    gap : 24px;
`;

export default Home;



