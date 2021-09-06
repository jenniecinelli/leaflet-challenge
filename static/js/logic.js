
// Creating map object
var map = L.map("map", {
  center: [35, -90],
  zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  id: 'mapbox/light-v9',
  accessToken: API_KEY
}).addTo(map);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Grabbing our GeoJSON data..
d3.json(url).then(function(data) {
  console.log(data);
  
  L.geoJson(data, {

    pointToLayer: function (feature) {
        
        const latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        // console.log(depth)
        return L.circleMarker(latlng, geojsonMarkerOptions(feature));
    },

    onEachFeature: function(feature, layer) {
        var depth = feature.geometry.coordinates[2];
        layer.bindPopup("Location: " + feature.properties.place + "<hr>Magnitude: " + feature.properties.mag + "<br>Depth: " + Math.abs(depth) + " miles");


    }}).addTo(map);

function geojsonMarkerOptions(feature, colorLinearScale)  {
  var depth = feature.geometry.coordinates[2];
  var geojsonMarkerOptions = {
      radius: 5*feature.properties.mag,
      fillColor: getColor(depth),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };
  return geojsonMarkerOptions
}

function getColor(d) {
  return d < 1  ? '#89d16b' :
         d < 2  ? '#9ed46d' :
         d < 3  ? '#b1d771' :
         d < 4  ? '#c3da76' :
         d < 5  ? '#d3dd7c' :
         d < 6  ? '#ddd573' :
         d < 7  ? '#e7cd6d' :
         d < 8  ? '#f0c569' :
         d < 9  ? '#f6ae5b' :
         d < 10 ? '#fb9755' :
         d < 11 ? '#fd7d57' :
         d < 12 ? '#DE605D' :
                    '#DC403D';
}

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            labels = [];
    
            div.innerHTML +='Magnitude<br><hr>'

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += 
                '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(map);

});
