import { BACKUP_START_TIME_IN_MINUTES } from "./env"

export const validateTimeFormat = (time?: string): boolean => {
    const time24hPattern = /^(((0?|1)[0-9]|2[0-3]):[0-5][0-9])$/
    return !!time && time24hPattern.test(time)
}

export const getTimeInMinutes = (value: string) => {
    const [hours, minutes] = value.split(":")
    return +hours * 60 + +minutes
}

export const checkTimeForBackup = () => {
    const time = new Date()
    const timeInMinutes = time.getHours() * 60 + time.getMinutes()
    return (BACKUP_START_TIME_IN_MINUTES === timeInMinutes)
}