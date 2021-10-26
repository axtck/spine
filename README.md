# Snorflax

***ZZZ***

---

## Development

#### Database
* Set up the dev database (preferably with Docker).
> ```docker run -d --name mysql-snorflax -v $HOME/dockervols/mysql-snorflax:/var/lib/mysql/ -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=dev  --restart unless-stopped -p 3307:3306 mysql:8 --default-authentication-plugin=mysql_native_password```

#### Environment variables
* Copy the `.sample.env` file in `./` and rename it as `.env` and change the variables where needed. 
* The ENV variables are mapped in `./src/config/penv.ts` so they are easy to use throughout the code.
