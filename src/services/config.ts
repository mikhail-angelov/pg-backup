export const config = {
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || '',
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || '',
  S3_BUCKET: process.env.S3_BUCKET || '',
  S3_ENDPOINT_URL: process.env.S3_ENDPOINT_URL || '',
  S3_REGION: process.env.S3_REGION || '',

  DB_URL: process.env.DB_URL || '',

  TEST_SQL_QUERY: process.env.TEST_SQL_QUERY || '',
  TEMP_POSTGRES_CONTAINER_NAME: process.env.TEMP_POSTGRES_CONTAINER_NAME || '',
  TEMP_POSTGRES_DB: process.env.TEMP_POSTGRES_DB || '',
  TEMP_POSTGRES_USER: process.env.TEMP_POSTGRES_USER || '',
  TEMP_POSTGRES_PASSWORD: process.env.TEMP_POSTGRES_PASSWORD || '',
  TEMP_POSTGRES_PORT: process.env.TEMP_POSTGRES_PORT || '',

  LOCALLY_BACKUP_CRON: process.env.LOCALLY_BACKUP_CRON || '',
  S3_BACKUP_CRON: process.env.S3_BACKUP_CRON || '',

  LOCALLY_BACKUP_FILES_COUNT_MAX: process.env.LOCALLY_BACKUP_FILES_COUNT_MAX
    ? +process.env.LOCALLY_BACKUP_FILES_COUNT_MAX
    : 0,
}

export const validateConfig = () => {
  if (!config.LOCALLY_BACKUP_FILES_COUNT_MAX) {
    throw 'Please check "LOCALLY_BACKUP_FILES_COUNT_MAX", should be >0'
  }
  if (!config.LOCALLY_BACKUP_CRON) {
    throw 'Please check "LOCALLY_BACKUP_CRON"'
  }
  if (!config.S3_ACCESS_KEY_ID) {
    throw 'Please check "access key Id"'
  }
  if (!config.S3_SECRET_ACCESS_KEY) {
    throw 'Please check "secret access key"'
  }
  if (!config.S3_BUCKET) {
    throw 'Please check "bucket name"'
  }
  if (!config.S3_ENDPOINT_URL) {
    throw 'Please check "endpoint url"'
  }
  if (!config.DB_URL) {
    throw 'Please check "DB url"'
  }
  if (!config.TEST_SQL_QUERY) {
    throw 'Please check "SQL query for test"'
  }
  if (!config.TEMP_POSTGRES_CONTAINER_NAME) {
    throw 'Please check "TEMP_POSTGRES_CONTAINER_NAME"'
  }
  if (!config.TEMP_POSTGRES_DB) {
    throw 'Please check "TEMP_POSTGRES_DB"'
  }
  if (!config.TEMP_POSTGRES_USER) {
    throw 'Please check "TEMP_POSTGRES_USER"'
  }
  if (!config.TEMP_POSTGRES_PASSWORD) {
    throw 'Please check "TEMP_POSTGRES_PASSWORD"'
  }
  if (!config.TEMP_POSTGRES_PORT) {
    throw 'Please check "TEMP_POSTGRES_PORT"'
  }
}
