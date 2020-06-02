# Solution City Bikes in Miami FL stations

In this project you can find solution of City bikes in Miami

## Installing

For install all dependencies you have to:

For backend go to folder **CITYBIKE-SERVER**

```
cd citybike-server&& npm i
```

For frontend got to folder **citybike-client**

```
cd citybike-client&& npm i
```

You can run _backend_ project like this.

```
cd citybike-server&& npm run start
```

You can run _frontend_ project like this.

```
cd citybike-server&& npm run start
```

## Deployment

### Explanation Backend

I used node-fetch to make api call to the city bike api(http://api.citybik.es/v2/networks/decobike-miami-beach), then when I got the Miami's stations I saved that data in a cache date base, to save this data I used memory-cache library and with an iterator a I saved data each 5 minutes(300000 ms).

For sending data that I got of the api call to the front-end, I used Sockect IO. I sent data each 200000 ms.

The data of bike stations is saved for 24 hours(86400000 ms). Then the data is deleted.

Finally, I created three services:
- /historical-bikes: return the range of dates that are allowed in cache
- /get-data-cache: return the bikes stations at specific hour
- /first-registry-date: return the first registry of the data base cache

### Explanation frontend

The frontend received data through SockectIO and I used *react-leaflet* library to marked position in the map. I created selector which use service **/first-registry-date**, this is for know when is the first Date that is storaged in cache.  Then i added 5 minutes to this first date to get a *range of dates* **/historical-bikes**. When I got a range of Dates, I painted that dates in a table which contain each date that User selected of that range of Dates.

Finally, in the table Users can select any option of that Dates and that Data is showed in the map.

Also, if the users wants to see current data, they can click in the **Live Button**

## Authors

- **Nicolas Gonzalez** - _Initial work_ - [nfgonzalez10](https://github.com/nfgonzalez10)

