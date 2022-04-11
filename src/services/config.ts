export const config = {
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || '',
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || '',
  S3_BUCKET: process.env.S3_BUCKET || '',
  S3_ENDPOINT_URL: process.env.S3_ENDPOINT_URL || '',
  S3_REGION: process.env.S3_REGION || '',

  TEST_SQL_QUERY: process.env.TEST_SQL_QUERY || '',
  PG_HOST: process.env.PG_HOST || '',
  PG_DB: process.env.PG_DB || '',
  PG_USER: process.env.PG_USER || '',
  PG_PASSWORD: process.env.PG_PASSWORD || '',
  PG_PORT: process.env.PG_PORT || '',

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
  if (config.S3_BACKUP_CRON && !config.S3_ACCESS_KEY_ID) {
    throw 'Please check "access key Id"'
  }
  if (config.S3_BACKUP_CRON && !config.S3_SECRET_ACCESS_KEY) {
    throw 'Please check "secret access key"'
  }
  if (config.S3_BACKUP_CRON && !config.S3_BUCKET) {
    throw 'Please check "bucket name"'
  }
  if (config.S3_BACKUP_CRON && !config.S3_ENDPOINT_URL) {
    throw 'Please check "endpoint url"'
  }
  if (!config.TEST_SQL_QUERY) {
    console.log('Backup validation is inactive, Please check "TEST_SQL_QUERY"!')
  }
  if (!config.PG_HOST) {
    throw 'Please check "PG_HOST"'
  }
  if (!config.PG_DB) {
    throw 'Please check "PG_DB"'
  }
  if (!config.PG_USER) {
    throw 'Please check "PG_USER"'
  }
  if (!config.PG_PASSWORD) {
    throw 'Please check "PG_PASSWORD"'
  }
  if (!config.PG_PORT) {
    throw 'Please check "PG_PORT"'
  }
}
