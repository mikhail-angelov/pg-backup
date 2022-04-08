import child_process from 'child_process'
import fs from 'fs/promises'
import { BACKUP_PATH, TEMP_PATH } from '..'
import {
  DB_URL,
  TEMP_DB_URL,
  TEMP_POSTGRES_CONTAINER_NAME,
  TEMP_POSTGRES_DB,
  TEMP_POSTGRES_PASSWORD,
  TEMP_POSTGRES_PORT,
  TEMP_POSTGRES_USER,
  TEST_SQL_QUERY,
} from './initialParams'

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
  await exec(`pg_dump -Fc --dbname=${DB_URL} > ${BACKUP_PATH}/${dumpFileName}`)

  const fileStats = await getFileStats(`${BACKUP_PATH}/${dumpFileName}`)
  if (!(fileStats.size > 0)) {
    await removeBackupFile(`${BACKUP_PATH}/${dumpFileName}`)
    throw 'Backup file has not correct size'
  }
  return dumpFileName
}

export const restoreTempBackup = (fileName: string) => {
  return exec(`pg_restore --dbname=${TEMP_DB_URL} --clean --if-exists --verbose '${TEMP_PATH}/${fileName}'`)
}

export const querySQLTempBackup = () => {
  return exec(`psql -c '\\x' -c '${TEST_SQL_QUERY}' --dbname=${TEMP_DB_URL}`)
}

export const dropTempDb = () => {
  return exec(
    `dropdb --maintenance-db=postgresql://${TEMP_POSTGRES_USER}:${TEMP_POSTGRES_PASSWORD}@${TEMP_POSTGRES_CONTAINER_NAME}:${TEMP_POSTGRES_PORT} ${TEMP_POSTGRES_DB}`,
  )
}

export const createTempDb = () => {
  return exec(
    `createdb --maintenance-db=postgresql://${TEMP_POSTGRES_USER}:${TEMP_POSTGRES_PASSWORD}@${TEMP_POSTGRES_CONTAINER_NAME}:${TEMP_POSTGRES_PORT} ${TEMP_POSTGRES_DB}`,
  )
}
