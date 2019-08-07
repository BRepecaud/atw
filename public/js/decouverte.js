$(function(){
    var map = new jvm.Map({
        map:'world_mill_fr',
        regionsSelectable: true,
        container: $('#decouverte'),
        backgroundColor: '#d5d5bd',
        //-----------------------------Style country selected
        regionStyle: 
        {
            initial: 
            {
                fill: '#2b1b15'
            },
            selected: 
            {
                fill: '#2b1b15'
            }
        },
        
        //-----------------------------Country selected: redirection to the desc page
        onRegionSelected: function(event, code)
        {
            var map = $("#decouverte").vectorMap('get', 'mapObject');
            var nom = map.getSelectedRegions(code);
            window.location.href='/decouverte/'+nom;
        },
        
        //-----------------------------Country on hover (display of the country note)
        onRegionTipShow: function(e, el, code)
        {
            el.html(el.html()+ ' Note');
        }
    });
});   