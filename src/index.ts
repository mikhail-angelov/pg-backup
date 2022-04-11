import { getBackupFiles, makeBackup, removeBackupFile } from './services/backup'
import { uploadToCloudStorage } from './services/cloudStorage'
import { validateLastCloudStorageBackup } from './services/validationBackup'
import { config, validateConfig } from './services/config'
import crone from 'node-cron'

export const BACKUP_PATH = process.cwd() + '/backups'
export const TEMP_PATH = process.cwd() + '/temp'

let newestBackupFile: string

const processLocalBackup = async () => {
  console.log('process local backup')
  try {
    const backupFiles = await getBackupFiles()
    if (backupFiles.length >= config.LOCALLY_BACKUP_FILES_COUNT_MAX) {
      const oldestBackupFile = backupFiles.sort((a, b) => parseInt(a) - parseInt(b))[0]
      if (oldestBackupFile) {
        await removeBackupFile(`${BACKUP_PATH}/${oldestBackupFile}`)
      }
    }

    newestBackupFile = await makeBackup()
  } catch (e) {
    console.error(e)
  }
}

const processS3Backup = async () => {
  console.log('process S3 backup')
  if (!newestBackupFile) {
    return
  }
  try {
    await uploadToCloudStorage(newestBackupFile)
    if (config.TEST_SQL_QUERY) {
      await validateLastCloudStorageBackup()
    }
  } catch (e) {
    console.error('s3 backup process error', e)
  }
}

const main = async () => {
  try {
    validateConfig()
    crone.schedule(config.LOCALLY_BACKUP_CRON, processLocalBackup)
    console.log('run local backup')

    if (config.S3_BACKUP_CRON) {
      crone.schedule(config.S3_BACKUP_CRON, processS3Backup)
      console.log('run S3 backup')
    }
  } catch (e) {
    console.log('Application run error!')
    console.log('Error: ', e)
  }
}

main()
