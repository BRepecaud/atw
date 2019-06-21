var langs = 
{
    FR:
    {
        BR: "Le Brésil est le plus grand Etat d'Amérique Latine.",
        MX: "Le Mexique est connu pour son héritage inca."
    },
    
    EN:
    {
        BR: "Brazil is the greatest State of South America.",
        MX: "Mexico is known for its inca's legacy."
    },
    
    ES:
    {
        BR: "Brasil es el mas grande Estado de América Latina.",
        MX: "Mexico esta conocido por su herancia inca."
    },
    
    PR:
    {
        BR: "O Brasil é o maior Estado de America Latina.",
        MX: "Mexico esta conhecido pela sua herança inca."
    }
};

$(document).ready(function(){
    switchLang('FR');
});

$('.lng').click(function(){
    switchLang($(this).attr('id'));
});    

function switchLang(lng)
{
    var lng = lng;
    var pays = $('#descpays').attr('data-lang');
    var texte = langs[lng][pays];
    $("#descpays").text(texte);    
};