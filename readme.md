## init project
```sh
npx electron-forge init clip-master-2 --template=react-typescrip
```

## Caveat
`electron-forge` has already setup `electron-rebuild` defaultly. If it's not the case for you, you should setup mannuly when you have compile dependencies such as `sqlite3`
```sh
npm install sqlite3 knext --save
```