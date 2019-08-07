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
               res.render('pages/index', {title: pages['authentification'][0], page: pages['authentification'][1], datalang: pages['authentification'][2], message: "Inscription ok"});
            });            
        }
        //-------------------------------------PWD !=
        else if(pwd !== pwd2)
        {
            res.render('pages/index', {title: pages['inscription'][0], page: pages['inscription'][1], datalang: pages['inscription'][2], message: "Inscription impossible, mots de passe différents"});
        }
        //-------------------------------------LOGIN EXISTS
        else if(result.length)
        {
            res.render('pages/index', {title: pages['inscription'][0], page: pages['inscription'][1], datalang: pages['inscription'][2], message: "Inscription impossible, login déjà utilisé"});
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
            //var session = req.session;
            req.session.user = result[0].login;
            res.redirect('/accueil');
            //res.render('pages/index', {title: pages['home'][0], page: pages['home'][1], user: req.session.user});
        }
        else
        {
            res.render('pages/index', {title: pages['authentification'][0], page: pages['authentification'][1], datalang: pages['authentification'][2], message: "Mauvais login ou mot de passe"});            
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
        res.render('pages/index', {title: pages['profil'][0], page: pages['profil'][1], datalang: pages['profil'][2], user: result[0].login, lng: result[0].lng, nbpv: result[0].nbPV, niveau: result[0].niveau});            
    });
};


/* 
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 ********************************LANGUE***************************************************
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 */
/*
getLang
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

/*
updateLang
----------------------------
* Update User Language
**********************
*/
exports.updateLang = function(user, lng)
{
    var reqUpdate = "UPDATE utilisateur SET lng = '"+lng+"' WHERE login = '"+user+"'";   
    db.query(reqUpdate);
};

/* 
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 ********************************PAYS*****************************************************
 *****************************************************************************************
 *****************************************************************************************
 *****************************************************************************************
 */
/*
addPAV
----------------------------
* Add selected country to PAV
**********************
*/
exports.addPAV = function(user, pays)
{
    var statut = 'à visiter';
    var reqPAV = "INSERT INTO paysutilisateur(statut, login, idPays) \n\
    VALUES ('" + statut + "','" + user + "','" + pays + "')";
    db.query(reqPAV, function(err, result)
    {
        if(err)
        {
            console.log("PAV déjà ajouté");
        }
    });
};

/*
delPAV
----------------------------
* Delete selected country to PAV
**********************
*/
exports.delPAV = function(user, pays)
{
    var reqdelPAV = "DELETE FROM paysutilisateur WHERE idPays = '" + pays + "' AND login= '"+user+"'";
    db.query(reqdelPAV, function(err, result)
    {
        if(err)
        {
            console.log("Impossible de le supprimer, PAV pas ajouté à votre liste");
        }
    });
};

/*
getMesPays
----------------------------
* SELECT user countries + parse into json (used in jvectormap)
**********************
* JSON : 
* * ',' if not the last 
* * color pv / pav 
*/
exports.getMesPays = function(user, callback)
{
    var reqMesPays = "SELECT * FROM paysutilisateur WHERE login= '"+user+"'";
    db.query(reqMesPays, function(err, result)
    {
        var mespays = '[';
        var pv = '#48A90A';
        var pav = '#FFD700';
        var tab;
        for(var i=0; i<result.length; i++)
        {
            var statut = result[i].statut;
            var pays = result[i].idPays;
            
            if(statut === 'à visiter')
            {
                couleur = pav;
            }
            else
            {
                couleur = pv;
            }

            if(i === result.length - 1)
            {
                mespays += '{"'+pays+'":"'+couleur+'"}';
            }
            else
            {
                mespays += '{"'+pays+'":"'+couleur+'"},';
            }
        }
        mespays += ']';
        tab = JSON.parse(mespays);
        callback(null, tab);
    });
};

/*
mespays
----------------------------
* Redirect to decouverte or sauvegarde or :pays
**********************
*/
exports.mespays = function(req, res)
{
    var pages = require('../models/pages');
    var user = req.session.user;
    var id = req.params.idPays;
    pages = pages.dataPages();    
    
    var reqMonPays = "SELECT * FROM paysutilisateur WHERE idPays = '"+id+"' AND login = '"+user+"'";   
    var reqDescPays = "SELECT * FROM pays WHERE idPays = '"+id+"'";   
    var reqAvis = "SELECT note, commentaire, statut, DATE_FORMAT(dateAvis, '%d/%m/%Y - %H:%i') AS date FROM avis WHERE login = '"+user+"' AND idPays = '"+id+"'"; 
    
    db.query(reqMonPays, function(err,result)
    {
        //-------------------------Rien: redirect decouverte
        if(result.length === 0)
        {
            res.redirect('/decouverte/'+id);
        }
        else 
        {
            var statut = result[0].statut;
            
            db.query(reqDescPays, function(err, result)
            {
                var nom = result[0].nom;
                var flag = result[0].drapeau;
                
                //-------------------------PAV
                if(statut === 'à visiter')
                {
                    res.redirect('/mespays/'+id+'/sauvegarde');
                }

                //-------------------------PV
                else if (statut === 'visité')
                {
                    db.query(reqAvis, function(err, result)
                    {
                        var commentaire = result[0].commentaire;
                        var note = result[0].note;
                        var date = result[0].date;
                        res.render('pages/index', {title: nom, page: pages['pv'][1], datalang: nom, pays:nom, id:req.params.idPays, flag: flag, com: commentaire, note:note, date:date});
                    });
                    
                }
            });

        }
    });
    
};

/*
sauvegardeAvis
----------------------------
* Sauvegarde page
**********************
* Avis display 
*/
exports.sauvegardeAvis = function(req, res)
{
    var pages = require('../models/pages'); 
    var user = req.session.user;
    var id = req.params.idPays;
    var reqDescPays = "SELECT * FROM pays WHERE idPays = '"+id+"'";  
    var reqAvis = "SELECT * FROM avis WHERE login = '"+user+"' AND idPays = '"+id+"'";
    pages = pages.dataPages();    

    db.query(reqAvis, function(err, result1)
    {
        db.query(reqDescPays, function(err, result)
        {
            var nom = result[0].nom;
            var flag = result[0].drapeau;     
            var securite = 0;     
            var avis = '';
            var note = 2;
            if(result1.length !== 0)
            {
                securite = result1[0].statut;
                note = result1[0].note;
                avis = result1[0].commentaire;
            }
            res.render('pages/index', {title: nom, page: pages['pav'][1], datalang: nom, pays:nom, id:req.params.idPays, flag: flag, note: note, avis: avis, statut:securite});                    
        });        
    });
        
};

/*
savePV
----------------------------
* INSERT / SAVE avis
**********************
* params: note, avis, securite, user, id
*/
exports.savePV = function(note, avis, securite, user, id)
{
    var model = require('../models/model');     
    var statut = 'visité';
    var reqSavePV = "INSERT INTO avis(dateAvis, note, commentaire, statut, login, idPays) \n\
    VALUES (NOW(), '" + note + "','" + avis + "','" + securite +"','" + user +"','" + id + "')";

    var reqUpdatePU = "UPDATE paysutilisateur\n\
    SET statut = '" + statut +"' WHERE login = '" + user +"' AND idPays = '" + id + "'";
    
    var reqUpdatePV = "UPDATE avis \n\
    SET dateAvis = NOW(), note = '" + note + "', commentaire = '" + avis + "', statut = '" + securite +"' WHERE login = '" + user +"' AND idPays = '" + id + "'";
    
    db.query(reqSavePV, function(err, result)
    {
        if(err)
        {
            db.query(reqUpdatePV);
        }
        else
        {
            model.updateProfil(user);
            db.query(reqUpdatePU);
        }
    });
};

/*
updateProfil
----------------------------
* Lvl + nbPV update
**********************
*/
exports.updateProfil = function(user)
{   
    var reqNiveau = "SELECT * FROM utilisateur WHERE login = '"+user+"'";
    
    db.query(reqNiveau, function(err, result)
    {
        var nbPV = result[0].nbPV;
        
        if(nbPV+1 < 3)
        {
            niveau = 'débutant';
        }
        else if(nbPV+1 >= 3 && nbPV+1 < 6)
        {
            niveau = 'intermédiaire';
        }
        else if(nbPV+1 >= 6)
        {
            niveau = 'expert';
        }

        var reqUpdateNbPV = "UPDATE utilisateur\n\
        SET nbPV = nbPV+1, niveau = '"+niveau+"'WHERE login = '" + user +"'";        
        
        db.query(reqUpdateNbPV);
    });
};

/*
descpays
----------------------------
* Description of the country
**********************
* SELECT all country's informations
* + users' opinion
* + average mark
* Render with them (image, desc...)
*/
exports.descpays = function(req, res)
{
    var pages = require('../models/pages');
    pages = pages.dataPages();    
    var user = req.session.user;
    var reqPays = "SELECT * FROM pays WHERE idPays = '"+req.params.idPays+"'";
    var reqAvisPays =  "SELECT login, note, commentaire, DATE_FORMAT(dateAvis, '%d/%m/%Y - %H:%i') AS date FROM avis WHERE statut = 1 AND idPays = '"+req.params.idPays+"' ORDER BY date";
    var reqMoyennePays =  "SELECT AVG(note) AS moyenne FROM avis WHERE statut = 1 AND idPays = '"+req.params.idPays+"'";
    
    db.query(reqPays, function(err, result)
    {
        var flag = result[0].drapeau;
        var map = result[0].carte;
        var monument = result[0].monument;
        var nom = result[0].nom;
        var nomMonument = result[0].nomMonument;
        var tabAvis = new Array();
        
        db.query(reqAvisPays, function(err, result)
        {
            if(!err)
            {
                for(var i=0; i<result.length; i++)
                {
                    var login = result[i].login;
                    var date = result[i].date;
                    var note = result[i].note;
                    var commentaire = result[i].commentaire;

                    tabAvis[i] = [login, date, note, commentaire];
                }
                db.query(reqMoyennePays, function(err, result)
                {
                    var moyenne = result[0].moyenne;
                    var ok = false;

                    for(var i=0; i<tabAvis.length; i++)
                    {
                        var login = tabAvis[i][0];
                        if(user === login)
                        {
                            ok = true;
                        }
                    }
                    res.render('pages/index', {title: nom, page: pages['descpays'][1], datalang: nom, pays:nom, id:req.params.idPays, flag: flag, map: map, monument: monument, nomMonument: nomMonument, avis: tabAvis, moyenne:moyenne, ok:ok});
                });                    
            }
        });
    });
};

/*
avispays
----------------------------
* User's opinion
**********************
* SELECT all users' opinion
* Render Avispays' page
*/
exports.avispays = function(req, res)
{
    var pages = require('../models/pages');
    pages = pages.dataPages(); 
    
    var reqPays = "SELECT * FROM pays WHERE idPays = '"+req.params.idPays+"'";
    var reqAvisPays =  "SELECT login, note, commentaire, DATE_FORMAT(dateAvis, '%d/%m/%Y - %H:%i') AS date FROM avis WHERE statut = 1 AND idPays = '"+req.params.idPays+"' ORDER BY date";
    var tabAvis = new Array();    
    
    db.query(reqPays, function(err,result)
    {
        var flag = result[0].drapeau;
        var nom = result[0].nom;
        
        db.query(reqAvisPays, function(err,result)
        {
            for(var i=0; i<result.length; i++)
            {
                var login = result[i].login;
                var date = result[i].date;
                var note = result[i].note;
                var commentaire = result[i].commentaire;
                tabAvis[i] = [login, date, note, commentaire];
            }
            res.render('pages/index', {title: nom, page: pages['avis'][1], datalang: nom, pays:nom, id:req.params.idPays, flag: flag, avis: tabAvis});
        });        
    });
};