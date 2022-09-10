FROM mariadb:10.7.5

ADD sql/ /docker-entrypoint-initdb.d

ENV MYSQL_ROOT_PASSWORD test123
ENV MYSQL_DATABASE msdb
ENV MYSQL_USER msdb
ENV MYSQL_PASSWORD msdb

RUN apt-get update && apt-get -y install vim

EXPOSE 3306

CMD ["mysqld"]
