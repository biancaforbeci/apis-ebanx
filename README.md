This project has API's to administration account bank.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```


## Endpoints 

-> POST - /reset

-> GET - /balance

-> POST - /event

## Using with EC2
  This project deployed using EC2 and it can access using this URL: (ATUALMENTE DESLIGADO O EC2 POR QUESTÕES DE CUSTO)
 
 ```bash
http://18.234.172.205:3000/  
```

## Usar o ngrok 

  If you want to expose URL, you can use ngrok, first install 

 ```bash
npm install -g ngrok 
```

Authenticate Ngrok (one time setup):

 ```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

Expose a Local Server:

 ```bash
ngrok http 3000
```

This exposes http://localhost:3000 to a public URL like https://random.ngrok.io.




  
