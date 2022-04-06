import { getBucketList, downloadFromCloudStorage } from "./cloudStorage"

export const validateLastCloudStorageBackup = async () => {
    const backupList = await getBucketList()
    const lastBackup = backupList.Contents?.sort((a, b) => {
        const aDate = new Date(a.LastModified || 0).getTime()
        const bDate = new Date(b.LastModified || 0).getTime()
        return (bDate - aDate)
    })[0]
   if (!lastBackup || !lastBackup.Key) {
        return
    }

    await downloadFromCloudStorage(lastBackup.Key)
}