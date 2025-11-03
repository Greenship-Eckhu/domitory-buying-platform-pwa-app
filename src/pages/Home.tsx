import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {THEME} from "@/constants/theme.ts";
import ScrollView from "@/components/ScrollView.tsx";
import Screen from "@/components/Screen.tsx";

function Home() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleAddProduct = () => {
    setError('');

    if (!url.trim()) {
      setError('상품 URL을 입력해주세요');
      return;
    }

    // 간단한 URL 유효성 검사
    if (!url.includes('coupang.com')) {
      setError('쿠팡 상품 링크만 입력 가능합니다');
      return;
    }

    navigate(`/add-product?url=${encodeURIComponent(url.trim())}`);
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
    } catch (err) {
      setError('클립보드 읽기 권한이 필요합니다');
    }
  }

  return (
    <Screen showHeader={false} backgroundColor={THEME.colors.theme1}>
      <TopSection>
        <WelcomeContainer>
          <Title>ECKHU</Title>
          <Subtitle>공동구매 플랫폼</Subtitle>
        </WelcomeContainer>
      </TopSection>
      <InfoContainer>
        <InfoTitle>상품 추가하기</InfoTitle>

        <InputSection>
          <InputWrapper>
            <UrlInput
              type="text"
              placeholder="쿠팡 상품 링크를 붙여넣으세요"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddProduct();
                }
              }}
            />
            <PasteButton onClick={handlePaste}>
              📋 붙여넣기
            </PasteButton>
          </InputWrapper>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <AddButton onClick={handleAddProduct}>
            상품 추가하기
          </AddButton>
        </InputSection>

        <Divider />

        <InfoTitle>사용 방법</InfoTitle>
        <InfoCard>
          <InfoStep>1️⃣</InfoStep>
          <InfoText>쿠팡 앱/웹에서 원하는 상품을 찾으세요</InfoText>
        </InfoCard>
        <InfoCard>
          <InfoStep>2️⃣</InfoStep>
          <InfoText>상품 링크를 복사하세요</InfoText>
        </InfoCard>
        <InfoCard>
          <InfoStep>3️⃣</InfoStep>
          <InfoText>위 입력창에 붙여넣고 "상품 추가하기" 버튼을 누르세요</InfoText>
        </InfoCard>
        <InfoNote>
          💡 상품명, 이미지, 가격, 수량 정보를 자동으로 추출합니다.
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

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
`

const InputWrapper = styled.div`
    display: flex;
    gap: 8px;
`

const UrlInput = styled.input`
    flex: 1;
    padding: 14px 16px;
    font-size: 14px;
    border: 2px solid ${THEME.colors.theme2};
    border-radius: 12px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
        border-color: ${THEME.colors.theme3};
    }

    &::placeholder {
        color: #999;
    }
`

const PasteButton = styled.button`
    padding: 14px 16px;
    font-size: 14px;
    font-weight: 600;
    background-color: ${THEME.colors.theme2};
    color: ${THEME.colors.theme4};
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
        background-color: ${THEME.colors.theme3};
        color: white;
    }

    &:active {
        transform: scale(0.98);
    }
`

const AddButton = styled.button`
    width: 100%;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    background-color: ${THEME.colors.theme3};
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${THEME.colors.theme4};
    }

    &:active {
        transform: scale(0.98);
    }
`

const ErrorMessage = styled.p`
    color: #ff4444;
    font-size: 13px;
    margin: 0;
    padding: 0 4px;
`

const Divider = styled.div`
    height: 1px;
    background-color: #e0e0e0;
    margin: 24px 0;
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
