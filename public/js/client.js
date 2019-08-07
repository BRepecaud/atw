var socket = io.connect('http://localhost:28');
//var socketAccueil = io.connect('http://localhost:28/accueil');
/*
* Ask the server to return the user language
* Once it's done: switchLang
*/
$(document).ready(function()
{
    socket.emit('loadLng');
    
    socket.on('reploadLng', function(lng)
    {
        switchLang(lng);
    });
    ajoutPV();
    
    socket.on('menuActif', function(liActif)
    {
        $(".actif").toggleClass("actif");
        $(liActif).toggleClass("actif");  
        console.log(liActif);
    });
});

/*
updateLng
----------------------------
**********************
* Click or change on select option = switch + update
*/
//-----------------------------------Click
$('.lng').click(function()
{
    console.log('yo');
    var lang = $(this).attr('id');
    switchLang(lang);
    socket.emit('updateLng', lang);
});    

//-----------------------------------Change
$('#selectLang').on('change', function()
{
    var lang = $(this).children(':selected').attr('id');
    $('#updateLang').click(function()
    {
        switchLang(lang);
        socket.emit('updateLng', lang);
    });
});

/*
switchLang
----------------------------
**********************
* Every .lang elems changed by the lng param
*/
function switchLang(lng) //----------------------Modif BDD
{
    var lng = lng;

    $(".lang").each(function()
    {
        var key = $(this).attr('data-lang');
        var texte = langs[lng][key];
        $(this).text(texte);            
    });
};

/*
add/delPAV
----------------------------
**********************
* emit country server has to add / delete from the user list
*/
//-------add
$("#addPAV").click(function(){
    var pays = $("#descpays").attr('data-lang');
    socket.emit('newPAV', pays);
});

//-------del
$("#delPAV").click(function(){
    var pays = $("#descpays").attr('data-lang');
    socket.emit('delPAV', pays);
});


/*
ajoutPV
----------------------------
**********************
* Hide/show opinion form
*/
function ajoutPV()
{
    var pv = $("#btnPV");
    var pav = $("#btnPAV");
    var blocVisite = $(".ajoutPV");
    
    if(pav.is(':checked'))
    {
        blocVisite.hide();
    }
    else if(pv.is(':checked'))
    {
        blocVisite.show();
    }    
}

$(":radio[name=pvpav]").click(function()
{
    ajoutPV();
});

/*
savePV
----------------------------
**********************
* Emit user's opinion to save it
*/
$("#savePV").click(function()
{
    var note = $(":radio[name=note]:checked").val();
    var avis = $("#avis-textarea").val();
    var securite = $(":radio[name=securite]:checked").val();
    //var id = $('.monpays').attr('id');    
    var id = $('form').attr('class');    
    socket.emit('savePV', note, avis, securite, id);
});

$("#menu li").click(function()
{
    socket.emit('menuActif', $(this));
});