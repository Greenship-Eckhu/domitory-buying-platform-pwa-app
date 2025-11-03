import styled from 'styled-components'
import Screen from '@/components/Screen'
import ScrollView from '@/components/ScrollView'

function Profile() {
  return (
    <Screen title="Profile">
      <ScrollContainer>
        <h1>Profile</h1>
        <p>User profile information</p>
      </ScrollContainer>
    </Screen>
  )
}

const ScrollContainer = styled(ScrollView)`
  padding: 20px;
`

export default Profile
