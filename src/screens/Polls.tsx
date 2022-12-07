import { useEffect, useState, useCallback } from 'react'
import { VStack, Icon, useToast, FlatList} from 'native-base'
import { Octicons } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { api } from '../services/api'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { PoolCard, PoolCardProps } from '../components/PoolCard'
import { Loading } from '../components/Loading'
import { EmptyPoolList } from '../components/EmptyPoolList'

export function Polls(){
  const [isLoading, setIsLoading] = useState(true)
  const [polls, setPolls] = useState<PoolCardProps[]>([])


  const { navigate } = useNavigation()
  const toast = useToast()

  async function fetchPolls() {
    try {
      setIsLoading(true)
      const response = await api.get('/polls')
      setPolls(response.data.polls)

    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Não foi possível exebir os bolões',
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false)
    }
  }

  //uso do useFocusEffect por se tratar da navegação em tabs onde o componente está montado e não inicia de novo
  //o que faz o useEffect executar somente na primeira vez.
  //o uso do useCallBack é para garantir que o useFocusEffect não execute múltiplas vezes, garantindo performace. Pois ela executa sempre 
  //que o foco tiver nela
  useFocusEffect(useCallback(()=> {
    fetchPolls()

  }, []))

  return (
    <VStack flex={1} bgColor="gray.900" >
      <Header title='Meus bolões' />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4} >
        <Button 
          title='BUSCAR BOLÃO POR CÓDIGO'
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find') } 
        />

      </VStack>
      
      {
        isLoading ?
        <Loading />
        :
        <FlatList 
          data={polls}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PoolCard 
              data={item} 
              onPress={()=> navigate('details', { id: item.id})}
            />
          )}
          ListEmptyComponent={() => <EmptyPoolList /> }
          px={5}
          showsVerticalScrollIndicator={false}
          //espaço do último item do flatlist com a barra 
          _contentContainerStyle={{ pb: 10}}
        />
      }

    </VStack>
  )
}
