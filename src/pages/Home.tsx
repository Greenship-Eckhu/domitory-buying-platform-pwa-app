import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {THEME} from "@/constants/theme.ts";
import ScrollView from "@/components/ScrollView.tsx";
import Screen from "@/components/Screen.tsx";

function Home() {
  const navigate = useNavigate();

  const handleTestShare = () => {
    // 테스트용: 쿠팡 상품 링크로 직접 이동
    const testUrl = 'https://www.coupang.com/vp/products/123456'
    navigate(`/add-product?url=${encodeURIComponent(testUrl)}`)
  }

  return (
    <Screen showHeader={false} backgroundColor={THEME.colors.theme1}>
      <TopSection>
        <WelcomeContainer>
          <Title>ECKHU</Title>
          <Subtitle>공동구매 플랫폼</Subtitle>
          <TestButton onClick={handleTestShare}>
            상품 추가 테스트
          </TestButton>
        </WelcomeContainer>
      </TopSection>
      <InfoContainer>
        <InfoTitle>사용 방법</InfoTitle>
        <InfoCard>
          <InfoStep>1️⃣</InfoStep>
          <InfoText>쿠팡에서 원하는 상품을 찾으세요</InfoText>
        </InfoCard>
        <InfoCard>
          <InfoStep>2️⃣</InfoStep>
          <InfoText>공유 버튼을 눌러 ECKHU로 공유하세요</InfoText>
        </InfoCard>
        <InfoCard>
          <InfoStep>3️⃣</InfoStep>
          <InfoText>자동으로 상품 정보가 추가됩니다!</InfoText>
        </InfoCard>
        <InfoNote>
          💡 쿠팡 상품 정보를 자동으로 파싱하여 상품명, 이미지, 가격, 수량을 추출합니다.
        </InfoNote>
      </InfoContainer>
    </Screen>
  )
}

const TopSection = styled.div`
    width: 100%;
    height: 30vh;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const WelcomeContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
`

const Title = styled.h1`
    font-size: 48px;
    font-weight: 700;
    color: ${THEME.colors.theme4};
    margin: 0;
`

const Subtitle = styled.p`
    font-size: 18px;
    color: ${THEME.colors.theme3};
    margin: 0;
`

const TestButton = styled.button`
    margin-top: 16px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    background-color: ${THEME.colors.theme3};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${THEME.colors.theme4};
    }

    &:active {
        transform: scale(0.98);
    }
`

const InfoContainer = styled(ScrollView)`
    background-color: #fff;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    height: 70vh;
    padding: 24px;
`

const InfoTitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
`

const InfoCard = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 12px;
    margin-bottom: 12px;
`

const InfoStep = styled.div`
    font-size: 24px;
    flex-shrink: 0;
`

const InfoText = styled.p`
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 4px 0 0 0;
`

const InfoNote = styled.div`
    padding: 12px 16px;
    background-color: ${THEME.colors.theme1};
    border-radius: 8px;
    font-size: 12px;
    color: ${THEME.colors.theme4};
    line-height: 1.5;
    margin-top: 12px;
`

export default Home
