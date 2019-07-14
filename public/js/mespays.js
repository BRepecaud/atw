var socket = io.connect('http://localhost:28');

//$(document).ready(function(){
socket.on('loadMesPays', function(){
    socket.emit('mesPays');
    socket.on('repMesPays', function(listePays)
    {
        var pv = '#48A90A';
        var pav = '#FFD700';
        
        var map = new jvm.Map({
            map:'world_mill_fr',
            regionsSelectable: true,
            container: $('#mespays'),
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
            series: {
                regions: [{
                    attribute: 'fill'
                }, 
                {
                    scale: {
                        'A visiter': pav, 
                        'Visité': pv 
                    },
                    legend: {
                        vertical: true,
                        title:'Mes Pays'
                    }                     
                }]                                   
            },
            
            onRegionSelected: function(event, code)
            {
                var carte = $("#mespays").vectorMap('get', 'mapObject');
                var idPays = carte.getSelectedRegions(code);
                window.location.href='/mespays/'+idPays;
            }
        });
        
        for(var i=0; i<listePays.length; i++)
        {
            map.series.regions[0].setValues(listePays[i]);
        }
            
    });
    
});