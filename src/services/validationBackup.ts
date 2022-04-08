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

  await createTempDb()

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
  if (!queryResponse.includes('Expanded display is on')) {
    console.log('test sql query error', queryResponse)
    throw 'sql test error'
  }

  await dropTempDb()
  
  console.log('Successfully validated cloud storage: ', fileName)
}
