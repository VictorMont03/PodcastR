import {useRouter} from 'next/router';
import {GetStaticProps, GetStaticPaths} from 'next'
import {api} from '../../services/api';
import { convertToTypeString } from '../../utils/ConvertTime';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './episode.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    description: string,
    members: string,
    duration: number,
    durationAsString: string,
    published_at: string,
    url: string,
    publishedAt: string
}


type EpisodeProps = {
    episode: Episode,
}


export default function Episode({episode}: EpisodeProps){
    const router = useRouter(); 

    const { play } = useContext(PlayerContext);
    return(
        <div className={styles.episode}>
            <div className={styles.thumbnailImage}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg"></img>
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    objectFit='cover'
                    src={episode.thumbnail}
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Play podcast"></img>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
             
             <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} /> 
        </div>
    )
    

}

export const getStaticPaths: GetStaticPaths = async () => {
    const {data} = await api.get('episodes?_limit=2&_sort=published_at&_order=desc');

    const paths = data.map(episode => {
        return{
            params: {
                slug: episode.id //passando como parametro o id do episodio 
            }                   // com isso no return da função as duas primeiras paginas serao carregadas de modo static
        }   
    })

    return{
        paths, //quais episodes eu vou querer gerar de forma estatica
        fallback: 'blocking', //dados carregados no server next.js, conformes as paginas sao acessadas
    }

    
}


export const getStaticProps: GetStaticProps = async (ctx) => {
    const {slug} = ctx.params;
    const {data} = await api.get(`/episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR,}),
        duration: Number(data.file.duration),
        durationAsString: convertToTypeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
        thumbnail: data.thumbnail
    }

    return{
        props:{
            episode,
        },
        revalidate: 60*60*24, //24hours
    }
        

}