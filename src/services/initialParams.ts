export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID as string
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY as string
export const S3_BUCKET = process.env.S3_BUCKET as string
export const S3_ENDPOINT_URL = process.env.S3_ENDPOINT_URL as string
export const S3_REGION = process.env.S3_REGION as string

export const DB_URL = process.env.DB_URL

export const TEST_SQL_QUERY = process.env.TEST_SQL_QUERY
export const TEMP_POSTGRES_CONTAINER_NAME = process.env.TEMP_POSTGRES_CONTAINER_NAME
export const TEMP_POSTGRES_DB = process.env.TEMP_POSTGRES_DB
export const TEMP_POSTGRES_USER = process.env.TEMP_POSTGRES_USER
export const TEMP_POSTGRES_PASSWORD = process.env.TEMP_POSTGRES_PASSWORD
export const TEMP_POSTGRES_PORT = process.env.TEMP_POSTGRES_PORT

export const TEMP_DB_URL = `postgresql://${TEMP_POSTGRES_USER}:${TEMP_POSTGRES_PASSWORD}@${TEMP_POSTGRES_CONTAINER_NAME}:${TEMP_POSTGRES_PORT}/${TEMP_POSTGRES_DB}`

const BACKUP_START_TIME = process.env.BACKUP_START_TIME as string
export let BACKUP_START_TIME_IN_MINUTES: number

const getTimeInMinutes = (value: string) => {
  const [hours, minutes] = value.split(':')
  return +hours * 60 + +minutes
}

const validateTimeFormat = (time?: string): boolean => {
  const time24hPattern = /^(((0?|1)[0-9]|2[0-3]):[0-5][0-9])$/
  return !!time && time24hPattern.test(time)
}

export const validateInitialParams = () => {
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
  if (!TEST_SQL_QUERY) {
    throw 'Please check "SQL query for test"'
  }
  if (!TEMP_POSTGRES_CONTAINER_NAME) {
    throw 'Please check "TEMP_POSTGRES_CONTAINER_NAME"'
  }
  if (!TEMP_POSTGRES_DB) {
    throw 'Please check "TEMP_POSTGRES_DB"'
  }
  if (!TEMP_POSTGRES_USER) {
    throw 'Please check "TEMP_POSTGRES_USER"'
  }
  if (!TEMP_POSTGRES_PASSWORD) {
    throw 'Please check "TEMP_POSTGRES_PASSWORD"'
  }
  if (!TEMP_POSTGRES_PORT) {
    throw 'Please check "TEMP_POSTGRES_PORT"'
  }
}
