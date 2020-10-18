# Needed environment variables

`vidly_jwtPrivateKey` - Private key for JSON Web Token. Program won't start without this.

# Other environment variables

`NODE_ENV` - Settings up runtime environment (development|test|production)

- When development is setup, Morgan logging will be used with tiny settings.
  `PORT` - Setting up what port backend is listening to. Default is 3000.
