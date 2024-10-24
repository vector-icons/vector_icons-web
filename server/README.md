# Initial Settings
Create a .env file in the server/ folder and write the code according to the format below.

```env
POSTGRES_DB=quark
POSTGRES_USER=root
POSTGRES_PASSWORD=...

REDIS_PORT=6379
REDIS_PASSWORD={0}
```

And then, create a redis.conf file in the server/ folder and write the code according to the format below.

```conf
PORT 6379
REQUIREPASS {0}
```