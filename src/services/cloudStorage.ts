import { GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs, { ReadStream } from 'fs'
import { BACKUP_PATH } from '../'
import { S3_ACCESS_KEY_ID, S3_BUCKET, S3_ENDPOINT_URL, S3_SECRET_ACCESS_KEY, S3_REGION } from './initialParams'

const s3Client = new S3Client({
  credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
  endpoint: S3_ENDPOINT_URL,
  region: S3_REGION,
})

export const uploadToCloudStorage = async (newestBackupFile: string) => {
  const fileStream = fs.createReadStream(`${BACKUP_PATH}/${newestBackupFile}`)
  const uploadParams = {
    Bucket: S3_BUCKET,
    Key: newestBackupFile,
    Body: fileStream,
    ACL: 'private',
  }
  const data = await s3Client.send(new PutObjectCommand(uploadParams))
  console.log('Successfully uploaded', data)
  return data
}

export const getBucketList = async () => {
  const bucketParams = { Bucket: S3_BUCKET }
  const data = await s3Client.send(new ListObjectsCommand(bucketParams))
  console.log('Successfully got bucket list', data)
  return data
}

export const downloadFromCloudStorage = async (fileName: string): Promise<ReadStream> => {
  const bucketParams = {
    Bucket: S3_BUCKET,
    Key: fileName,
  }
  const data = await s3Client.send(new GetObjectCommand(bucketParams))
  return data.Body as ReadStream
}
