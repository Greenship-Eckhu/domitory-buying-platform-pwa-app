import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'

interface HeaderProps {
  title?: string
  showBackButton?: boolean
}

function Header({ title, showBackButton }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()

  // 홈 페이지인지 확인
  const isHomePage = location.pathname === '/'

  // showBackButton이 명시되지 않으면 홈 페이지가 아닐 때 자동으로 표시
  const shouldShowBackButton = showBackButton !== undefined ? showBackButton : !isHomePage

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <HeaderContainer>
      <LeftSection>
        {shouldShowBackButton && (
          <BackButton onClick={handleBack}>
            ←
          </BackButton>
        )}
      </LeftSection>
      <TitleSection>
        {title && <Title>{title}</Title>}
      </TitleSection>
      <RightSection />
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 56px;
  padding: 0 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  z-index: 100;

  @media (prefers-color-scheme: dark) {
    background-color: #1c1c1e;
    border-bottom-color: #38383a;
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  min-width: 60px;
`

const TitleSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  min-width: 60px;
  justify-content: flex-end;
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 24px;
  color: #007AFF;
  transition: background-color 0.2s ease;
  border-radius: 8px;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #e0e0e0;
  }

  @media (prefers-color-scheme: dark) {
    color: #0A84FF;

    &:hover {
      background-color: #2c2c2e;
    }

    &:active {
      background-color: #38383a;
    }
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #000000;

  @media (prefers-color-scheme: dark) {
    color: #ffffff;
  }
`

export default Header
