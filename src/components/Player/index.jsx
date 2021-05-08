import {useContext, useEffect, useRef, HTMLAudioElement, useState } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import Image from 'next/image';
import {convertToTypeString} from '../../utils/ConvertTime'


export function Player(){
    const audioRef = useRef();
    const [progress, setProgress] = useState(0);

    function setupProgressListener (){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        }) 
    }
    
    

    const {
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        isLooping, 
        isOnRandom,
        togglePlay, 
        toggleLoop,
        toggleRandom,
        setIsPlayingState, 
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        clearPlayer} = useContext(PlayerContext);

    const { play } = useContext(PlayerContext);

    const episode = episodeList[currentEpisodeIndex]

    useEffect(() => {
            if(!audioRef.current){
                return;
            }if(isPlaying){
                audioRef.current.play();
            }else{
                audioRef.current.pause();
            }
        }, [isPlaying])

    
    function handleSeek(amount){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext();
        }else{
            clearPlayer();
        }
    }

    return(
       <div className={styles.playerContainer}>
           <header>
               <img src="/playing.svg" alt="Playing"/>
               <strong>Tocando agora</strong>
           </header>

           { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={232} height={232} objectFit='cover' src={episode.thumbnail} alt={episode.title}
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
               </div>
           ) : (
               <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
               </div>
           )}
           

           <footer className={!episode ? styles.empty: ''}>
               <div className={styles.progress}>
                    <span>{convertToTypeString(progress)}</span>
                    
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{backgroundColor: '#04d361'}}//ja ouvida
                                railStyle={{backgroundColor: '#9f75ff'}}//parte nao ouvida
                                handleStyle={{borderColor: '#04d361', borderWidth: 3}}
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                            />
                        ): (
                            <div className={styles.emptySlider}/>
                        )}
                    </div>

                    <span>{convertToTypeString(episode?.duration ?? 0)}</span>
               </div>

                    {episode && ( //&& so ocorre se if for verdadeiro , || so ocorre se o else for verdadeiro
                        <audio 
                            src={episode.url}
                            ref={audioRef} 
                            autoPlay 
                            loop={isLooping}
                            onPlay={() => setIsPlayingState(true)} 
                            onPause={() => setIsPlayingState(false)}
                            onLoadedMetadata={setupProgressListener}
                            onEnded={handleEpisodeEnded}
                        />
                    )}

               <div className={styles.buttons}>
                   <button type="button" disabled={!episode || !hasPrevious && !hasNext} onClick={() => toggleRandom()} className={isOnRandom ? styles.IsActive : ''}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                   </button>

                   <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()}>
                        <img src="/play-previous.svg" alt="Anterior"/>
                   </button>
                       {isPlaying ? (
                           <button type="button" className={styles.playButton} disabled={!episode} onClick={() => togglePlay()}>
                            <img src="/Pause.svg" alt='pausar'/>    
                            </button>                    
                       ) : (
                        <button 
                            type="button" 
                            className={styles.playButton} 
                            disabled={!episode} 
                            onClick={() => togglePlay()} onClick={() => play(episode)}
                        >

                            <img src="/play.svg" alt="Tocar" />

                        </button>
                       )}
                   <button type="button" disabled={!episode || !hasNext} onClick={() => playNext()}>
                        <img src="/play-next.svg" alt="Tocar próximo"/>
                   </button>
                   <button type="button" disabled={!episode} onClick={() => toggleLoop()} className={isLooping ? styles.IsActive : ''} >
                        <img src="/repeat.svg" alt="Repetir"/>
                   </button>
               </div>  
           </footer>
       </div>
    )
}