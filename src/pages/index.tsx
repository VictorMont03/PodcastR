//SPA - informações carregadas após o acesso do usuário á pagina
//SSR (server side rendering) - executa a função getServerSideprops antes de carregar a página/ exporta os dados mesmo com JS desativado
//SSG (static side generation) - para pages que não sofre alterações diretas/ sem requisições a cada acesso

import {useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import { GetStaticProps } from 'next';
import {api} from '../services/api';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { convertToTypeString } from '../utils/ConvertTime';
import styles from './home.module.scss';
import Image from 'next/image';

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

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[]
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  const { playList } = useContext(PlayerContext);

  const episodesList = [... latestEpisodes, ... allEpisodes];

  return (
    <div className={styles.homepage}>
       <section className={styles.latestEpisodes}>
          <h2>Últimos lançamentos</h2>
          <ul>
            {latestEpisodes.map((episode, index) => {
                return (
                  <li key={episode.id}>
                    
                    <div style={{width: 72}}>
                      <Image width={192} height={192} objectFit='cover' src={episode.thumbnail} alt={episode.title}/>
                    </div>
                    
                    <div className={styles.episodeDetails}>
                      
                      <Link href={`/episode/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                      <p>{episode.members}</p>
                      <span>{episode.publishedAt}</span>
                      <span className={styles.lastspan}>{episode.durationAsString}</span>

                      <button type="button" onClick={() => playList(episodesList, index)}>
                        <img src="/play-green.svg" alt="play podcast"/>
                      </button>
                    </div>
                  </li>
                )
            })}
          </ul>
       </section>

       <section className={styles.allEpisodes}>
            <h2>Todos os episódios</h2>

            <table cellSpacing={0}>
              <thead>
                <tr>
                   <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
                </tr>
              </thead>
              <tbody>
                {allEpisodes.map((episode, index) => {
                  return(
                    <tr key={episode.id}>
                      <td style={{width: 70}}>
                        <Image
                          width={120}
                          height={120}
                          src={episode.thumbnail}
                          alt={episode.title}
                          objectFit='cover'
                          />
                        </td>
                        <td>
                          <Link href={`/episode/${episode.id}`}>
                            <a>{episode.title}</a>
                          </Link>
                        </td>
                        <td>{episode.members}</td>
                        <td style={{width: 100}}>{episode.publishedAt}</td>
                        <td>{episode.durationAsString}</td>
                        <td>
                          <button type="button" onClick={() => playList(episodesList, index + latestEpisodes.length)}>
                            <img src="/play-green.svg" alt="Tocar episódio"/>
                          </button>
                        </td>
                      
                    </tr>
                  )
                })}
              </tbody>
            </table>
       </section>
    </div>
   
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get('episodes?_limit=12&_sort=published_at&_order=desc');
  const data = response.data;

  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR,}),
      duration: Number(episode.file.duration),
      durationAsString: convertToTypeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
      thumbnail: episode.thumbnail
    }
  })

  const latestEpisodes = episodes.slice(0,2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return{
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60*60*8, //tempo para nova chamada em segundos
  }
}