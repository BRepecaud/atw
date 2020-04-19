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
var socketMiddleware = session({
    secret: 'atw session',
    resave: false,
    saveUninitialized: true
});

io.use(function(socket, next)
{
    socketMiddleware(socket.request, socket.request.res, next);
});
app.use(socketMiddleware);


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
 ********************************SOCKET***************************************************
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 */

/*
Connection
----------------------------
* Language
* Add/del/save PV PAV
*/
io.sockets.on('connection', function(socket){             
    var user = socket.request.session.user;
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

        //------------------------------------------------newPAV
        socket.on('newPAV', function(pays)
        {
            model.addPAV(user, pays);
        });            

        //------------------------------------------------delPAV
        socket.on('delPAV', function(pays)
        {
            model.delPAV(user, pays);
        });                    

        //------------------------------------------------SavePV
        socket.on('savePV', function(note, avis, securite, id)
        {
            model.savePV(note, avis, securite, user, id);
        });    
        
        //------------------------------------------------menuActif
        socket.on('menuActif', function(liActif){
            socket.emit('menuActif', liActif);
        });
    }
}); 

/*
Mes Pays
----------------------------
* User countries loading
*/
io.of("/mespays").on('connection', function (socket) {
    var user = socket.request.session.user;
   //------------------------------------------------mesPAV
    if(user)
    {
        model.getMesPays(user, function(err, res)
        {
            var listePays = res;
            socket.emit('repMesPays', listePays);     
        });              
    }

});       

/* 
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 ********************************ROUTES***************************************************
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 */
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
        var user = req.session.user;
        res.render('pages/index', {title: pages['home'][0], page: pages['home'][1], datalang: pages['home'][2], user: user});
    }
})

//---------------------------------------------------AUTHENTIFICATION
.get('/authentification', function(req, res)
{
    var message = '';
    var user = req.session.user;
    if(!user)
    {
        res.render('pages/index', {title: pages['authentification'][0], page: pages['authentification'][1], datalang: pages['authentification'][2], message: message});
    }
    else
    {
        res.redirect('/accueil');
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
        res.render('pages/index', {title: pages['inscription'][0], page: pages['inscription'][1], datalang: pages['inscription'][2], message: message});
    }
    else
    {
        res.render('pages/index', {title: pages['home'][0], page: pages['home'][1], datalang: pages['home'][2], user: req.session.user});
    }      
})

.post('/inscription', urlencodedParser, model.inscription)

//---------------------------------------------------ACCUEIL
.get('/accueil', function(req,res){ 
    res.render('pages/index', {title: pages['home'][0], page: pages['home'][1], datalang: pages['home'][2], user: req.session.user});  
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
    res.render('pages/index', {title: pages['mespays'][0], page: pages['mespays'][1], datalang: pages['mespays'][2]});
})

.get('/mespays/:idPays', model.mespays)
.get('/mespays/:idPays/sauvegarde', model.sauvegardeAvis)

//---------------------------------------------------DECOUVERTE
.get('/decouverte', function(req,res){
    res.render('pages/index', {title: pages['decouverte'][0], page: pages['decouverte'][1], datalang: pages['decouverte'][2]});
})

//---------------------------------------------------DESC PAYS
.get('/decouverte/:idPays', model.descpays)

.get('/decouverte/:idPays/avis', model.avispays);