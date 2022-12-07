import { useEffect, useState } from 'react';
import { FlatList, useToast } from 'native-base';

import { api } from '../services/api'

import {Game, GameProps} from '../components/Game'
import {EmptyMyPoolList} from '../components/EmptyMyPoolList'
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoint, setFirstTeamPoint] = useState('')
  const [secondTeamPoint, setSecondTeamPoint] = useState('')

  const toast = useToast()
  
  async function fetchGames() {
    try {
      setIsLoading(true)

      const response = await api.get(`/polls/${poolId}/games`)
      setGames(response.data.games)
      
    } catch (error) {
      console.error(error)

      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if(!firstTeamPoint.trim() || !secondTeamPoint.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
      console.log(poolId +' ok '+ gameId)
      await api.post(`/polls/${poolId}/games/${gameId}/guesses`,{
        firstTeamPoint: Number(firstTeamPoint),
        secondTeamPoint: Number(secondTeamPoint),
      })

      toast.show({
        title: 'Palpite realizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })
      
      //executar a função que pega os jogos para atualizar o palpite
      fetchGames()

    } catch (error) {
      console.error(error)

      toast.show({
        title: 'Não foi possível enviar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      })
    } 
  }

  useEffect(()=>{
    fetchGames()
  }, [poolId])

  if(isLoading) {
    return <Loading />
  }

  return (
    <FlatList 
      data={games}
      keyExtractor={item => item.id }
      renderItem={({ item })=> (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoint}
          setSecondTeamPoints={setSecondTeamPoint}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10}}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
