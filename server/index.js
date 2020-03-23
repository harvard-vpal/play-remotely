require('dotenv').config()
const throng = require('throng')

throng({
  workers: 1,
  // workers: process.env.WEB_CONCURRENCY || 1,
  lifetime: Infinity,
  start: start
})

// run an instance of the app (via throng)
function start(id) {
  console.log(`Started worker ${id}`)

  // load other middlewares we'll need for auth and the Nuxt front-end
  const express = require('express')
  const passport = require('passport')
  const cookieParser = require('cookie-parser')
  const axios = require('axios')
  const redirectSSL = require('redirect-ssl')
  const { resolve } = require('path')

  const app = express()

  const deployEnv = process.env.DEPLOY_ENV

  if (deployEnv !== 'dev' || !process.env.SKIP_AUTH) {
    // require that the site be accessed via SSL
    app.use(redirectSSL)
  }

  // helper library for parsing cookies
  app.use(cookieParser())

  // initialize passport-cas for HarvardKey integration
  app.use(passport.initialize())

  passport.use(
    new (require('./passportCas.js')).Strategy(
      {
        version: 'CAS3.0',
        ssoBaseURL: 'https://www.pin1.harvard.edu/cas',
        validateURL: '/serviceValidate',
        serverBaseURL: process.env.BASE_URL,
        serviceURL: process.env.SERVICE_URL
      },
      function(login, done) {
        return done(null, login)
      }
    )
  )

  // needed for Heroku
  app.set('trust proxy', 1)

  // endpoints for /login redirect and /login?ticket=foo verification
  app.get(
    '/login',

    async function(req, res, next) {
      if (deployEnv === 'dev' && process.env.SKIP_AUTH === 'true') {
        // don't need HarvardKey locally, so just set a current user
        const eppn = process.env.DEV_EPPN

        // get token
        // set cookie

        return res.redirect('/')
      } else {
        // we're in staging/prod and need to authenticate
        passport.authenticate('cas', async function(err, user, info) {
          if (err) {
            return res.status(500).send(err.message)
          } else if (!user && info) {
            return res.status(500).send('An unknown error occurred')
          } else {
            console.log('user:',user)
            // const eppn = user.attributes.HTTP_CAS_EDUPERSONPRINCIPALNAME // TODO: name?

            // get token
            // set cookie

            return res.redirect('/')
          }

          return undefined
        })(req, res, next)
      }
    },

    function(err, req, res) {
      return res.status(500).send('An unknown error occurred')
    }
  )

  // clear auth cookie and then log out of HarvardKey
  app.get(
    '/logout',

    function(req, res) {
      res.clearCookie('x-access-token')

      // already logged out of Link, so now log out of HarvardKey
      return res.redirect('https://key.harvard.edu/logout')
    },

    function(err, req, res) {
      return res.status(500).send('An unknown error occurred')
    }
  )

  const publicPath = resolve(__dirname, '../dist')
  const staticConf = { maxAge: '1y', etag: false }

  app.use(express.static(publicPath, staticConf))

  let { PORT = 80 } = process.env

  if (deployEnv === 'dev' && process.env.SKIP_AUTH === 'false') {
    // set up SSL for local HarvardKey testing
    const fs = require('fs')
    const https = require('https')

    let PORT = 443

    https
      .createServer(
        {
          key: fs.readFileSync('server.key'),
          cert: fs.readFileSync('server.cert')
        },
        app
      )
      .listen(PORT, () => console.log(`App running on port ${PORT}.`))
  } else {
    app.listen(PORT, () => console.log(`App running on port ${PORT}.`))
  }
}
