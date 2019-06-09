exports.inscription = function(req, res)
{
    //------------------------------------
    var pages = require('../models/pages');
    pages = pages.dataPages();
    
    var form = req.body;
    var login = form.login;
    var pwd = form.pwd;
    var pwd2 = form.pwd2;
    var niveau = 'débutant';
    var reqVerif = "SELECT * FROM utilisateur WHERE login = '"+ login + "'";
    
    
    db.query(reqVerif, function(err,result)
    {
        //-------------------------------------Inscription OK
        if(result.length === 0 && pwd === pwd2)
        {
            var reqInscription = "INSERT INTO utilisateur(login, pwd, nbPV, niveau) \n\
            VALUES ('" + login + "','" + pwd + "','" + 0 + "','" + niveau + "')";

            db.query(reqInscription, function(err, result)
            {
               res.redirect('/accueil'); 
            });            
        }
        //-------------------------------------Inscription PAS OK
        else if(pwd !== pwd2)
        {
            res.render('pages/index', {title: 'Inscription', page: pages['inscription'], message: "Inscription impossible, mots de passe différents"});
        }
        else if(result.length)
        {
            res.render('pages/index', {title: 'Inscription', page: pages['inscription'], message: "Inscription impossible, login déjà utilisé"});
        }
    });
};