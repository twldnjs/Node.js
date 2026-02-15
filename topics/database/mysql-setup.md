1. Docker 설치 확인

   `bashdocker --version`

2. Docker 실행

3. Maria DB 설치

```
docker pull mariadb // 도커 통해 마리아디비를 풀
docker run --name mariadb -d -p 3306:3306 --restart=always -e MYSQL_ROOT_PASSWORD=root mariadb

docker exec  -it mariadb /bin/bash
// 1). maria db가 있는 컨테이너 접속

mariadb -u root -p
// 2). mariadb 실행
// 3). password root 입력
```

4. MariaDB 컨테이너 접속
   `docker exec  -it mariadb /bin/bash`

# MariaDB 컨테이너 실행

`mariadb -u root -p`
password : root

# 컨테이너 상태 확인

docker ps
