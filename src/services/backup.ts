import child_process from 'child_process'
import fs from 'fs'
import { BACKUP_PATH } from '..'
import { DB_URL } from './env'

const exec = (command: string) => new Promise((resolve: any, reject) => child_process.exec(command, (err: child_process.ExecException | null, stdout: string, stderr: string) => {
    if (err || stderr) {
        console.log('exec command error ', command)
        reject(err || stderr)
    }
    resolve()
}))

export const getBackupFiles = (): Promise<string[]> => new Promise((resolve, reject) => fs.readdir(BACKUP_PATH, (err, files) => {
    if (err) {
        console.log('get backup files count error')
        reject(err)
    }
    resolve(files)
}))

export const removeBackupFile = (fileName: string) => new Promise((resolve: any, reject) => fs.unlink(`${BACKUP_PATH}/${fileName}`, (err) => {
    if (err) {
        console.log('remove backup file error, file name: ', fileName)
        reject(err)
    }
    resolve()
}))

const getFileStats = (fileName: string): Promise<fs.Stats> => new Promise((resolve, reject) => fs.stat(`${BACKUP_PATH}/${fileName}`, (err, stats) => {
    if (err) {
        console.log('get file stats error')
        reject(err)
    }
    resolve(stats)
}))

export const makeBackup = async () => {
    const dumpFileName = `${Date.now()}-pg.dump`
    await exec(`pg_dump -Fc --dbname=${DB_URL} > ${BACKUP_PATH}/${dumpFileName}`)

    const fileStats = await getFileStats(dumpFileName)
    if (!(fileStats.size > 0)) {
        await removeBackupFile(dumpFileName)
        throw 'Backup file has not correct size'
    }
    return dumpFileName
}