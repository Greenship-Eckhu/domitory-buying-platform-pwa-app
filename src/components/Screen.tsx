import { ReactNode } from 'react'
import styled from 'styled-components'
import Header from '@/components/Header'

interface ScreenProps {
  children: ReactNode
  title?: string
  showHeader?: boolean
  showBackButton?: boolean
  backgroundColor?: string
}

function Screen({
  children,
  title,
  showHeader = true,
  showBackButton,
  backgroundColor
}: ScreenProps) {
  return (
    <ScreenContainer $backgroundColor={backgroundColor}>
      {showHeader && <Header title={title} showBackButton={showBackButton} />}
      <ContentArea>
        {children}
      </ContentArea>
    </ScreenContainer>
  )
}

const ScreenContainer = styled.div<{ $backgroundColor?: string }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.$backgroundColor || '#ffffff'};
`

const ContentArea = styled.div`
  flex: 1;
  width: 100%;
  overflow: hidden;
  position: relative;
`

export default Screen