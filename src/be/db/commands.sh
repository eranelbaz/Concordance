# into docker
docker exec -it db_db_1  bash
# dump to files

for n in $(mysql -u root -proot -p concordance -e "show tables" | grep -v Tables | tr -d '| '); do mysqldump --xml -u root -proot -p concordance --tables ${n} > ${n}.xml; done

# load from files
for n in $(mysql -u root -proot -p concordance -e "show tables" | grep -v Tables | tr -d '| '); do mysql --local_infile=1 --max-allowed-packet=2G -u root -proot -p concordance -e "LOAD XML CONCURRENT LOCAL INFILE '${n}.xml' INTO TABLE \`${n}\`"; done
# Make sure to double load this one
mysql --local_infile=1 --max-allowed-packet=2G -u root -proot -p concordance -e "LOAD XML CONCURRENT LOCAL INFILE 'groupsToWords.xml' INTO TABLE \`groupsToWords\`"
