## Redux folder

`Includes file redux ( state management ) for app :`

> / actions.js

> / reducers

> / sagas

> / store.js

> / selectors.js

`Explained :`
```bash
# actions

- includes function generate type and object action.
- defined type for each business action.


# reducers

- Receiver actions and handle data, management data.
- Defined data for app.

# sagas

- Handle and excute effects saga for redux actions.
- Middleware handle side effects.

# store 

- Store center for redux app.

# selectors 

- defined function getters nested data from store.
```