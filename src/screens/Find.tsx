import { VStack, Heading, useToast} from 'native-base'
import { useState } from 'react'
import { api } from '../services/api'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { useNavigation } from '@react-navigation/native'

export function Find(){
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const toast = useToast()
  const { navigate } = useNavigation()
  

  async function handleJoinPoll() {
    try {
      setIsLoading(true)

      if(!code.trim()){
        setIsLoading(false)

        return toast.show({
          title: 'Informe um código',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post('/polls/join', { code })

      toast.show({
        title: 'Pesquisa com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })

      navigate('polls')
      setIsLoading(false)
      setCode('')

    } catch (error) {
      setIsLoading(false)
      console.log(error)

      if(error.reesponse?.data?.message === 'Poll not found') {
        return toast.show({
          title: 'Bolão não encontrado',
          placement: 'top',
          bgColor: 'red.500'
        })

      }

      if(error.reesponse?.data?.message === 'You alredy jpoined this poll') {
        return toast.show({
          title: 'Você já está nesse bolão!',
          placement: 'top',
          bgColor: 'red.500'
        })

      }

      toast.show({
        title: 'Erro ao procurar o bolão, tente mais tarde',
        placement: 'top',
        bgColor: 'red.500'
      })
      
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900" >
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center" >

        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center" >
          Encontre um bolão através de {'\n'} 
          seu código único
        </Heading>

        <Input
          marginBottom={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize='characters'
          onChangeText={setCode}
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPoll}
        />

      </VStack>

    </VStack>
  )
}
