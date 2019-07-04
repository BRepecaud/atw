/* 
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 ********************************MODULES**************************************************
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 */

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var $ = require("jquery");
var urlencodedParser = bodyParser.urlencoded({extended: false});
var app = express();

//------------------------------------Socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);


var model = require('../models/model');
var pages = require('../models/pages');

//----------------------------------------------------MYSQL
model.getDB();


//----------------------------------------------------SESSION
app.use(session({
    secret: 'atw session',
    resave: false,
    saveUninitialized: true
}));

//----------------------------------------------------PAGES
pages = pages.dataPages();
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

//----------------------------------------------------ENVIRONMENT
app.set('view engine', 'ejs');
server.listen(28);

/* 
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 ********************************ROUTES***************************************************
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 */

/*
socket
----------------------------
* Get User Language (callback to return the lang)
* Update User Language
*/
function socket(user)
{
    io.sockets.on('connection', function(socket){
        if(user)
        {
            //------------------------------------------------getLang
            model.getLang(user, function(err, res)
            {
                socket.on('loadLng', function(){
                    var lang = res;
                    socket.emit('reploadLng', lang);
                });                 
            });
            
            //------------------------------------------------updateLang
            socket.on('updateLng', function(lng)
            {
                model.updateLang(user, lng);
            });
        }
    }); 
};

//---------------------------------------------------RACINE
app.get('/', function(req, res)
{
    var user = req.session.user;
    res.setHeader('Content-Type', 'text/javascript');
    if(!user)
    {
        res.redirect('/authentification');
    }
    else
    {
        res.render('pages/index', {title: pages['home'][0], page: pages['home'][1], user: req.session.user});
    }
})

//---------------------------------------------------AUTHENTIFICATION
.get('/authentification', function(req, res)
{
    var message = '';
    var user = req.session.user;
    if(!user)
    {
        res.render('pages/index', {title: pages['authentification'][0], page: pages['authentification'][1], message: message});
    }
    else
    {
        res.redirect('/accueil');
        //res.render('pages/index', {title: pages['home'][0], page: pages['home'][1], user: req.session.user});
    }
})

.post('/authentification', urlencodedParser, model.connexion)

//---------------------------------------------------INSCRIPTION
.get('/inscription', function(req, res)
{
    var message = '';
    var user = req.session.user;
    if(!user)
    {
        res.render('pages/index', {title: pages['inscription'][0], page: pages['inscription'][1], message: message});
    }
    else
    {
        res.render('pages/index', {title: pages['home'][0], page: pages['home'][1], user: req.session.user});
    }      
})

.post('/inscription', urlencodedParser, model.inscription)

//---------------------------------------------------ACCUEIL
.get('/accueil', function(req,res){ 
    socket(req.session.user);
    res.render('pages/index', {title: pages['home'][0], page: pages['home'][1], user: req.session.user});
    
})

//---------------------------------------------------DECONNEXION
.get('/deconnexion', function(req, res){
    req.session.destroy(function(err){
        res.redirect('/authentification');
    });
})

//---------------------------------------------------PROFIL
.get('/profil', model.profil)

//---------------------------------------------------MES PAYS
.get('/mespays', function(req,res){
    res.render('pages/index', {title: pages['mespays'][0], page: pages['mespays'][1]});
})

//---------------------------------------------------DECOUVERTE
.get('/decouverte', function(req,res){
    res.render('pages/index', {title: pages['decouverte'][0], page: pages['decouverte'][1]});
})

//---------------------------------------------------DESC PAYS
.get('/decouverte/:pays', model.descpays)