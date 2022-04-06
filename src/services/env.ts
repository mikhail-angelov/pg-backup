import { getTimeInMinutes, validateTimeFormat } from "./checkTimeForBackup"

export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID as string
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY as string
export const S3_BUCKET = process.env.S3_BUCKET as string
export const S3_ENDPOINT_URL = process.env.S3_ENDPOINT_URL as string

export const DB_URL = process.env.DB_URL

const BACKUP_START_TIME = process.env.BACKUP_START_TIME as string
export let BACKUP_START_TIME_IN_MINUTES: number

export const compileDotEnv = () => {
    const isTimeValid = validateTimeFormat(BACKUP_START_TIME)
    if (!isTimeValid) {
        throw `BACKUP_START_TIME should be similar to "hh:mm", but not "${BACKUP_START_TIME}"`
    }
    BACKUP_START_TIME_IN_MINUTES = getTimeInMinutes(BACKUP_START_TIME)

    if (!S3_ACCESS_KEY_ID) {
        throw 'Please check "access key Id"'
    }
    if (!S3_SECRET_ACCESS_KEY) {
        throw 'Please check "secret access key"'
    }
    if (!S3_BUCKET) {
        throw 'Please check "bucket name"'
    }
    if (!S3_ENDPOINT_URL) {
        throw 'Please check "endpoint url"'
    }
    if (!DB_URL) {
        throw 'Please check "DB url"'
    }
}