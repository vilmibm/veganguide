Email = require('email').Email
express = require 'express'

settings = (require './settings').init()
app = express()
app.configure(->
    app.use(express.logger())
    app.use(express.favicon())
    app.use(express.bodyParser())
    app.use((q,s,n) -> # cors middleware. TODO don't just use *
        s.setHeader('Access-Control-Allow-Origin', 'http://localhost')
        s.setHeader('Access-Control-Allow-Credentials', 'true')
        n()
    )
)

app.post('/suggest', (req, res) ->
    if req.body.human.toLowerCase() not in ['12', 'twelve']
        console.error 'not a human'
        res.send 500
    else
        (new Email(
            from: 'atlvegguide@atlvegguide.com',
            to: settings.to_email,
            subject: "vegguide suggestion: #{req.body.name}",
            body: ("#{k}: #{v}" for k,v of req.body).join("\n")
        )).send((err) ->
            console.error err if err
            res.send if err then 500 else 200
        )
)

app.listen settings.port
console.log "listening on port #{settings.port}"
