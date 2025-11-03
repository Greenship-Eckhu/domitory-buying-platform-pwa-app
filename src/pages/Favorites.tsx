import styled from 'styled-components'
import Screen from '@/components/Screen'
import ScrollView from '@/components/ScrollView'

function Favorites() {
  return (
    <Screen title="Favorites">
      <ScrollContainer>
        <h1>Favorites</h1>
        <p>Your favorite items</p>
      </ScrollContainer>
    </Screen>
  )
}

const ScrollContainer = styled(ScrollView)`
  padding: 20px;
`

export default Favorites
