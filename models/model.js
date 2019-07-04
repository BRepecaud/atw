/*
getDB
----------------------------
* DataBase connection
*/
exports.getDB = function()
{
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'atw',
    });
    connection.connect();
    global.db = connection;    
}

/*
inscription
----------------------------
* ATW inscription
**********************
* Login + password verification
* if ok : INSERT INTO 
*/
exports.inscription = function(req, res)
{
    //------------------------------------Pages
    var pages = require('../models/pages');
    pages = pages.dataPages();
    
    var form = req.body;
    var login = form.login;
    var pwd = form.pwd;
    var lng = 'FR';
    var pwd2 = form.pwd2;
    var niveau = 'débutant';
    var reqVerif = "SELECT * FROM utilisateur WHERE login = '"+ login + "'";
    
    
    db.query(reqVerif, function(err,result)
    {
        //-------------------------------------Inscription OK
        if(result.length === 0 && pwd === pwd2)
        {
            var reqInscription = "INSERT INTO utilisateur(login, pwd, lng, nbPV, niveau) \n\
            VALUES ('" + login + "','" + pwd + "','" + lng + "','" + 0 + "','" + niveau + "')";

            db.query(reqInscription, function(err, result)
            {
               res.render('pages/index', {title: pages['authentification'][0], page: pages['authentification'][1], message: "Inscription ok"});
            });            
        }
        //-------------------------------------PWD !=
        else if(pwd !== pwd2)
        {
            res.render('pages/index', {title: pages['inscription'][0], page: pages['inscription'][1], message: "Inscription impossible, mots de passe différents"});
        }
        //-------------------------------------LOGIN EXISTS
        else if(result.length)
        {
            res.render('pages/index', {title: pages['inscription'][0], page: pages['inscription'][1], message: "Inscription impossible, login déjà utilisé"});
        }
    });
};


/*
connexion
----------------------------
* ATW connexion
**********************
* Login + password verification
* if ok : INSERT INTO 
*/
exports.connexion = function(req, res)
{
    var pages = require('../models/pages');
    pages = pages.dataPages();

    var form = req.body;
    var login = form.login;
    var pwd = form.pwd;
    
    var reqVerif = "SELECT * FROM utilisateur WHERE login = '"+ login + "' AND pwd = '"+ pwd +"'";
    db.query(reqVerif, function(err,result)
    {
        //-------------------------------------Login exists
        if(result.length)
        {
            var session = req.session;
            
            req.session.user = result[0].login;
            res.redirect('/accueil');
            //res.render('pages/index', {title: pages['home'][0], page: pages['home'][1], user: req.session.user});
        }
        else
        {
            res.render('pages/index', {title: pages['authentification'][0], page: pages['authentification'][1], message: "Mauvais login ou mot de passe"});            
        }
    });
};

/*
profil
----------------------------
* User profil
**********************
* SELECT all user's information
* Render with them
*/
exports.profil = function(req, res)
{
    var pages = require('../models/pages');
    pages = pages.dataPages();
    
    var user = req.session.user;
    var reqProfil = "SELECT login, lng, nbPV, niveau FROM utilisateur WHERE login = '"+user+"'";
    
    db.query(reqProfil, function(err, result)
    {
        res.render('pages/index', {title: pages['profil'][0], page: pages['profil'][1], user: result[0].login, lng: result[0].lng, nbpv: result[0].nbPV, niveau: result[0].niveau});            
    });
};

/*
descpays
----------------------------
* Description of the country
**********************
* SELECT all country's informations
* Render with them (image, desc...)
*/
exports.descpays = function(req, res)
{
    var pages = require('../models/pages');
    pages = pages.dataPages();    
    var reqPays = "SELECT * FROM decouverte WHERE nom = '"+req.params.pays+"'";
    
    db.query(reqPays, function(err, result)
    {
        var flag = result[0].drapeau;
        var map = result[0].carte;
        var monument = result[0].monument;
        var id = result[0].idPays;
        res.render('pages/index', {title: req.params.pays, page: pages['descpays'][1], pays:req.params.pays, id:id, flag: flag, map: map, monument: monument});
    });
};

/*
getLangue
----------------------------
* Get User Language
**********************
* callback to return the lang
*/
exports.getLang = function(user, callback)
{
    var reqLng = "SELECT lng FROM utilisateur WHERE login='"+user+"'";
    db.query(reqLng, function(err, result)
    {
        callback(null, result[0].lng);
    });       
};

exports.updateLang = function(user, lng)
{
    var reqUpdate = "UPDATE utilisateur SET lng = '"+lng+"' WHERE login = '"+user+"'";   
    db.query(reqUpdate);
};