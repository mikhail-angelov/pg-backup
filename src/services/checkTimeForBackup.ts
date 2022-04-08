import { BACKUP_START_TIME_IN_MINUTES } from "./initialParams"

export const checkTimeForBackup = () => {
    const time = new Date()
    const timeInMinutes = time.getHours() * 60 + time.getMinutes()
    return (BACKUP_START_TIME_IN_MINUTES === timeInMinutes)
}