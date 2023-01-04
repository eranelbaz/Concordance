# into docker
docker exec -it db_db_1  bash
# dump to files
for n in $(mysql -u root -proot -p concordance -e "show tables" | grep -v Tables | tr -d '| '); do mysql -u root -proot -p concordance --xml -e "SELECT * FROM \`${n}\`" > ${n}.xml; done
# load from files
for n in $(mysql -u root -proot -p concordance -e "show tables" | grep -v Tables | tr -d '| '); do mysql --local_infile=1 -u root -proot -p concordance -e "LOAD XML LOCAL INFILE '${n}.xml' INTO TABLE \`${n}\`"; done
