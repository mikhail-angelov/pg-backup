import AWS from 'aws-sdk'
import fs from 'fs'
import { BACKUP_PATH } from '../'
import { S3_ACCESS_KEY_ID, S3_BUCKET, S3_ENDPOINT_URL, S3_SECRET_ACCESS_KEY } from './env'

const getS3Instance = () => {
    const spacesEndpoint = new AWS.Endpoint(S3_ENDPOINT_URL)
    return new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
    });
}

export const uploadToCloudStorage = async (newestBackupFile: string) => {
    const s3Instance = getS3Instance()
    const fileStream = fs.createReadStream(`${BACKUP_PATH}/${newestBackupFile}`)
    const uploadParams = {
        Bucket: S3_BUCKET,
        Key: newestBackupFile,
        Body: fileStream,
        ACL: 'private',
    }

    return new Promise<AWS.S3.ManagedUpload.SendData>((response, reject) =>
        s3Instance.upload(uploadParams, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
            if (err) {
                console.log('Error: ', err);
                reject(err);
            } else {
                console.log('Success', data);
                response(data);
            }
        })
    )
}

export const getBucketList = async () => {
    const s3Instance = getS3Instance()
    const bucketParams = { Bucket: S3_BUCKET }
    return new Promise((response: (value: AWS.S3.ListObjectsOutput) => void, reject: (reason: AWS.AWSError) => void) =>
        s3Instance.listObjects(bucketParams, (err, data) => {
            if (err) {
                console.log('Error: ', err);
                reject(err);
            } else {
                console.log('Success', data);
                response(data);
            }
        })
    )
}

export const downloadFromCloudStorage = async (fileName: string) => {
    const s3Instance = getS3Instance()
    const bucketParams = {
        Bucket: S3_BUCKET,
        Key: fileName,
    }
    return new Promise((response, reject) =>
        s3Instance.getObject(bucketParams, (err, data: AWS.S3.GetObjectOutput) => {
            if (err) {
                console.log('Error: ', err);
                reject(err);
            }
            console.log('Success', data);
            response(data);            
        })
    )
}