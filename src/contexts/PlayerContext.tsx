import {createContext, useState, useContext, ReactNode} from 'react';

//tipagem

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}


type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    isPlaying: boolean,
    togglePlay: () => void,
    play: (episode: Episode) => void,
    setIsPlayingState: (state: boolean) => void,
    playList: (List: Episode[], index: number) => void,
    playNext: () => void,
    playPrevious: () => void,
    hasNext: boolean,
    hasPrevious: boolean,
    isLooping: boolean,
    isOnRandom: boolean
    toggleLoop: () => void,
    toggleRandom: () => void,
    clearPlayer: () => void

};

type PlayerContextProviderProps = {
  children: ReactNode; //conteudo jsx 
}

//

export const PlayerContext =  createContext({} as PlayerContextData) //indica que tipo de dado irei passar
                                                    //exemplo objeto no formato PlayerContextData

export function PlayerContextProvider({children}: PlayerContextProviderProps){

        //declaração de estado

        const [episodeList, setEpisodeList] = useState([])
        const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
        const [isPlaying, setIsPlaying] = useState(false)
        const [isLooping, setIsLooping] = useState(false)
        const [isOnRandom, setIsRandom] = useState(false)

        //
      
        //functions

        function play(episode: Episode){
          setEpisodeList([episode]);
          setCurrentEpisodeIndex(0);
          setIsPlaying(true);
          setIsPlayingState(true);
        }

        function playList(List: Episode[], index: number) {
          setEpisodeList(List);
          setCurrentEpisodeIndex(index);
          setIsPlaying(true);
          setIsPlayingState(true);
        }
      
        function togglePlay(){
          setIsPlaying(!setIsPlaying);
        }

        function toggleLoop(){
          setIsLooping(!isLooping);
        }

        function toggleRandom(){
          setIsRandom(!isOnRandom);
        }
      
        function setIsPlayingState(state: boolean) {
          setIsPlaying(state);
        }

        const hasNext = isOnRandom || (currentEpisodeIndex + 1) < episodeList.length;
        const hasPrevious = currentEpisodeIndex > 0;
      
        function playNext(){
          if(isOnRandom){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
          }else if(hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
          }
        }

        function playPrevious(){
          if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
          }
        }

        function clearPlayer(){
          setEpisodeList([])
          setCurrentEpisodeIndex(0)
        }



        //

        return (
          <PlayerContext.Provider value={{
              episodeList, 
              currentEpisodeIndex, 
              play, 
              isPlaying, 
              togglePlay, 
              setIsPlayingState,
              playList,
              playNext,
              playPrevious,
              hasNext,
              hasPrevious,
              toggleLoop,
              isLooping,
              isOnRandom,
              toggleRandom,
              clearPlayer
            }}>

            {children}
            
          </PlayerContext.Provider>
        )

}