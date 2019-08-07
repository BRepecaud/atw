exports.dataPages = function()
{
    var pages = new Array();
    pages['authentification'] = ['Authentification', '../pages/connexion', 'auth'];
    pages['inscription'] = ['Inscription', '../pages/inscription', 'insc'];
    pages['home'] = ['Around The World, \n Mon carnet de Voyage', '../pages/home', 'welcome'];
    pages['profil'] = ['Profil', '../pages/profil', 'pf'];
    pages['mespays'] = ['Mes Pays', '../pages/mespays', 'mp'];
    pages['decouverte'] = ['Découverte', '../pages/decouverte', 'dscvr'];
    pages['descpays'] = ['Découverte', '../pages/descpays', 'dscvr'];
    pages['avis'] = ['Avis', '../pages/avispays', 'avispays'];
    pages['pav'] = ['PAV', '../pages/pav'];
    pages['pv'] = ['PV', '../pages/pv'];
    
    return pages;
};


