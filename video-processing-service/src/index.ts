import express from 'express';
//import ffmpeg from 'fluent-ffmpeg';
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from './storage';
import { isVideoNew, setVideo } from './firestore';

setupDirectories();

const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// console.log(ffmpegInstaller.path, ffmpegInstaller.version);

module.exports = ffmpeg;

const app = express();
app.use(express.json());

//hitting this endpoint will convert a video (inputfilepath) to a 360p video (outputfilepath)
//this endpoint will not be hit by any user, but by the cloud pub/sub message
app.post('/process-video', async (req, res) => {
    //get the bucket and filename from the cloud pub/sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error('invalid message payload received');
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).send('Bad request: missing filename');
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];

    if (!isVideoNew(videoId)) {
        return res.status(404).send('bad request: video already processed');
    }
    else {
        await setVideo(videoId, {
            id: videoId,
            uid: videoId.split('-')[0],
            status: "processing"
        })
    }

    //for downloading the raw video from cloud storage
    await downloadRawVideo(inputFileName
    )

    //convert the video to 360p
    try {
        await convertVideo(inputFileName, outputFileName);
    }
    catch (err) {
        //catching errors using Promise.all
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ])
        console.log(err);
        return res.status(500).send('internal server error: video could not be converted')
    }

    //uploading the processed video to cloud storage
    await uploadProcessedVideo(outputFileName);

    await setVideo(videoId, {
        status: 'processed',
        filename: outputFileName
    })

    await Promise.all([
		deleteRawVideo(inputFileName),
		deleteProcessedVideo(outputFileName),
    ]);
    
    return res.status(200).send('processing finished successfully');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Vide processing service listening on port ' + port);
});
