# Stack Monitor for clabroche

Simple package that list, organize, manage, launch all microservice from clabroche

# Installation

You need this commands installed: 

 - docker
 - pg_dump (postgresql-client)
 - pg_restore (postgresql-client)

Then: ``` npm i ```

To create a local postgres database easily use, docker:

```docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=platform -p 5432:5432 -e PGDATA=/var/lib/postgresql/data/pgdata -d postgres```

To create a local mongodb database easily use, docker:

```docker run --name mongo -d -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=123456 -p 27017:27017 mongo:5.0 --wiredTigerCacheSizeGB 1```

# Usage

Copy ```env.dist file``` to ```env``` and fill variables

You should certainly ask for ```SECRET_KEY``` and ```SECRET_IV``` envs. These are to decrypt sensitive data 

You can now clone missing repos with ```npm run clone```
It will clone, go to develop, and make an ```npm i```

To download dev postgres launch ```npm run db```

To download dev mongo you should launch [this tool](https://github.com/clabroche/tools/tree/develop/sync-mongos) with correct envs. (you can retrieve env by decrypting env in this repo)  

To launch microservices, execute ```npm run serve```

You can make an alias in your bashrc or zshrc for convenience ;) ```alias clabroche="cd <where-is-this-repo> &&  npm run serve"```

## Change variables

To switch services to use other dbs you can change environments in stack-monitor  

If you have custom variables you should put it to a
```./src/env/<local|dev|staging|prod>.override.js``` file. It will automatically loads with the given environnement

example of override
```javascript
// local.override.js
const envs = require('./local') 
module.exports = {
  ...envs,
  //... Put your own variables
}
```
## Leak 

You should certainly ask for ```SECRET_KEY``` and ```SECRET_IV``` envs. These are to encrypt/decrypt sensitive data. 

To prevent leaking data in github, you should encrypt sensitive envs.

You can call ``` npm run encrypt -- "<your string>" ``` to get the encrypted key. 

To decrypt a string: ``` npm run decrypt -- "<your string>" ```. 