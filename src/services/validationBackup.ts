import { getBucketList, downloadFromCloudStorage } from './cloudStorage'
import fs, { createWriteStream } from 'fs'
import { TEMP_PATH } from '..'
import { createTempDb, dropTempDb, querySQLTempBackup, restoreTempBackup } from './backup'

export const validateLastCloudStorageBackup = async () => {
  const backupList = await getBucketList()
  const lastBackup = backupList.Contents?.sort((a, b) => {
    const aDate = new Date(a.LastModified || 0).getTime()
    const bDate = new Date(b.LastModified || 0).getTime()
    return bDate - aDate
  })[0]
  const fileName = lastBackup?.Key || ''
  if (!fileName) {
    return
  }
  try {
    await createTempDb()
  } catch (e: any) {
    if (!e.message.includes('already exists')) {
      throw e
    }
  }

  try {
    fs.rmSync(TEMP_PATH, { recursive: true, force: true })
    fs.mkdirSync(TEMP_PATH)
    const backupStream = await downloadFromCloudStorage(fileName)
    const outputStream = createWriteStream(`${TEMP_PATH}/${fileName}`)
    backupStream.pipe(outputStream)
    await new Promise((resolve, reject) => {
      outputStream.on('finish', resolve)
      outputStream.on('error', reject)
    })
    await restoreTempBackup(fileName)

    const queryResponse = await querySQLTempBackup()
    const matches = /count \| (\d+)/.exec(queryResponse)
    if (!(matches?.[1] && +matches[1] > 0)) {
      throw `sql test error: ${queryResponse}`
    }
    console.log('Successfully validated cloud storage: ', fileName)
  } catch (e) {
    console.error(e)
  } finally {
    await dropTempDb()
  }
}
