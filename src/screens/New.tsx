import { useState } from 'react'
import { Text, VStack, Heading, useToast} from 'native-base'

import { api } from '../services/api'

import Logo from '../assets/logo.svg'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'

export function New(){
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()
  
  async function handlePollCreate(){
    //trim serve para remover o espaços para que não seja possível criar um nome de bolão com um espaço
    if(!title.trim()) {
      return toast.show({
        title: 'Informe um nome do bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    }

    try {
      setIsLoading(true)

      await api.post('/polls', {title})

      toast.show({
        title: 'Bolão criado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })

      setTitle('')
      
    } catch (error) {
      console.error(error)

      toast.show({
        title: 'Não foi possível criar o bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }


  } 

  return (
    <VStack flex={1} bgColor="gray.900" >
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center" >
        <Logo />

        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center" >
          Crie seu próprio bolão da copa {'\n'} e compartilhe entre amigos!
        </Heading>

        <Input
          marginBottom={2}
          placeholder="Qual o nome do seu bolão?"
          onChangeText={setTitle}
          value={title}
        />

        <Button
          title="CRIAR O MEU BOLÃO"
          onPress={handlePollCreate}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4} >
          Após criar o seu bolão, você receberá um código único 
          que poderá usar oara convidar outras pessoas.
        </Text>

      </VStack>

    </VStack>
  )
}
