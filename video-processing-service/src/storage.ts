//this file will intearct with google cloud storage and local filesystem

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

//creating an instance
const storage = new Storage();

//this is where people will upload their videos
const rawVideoBucketName = "deepansh2908-yt-raw-videos";
//processed videos are uploaded here
const processedVideoBucketName = "deepansh2908-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

//creates local directory for raw and processed videos
export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

/** 
* @param rawVideoName - the name of file to convert from {@link localRawVideoPath}
* @param processedVideoName - the name of file to convert from {@link localProcessedVideoPath}
* @returns a promise that resolves when the video has been converted
*/

export function convertVideo(rawVideoName: string, processedVideoName: string) {
    //now wherever we use this function, we can resolve the promise and know if the function has completed execution
    return new Promise<void>((resolve, reject) => {
		//converting video to 360p resolution
		ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
			.outputOptions('-vf', 'scale=-1:360')
			.on('end', () => {
                console.log('Video processing finished successfully');
                //if video is processed, we resolve the promise and let the outer world know that video has been processed
                resolve();
			})
			.on('error', (err: any) => {
                console.log('An error occurred: ', err.message);
                //if video is not processed, we reject the promise and let the outer world know that video has not been processed
                reject(err);
			})
			.save(`${localProcessedVideoPath}/${processedVideoName}`);
	})
}

/** 
* @param fileName - name of the file to downwload from the
* {@link rawVideoBucketName} - bucket into the {@link localProcessedVideoPath} folder
* @returns a promise that resolves when the video has been converted
*/
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: `${localRawVideoPath}/${fileName}` })
    
    console.log(
		`gs://${rawVideoBucketName}/${fileName} downwloaded to ${localRawVideoPath}/${fileName}`
	);
}

/** 
* @param fileName - name of the file to upload from the
* {@link localProcessedVideoPath} - folder into the  {@link processedVideoBucketName} 
* @returns a promise that resolves when the video has been converted
*/
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });

    console.log(
		`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}`
	);

    await bucket.file(fileName).makePublic();
}

export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/** 
* @param filePath - path of file to delete
* @returns a promise that resolves when the video has been converted
*/
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath), (err:any) => {
                if (err) {
                    console.log(`failed to delete file at ${filePath}`, err);
                    reject(err);
                }
                else {
                    console.log(`file successfully deleted at ${filePath}`);
                    resolve();
                }
            };
        }
        else {
            console.log(`file not found at ${filePath}, skipping delete`);
            resolve();
        }
    });
}

//ensures a directory exists; also creates it if necessary
function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`directory created at ${dirPath}`);
    }
}