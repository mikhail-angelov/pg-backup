## Configuration:
### .env
```
TEST_SQL_QUERY=SELECT COUNT(*) FROM <table>

PG_DB=
PG_USER=
PG_PASSWORD=
PG_HOST=
PG_PORT=

S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT_URL=
S3_BUCKET=
S3_REGION=

LOCALLY_BACKUP_FILES_COUNT_MAX=10

# ┌────────────── second (optional) 0-59
# │ ┌──────────── minute 0-59
# │ │ ┌────────── hour 0-23
# │ │ │ ┌──────── day of month 1-31
# │ │ │ │ ┌────── month 1-12 (or names)
# │ │ │ │ │ ┌──── day of week 0-7 (or names, 0 or 7 are sunday)
# │ │ │ │ │ │
# │ │ │ │ │ │
# * * * * * *
LOCALLY_BACKUP_CRON=* * * * * *
S3_BACKUP_CRON=* * * * * *
```