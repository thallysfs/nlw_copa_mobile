import { NavigationContainer } from '@react-navigation/native'
import { Box } from 'native-base'

import { useAuth } from '../hooks/useAuth'

import { AppRoutes } from './app.routes'
import { SignIn } from '../screens/SignIn'

export function Routes() {
  //desestruturando o user dentro do nosso contexto
  const { user } = useAuth();

  return (
    <Box flex={1} bg="gray.900" >
      <NavigationContainer>
        { user.name ? <AppRoutes /> : <SignIn />}
      </NavigationContainer>
    </Box>
  )
}
