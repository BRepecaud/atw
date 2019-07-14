var socket = io.connect('http://localhost:28');

/*
* Ask the server to return the user language
* Once it's done: switchLang
*/
$(document).ready(function(){
    socket.emit('loadLng');
    
    socket.on('reploadLng', function(lng)
    {
        switchLang(lng);
    });
    ajoutPV();
    
});

/*
updateLng
----------------------------
**********************
* Click or change on select option = switch + update
*/
//-----------------------------------Click
$('.lng').click(function(){
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
deconnexion
----------------------------
**********************
* inform user's disconnected, redirect to deconnexion's page
*/
$("#deco").click(function()
{
    socket.emit('deco');
    window.location.href='/deconnexion';
});

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

$("#savePV").click(function()
{
    var note = $(":radio[name=note]:checked").val();
    var avis = $("#avis-textarea").val();
    var securite = $(":radio[name=securite]:checked").val();
    var id = $('.monpays').attr('id');
    console.log(note);
    console.log(avis);
    console.log(id);
    
    socket.emit('savePV', note, avis, securite, id);
});