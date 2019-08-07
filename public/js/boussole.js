var divBoussole = $('#boussole');
var cercle = $('#cercle');
var aiguille = $('#aiguille');
var test = $('.container');

var boussole = new Array();
boussole.push({
    cercle: cercle, 
    aiguille: aiguille
});
$(document).ready(function()
{

    $(document).mousemove(function(event)
    {
        var x = event.pageX;
        var y = event.pageY;

        var offset = aiguille.offset();
        var left = offset.left - x;
        var top = offset.top - y;
        var radian = Math.atan2(top, left);

        cercle.css({
           'transform' : "rotate(" + radian + "rad)"
        });
    });    
});