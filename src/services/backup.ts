import child_process from 'child_process'
import fs from 'fs/promises'
import { BACKUP_PATH, TEMP_PATH } from '..'
import { config } from './config'

const PG_URL = `postgresql://${config.PG_USER}:${config.PG_PASSWORD}@${config.PG_HOST}:${config.PG_PORT}`
const DB_URL = `${PG_URL}/${config.PG_DB}`

const TEST_DB_NAME = 'test_backup'
const TEST_DB_URL = `${PG_URL}/${TEST_DB_NAME}`

const exec = (command: string) =>
  new Promise<string>((resolve: any, reject) =>
    child_process.exec(command, (err: child_process.ExecException | null, stdout: string) => {
      if (err) {
        console.log('exec command error ', command)
        reject(err)
      }
      resolve(stdout)
    }),
  )

export const getBackupFiles = (): Promise<string[]> => {
  try {
    return fs.readdir(BACKUP_PATH)
  } catch (e) {
    console.log('get backup files count error')
    throw e
  }
}

export const removeBackupFile = (path: string) => {
  try {
    return fs.unlink(path)
  } catch (e) {
    console.log('remove backup file error, path: ', path)
    throw e
  }
}

export const getFileStats = (path: string) => {
  try {
    return fs.stat(path)
  } catch (e) {
    console.log('get file stats error', path)
    throw e
  }
}

export const makeBackup = async () => {
  const dumpFileName = `${Date.now()}-pg.dump`
  try {
    const stdout = await exec(`pg_dump -Fc --dbname=${DB_URL} > ${BACKUP_PATH}/${dumpFileName}`)
    console.log('make backup', stdout)
  } catch (e) {
    console.log('pg_dump error', e)
  }

  const fileStats = await getFileStats(`${BACKUP_PATH}/${dumpFileName}`)
  if (!(fileStats.size > 0)) {
    await removeBackupFile(`${BACKUP_PATH}/${dumpFileName}`)
    throw 'Backup file has not correct size'
  }
  return dumpFileName
}

export const restoreTempBackup = (fileName: string) => {
  return exec(`pg_restore --dbname=${TEST_DB_URL} --clean --if-exists --verbose '${TEMP_PATH}/${fileName}'`)
}

export const querySQLTempBackup = () => {
  return exec(`psql -c '\\x' -c '${config.TEST_SQL_QUERY}' --dbname=${TEST_DB_URL}`)
}

export const dropTempDb = () => {
  return exec(`dropdb --maintenance-db=${DB_URL} ${TEST_DB_NAME}`)
}

export const createTempDb = () => {
  return exec(`createdb --maintenance-db=${DB_URL} ${TEST_DB_NAME}`)
}
