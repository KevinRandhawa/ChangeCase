import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import config from './config.json';
import passport from 'passport';
import massive from 'massive';
import path from 'path';

var Auth0Strategy = require('passport-auth0')

const massiveInstance = massive.connectSync({
    connectionString: config.connectionString
});

const app = module.exports = express();

app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(cors());
app.set('db', massiveInstance);
app.use(express.static(__dirname + '/../public'));
// app.get('*', function(request, response) {
//     response.sendFile(path.resolve(__dirname, '../public', 'index.html'))
// });
const db = app.get('db');
const ctrl = require('./ctrl.js');

//Auth0
var strategy = new Auth0Strategy({
        domain: 'tran.auth0.com',
        clientID: config.auth0ClientId,
        clientSecret: config.auth0Secret,
        callbackURL: 'http://localhost:4000/callback'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      console.log('Whats DB: ', db)
        db.read_user_externalId([profile.id], (err, response) => {
            if (err) {
                console.log('ERROR at READ EXTERNALID: ', profile.id)
            }
            if (response) {
                console.log('RESPONSE FROM READ: ', response)
            }
            if (response.length === 0) {
                db.create_user([profile.id, profile.displayName], (err, response) => {

                })
            }

        });

        return done(null, profile);
    }
);

passport.use(strategy);

app.get('/auth/', passport.authenticate('auth0'));
app.get('/callback', passport.authenticate('auth0', {
    failureRedirect: '/auth',
    successRedirect: '/'
}), ctrl.respond);

app.get('/getUserData', (req, res, next) => {
    if (req.user) {
        db.read_all([req.user.id], function(err, all) {
            if (err) {
                console.log('Error at getUserData read_all: ', err)
            }
            return res.json({
                "user": req.user,
                "list": all
            })
        })
    } else {
      return res.json({"No":"user"});
    }
})

app.post('/addWord', ctrl.addWord)
app.post('/removeWord', ctrl.removeWord)

passport.serializeUser((user, done) => {
    done(null, user); // put the whole user object from YouTube on the sesssion;
});

passport.deserializeUser((obj, done) => {
    //Only do something here that needs to be done with every request
    done(null, obj); // get data from session and put it on req.user in every endpoint;
});

app.listen(config.port, () => {
    console.log('Hosting port', config.port);
});
