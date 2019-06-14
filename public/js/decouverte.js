$(function(){
    $("#world").vectorMap({
        map:'world_mill_fr',
        regionsSelectable: true,
        
        //-----------------------------Style country selected
        regionStyle: 
        {
            initial: 
            {
                fill: '#ffffff'
            },
            selected: 
            {
                fill: '#ffffff'
            }
        },
        
        //-----------------------------Country selected: redirection to the desc page
        onRegionSelected: function(event, code)
        {
            var map = $("#world").vectorMap('get', 'mapObject');
            var nom = map.getRegionName(code);
            console.log(nom);
            window.location.href='/decouverte/'+nom;
        },
        
        //-----------------------------Country on hover (display of the country note)
        onRegionTipShow: function(e, el, code)
        {
            el.html(el.html()+ ' Note');
        }
    });
});   