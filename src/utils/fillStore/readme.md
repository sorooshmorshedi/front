# Fill Store
> Amaing way to fetch data from api and save them into store
* fetch data from api
  * using `url`
* commit it into store
  * the mutation function should be named 'set`{StoreKey}`' (storeKey first letter is uppercased)
* call a callback function if exists
* emit an event with name  'fetched:`{storeKey}`' on EventBus

## notes
* this method prevents double call by saving a key in store
* if data is fetched and stored in the store, the next call will do nothing unless `reload` is `true`