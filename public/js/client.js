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