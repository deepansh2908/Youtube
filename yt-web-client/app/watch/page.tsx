'use client';
import { useSearchParams } from "next/navigation";

export default function Watch() {
    const videoSrc = useSearchParams().get('v');
    const videoPrefix = 'https://storage.googleapis.com/deepansh2908-yt-processed-videos/';

    return (
		<div>
			<h1>Enjoy your video!</h1>
			<video controls src={videoPrefix + videoSrc} />
		</div>
	);
}