Email = require('email').Email
express = require 'express'

settings = (require './settings').init()
app = express()

app.get('/suggest', (req, res) ->
    if req.body.human.toLowerCase() isnt in [12, 'twelve']
        res.send 500
    else
        Email(
            from: 'atlvegguide@atlvegguide.com',
            to: settings.to_email,
            subject: "vegguide suggestion: #{req.body.name}",
            body: ("#{k}: #{v}" for k,v of req.body).join("\n")
        ).send((err) ->
            console.error err if err
            res.send if err then 500 else 200
        )
)
