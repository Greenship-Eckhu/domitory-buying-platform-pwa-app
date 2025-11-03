import styled from 'styled-components'
import Screen from '@/components/Screen'
import ScrollView from '@/components/ScrollView'

function Search() {
  return (
    <Screen title="Search">
      <ScrollContainer>
        <h1>Search</h1>
        <p>Search page content</p>
      </ScrollContainer>
    </Screen>
  )
}

const ScrollContainer = styled(ScrollView)`
  padding: 20px;
`

export default Search
