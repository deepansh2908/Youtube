import styles from './page.module.css'
import { getVideos } from './firebase/functions'
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const videos = await getVideos();


  return (
    <main>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={ video.id }>
            <Image
              width={120}
              height={80}
              src="/youtube-logo.svg"
              alt="Video Thumbnail"
              className={styles.thumbnail}
            />
          </Link>
        ))
      }
		</main>
  )
}
