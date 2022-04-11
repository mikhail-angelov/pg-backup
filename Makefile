build:
	docker build -f ./Dockerfile -t pg-backup .

run:
	docker-compose -f docker-compose.yml up -d

stop:
	docker-compose -f docker-compose.yml down
