// This Javascript is based on code provided by the
// Community Church Javascript Team
// http://www.bisphamchurch.org.uk/   
// http://econym.org.uk/gmap/

// Class to hold information about the polygons we're drawing
function PolyMeta(opts) {
  this.test = opts.test;
  this.title = opts.title;
  return this;
}

// Class to implement text drawing as overlays
// See http://blog.mridey.com/2009/09/label-overlay-example-for-google-maps.html
// Define the overlay, derived from google.maps.OverlayView
// Extending the OverlayView, we add two dynamic properties:
// 'position' - LatLng of label's location
// 'bgcolor' - background color
// 'text' - text to draw
function Label(opt_options) {
 // Initialization
  this.setValues(opt_options);

  // Label specific
  var span = document.createElement('span');
  span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
                      'white-space: nowrap; border: 1px solid blue; ' +
                      'padding: 2px; background-color: white';

  var div = document.createElement('div');
  div.appendChild(span);
  div.style.cssText = 'position: absolute; display: none;';
  this.div_ = div;
  this.span_ = span;
  return this;
};
Label.prototype = new google.maps.OverlayView;

Label.prototype.onAdd = function() {
  var pane = this.getPanes().overlayLayer;
  pane.appendChild(this.div_);

  // Ensures the label is redrawn if the text or position is changed.
  var me = this;
  this.listeners_ = [
   google.maps.event.addListener(this, 'position_changed', function() { me.draw(); }),
   google.maps.event.addListener(this, 'text_changed', function() { me.draw(); })
  ];
};

Label.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);

  // Label is removed from the map, stop updating its position/text.
  for (var i = 0, n = this.listeners_.length; i < n; ++i) {
    google.maps.event.removeListener(this.listeners_[i]);
  }
};

// Implement draw
Label.prototype.draw = function() {
  var latLngPos = this.get('position');
  var projection = this.getProjection();
  var pixelPos = projection.fromLatLngToDivPixel(latLngPos);

  var div = this.div_;
  div.style.left = pixelPos.x + 'px';
  div.style.top = pixelPos.y + 'px';
  div.style.backgroundColor = this.get('bgcolor');
  div.style.display = 'block';

  this.span_.innerHTML = this.get('text').toString();
};

// Our class to manage loading Google Maps and placing markers, polygons and labels
function MapLoader(basemapData, params, mapNodeId, callback) {
  this.params_ = params;
  this.mapNodeId_ = mapNodeId;
  this.callback_ = callback;
  this.jsonData_ = basemapData;
  this.map_ = null;
  this.markers_ = [];
  this.htmls_ = [];
  this.polygons_ = [];
  this.polymeta_ = [];
  this.sideBarHtml_ = "";
  this.geocoder_ = null;
  return this;
}

MapLoader.prototype.createMap = function() {  
  // Display the map, with some controls
  var mapNode = document.getElementById(this.mapNodeId_);
  var mapOptions = { 
    center: this.makeLatLng(this.jsonData_.center), 
    mapTypeId: google.maps.MapTypeId.ROADMAP, 
    zoom: this.jsonData_.zoom 
  };
  var map = new google.maps.Map(mapNode, mapOptions);
  // map.addControl(new GLargeMapControl());
  // map.addControl(new GMapTypeControl());
  this.map_ = map;

  // Plot the polygons
  var polys = this.jsonData_.polygons;
  for (var i = 0; i < polys.length; i++) {
    this.polymeta_[i] = new PolyMeta({
      test: polys[i].test,
      title: polys[i].title
    });

    var opacity = 0.4;
    if (polys[i].test != 1) {
      opacity = 0.0;
    }
    this.polygons_[i] = new google.maps.Polygon({
      paths: polys[i].points.map(this.makeLatLng), 
      strokeColor: polys[i].color,
      strokeWidth: polys[i].width,
      fillColor: polys[i].color,
      fillOpacity: opacity,
      clickable: false });
    this.polygons_[i].setMap(this.map_);
  }

  // Plot the markers
  var markers = this.jsonData_.markers;
  for (var i = 0; i < markers.length; i++) {
    this.createMarker(this.makeLatLng(markers[i].point), markers[i].title, markers[i].html);
  }
  
  // Plot the labels
  var labels = this.jsonData_.labels;
  for (var i = 0; i < labels.length; i++) {
    var label = new Label({ map: this.map_ });
    label.set('position', labels[i].point);
    label.set('bgcolor', labels[i].bgcolor);
    label.set('text', labels[i].text);
  }  
  
  // callback when map is ready
  if (this.callback_) {
    this.callback_();
  }
};

// Utility function to convert from [lng, lat] (KML coordinate order) array to google.maps.LatLng object
MapLoader.prototype.makeLatLng = function(lngLatCoords) {
  return new google.maps.LatLng(lngLatCoords[1], lngLatCoords[0]);
}

// A function to create the marker and set up the event window
MapLoader.prototype.createMarker = function(point, title, html) {
  var i = this.markers_.length;
  var marker = new google.maps.Marker({ 
    position: point, 
    map: this.map_, 
    title: title
    });
  google.maps.event.addListener(marker, "click", function() {
    var win = new google.maps.InfoWindow({content: html});
    win.open(marker.getMap(), marker);
  });
  // save the info we need to use later for the side_bar
  this.markers_[i] = marker;
  this.htmls_[i] = html;
  // add a line to the side_bar html
  this.sideBarHtml_ += '<a href="javascript:sideBarClick(' + i + ')">' + title + '<\/a><br/>';
  return marker;
};

// A method for testing if a point is inside a polygon
// Returns true if poly contains point
// Algorithm shamelessly stolen from http://alienryderflex.com/polygon/ 
MapLoader.prototype.polygonContains = function(poly, point) {
  var dLat, thisVertex, prevVertex;
  var x = point.lng();
  var y = point.lat();
  var path = poly.getPath().getArray();
  var n = path.length;
  var j = n - 1;
  var oddNodes = false;
  for (var i = 0; i < n; i++) {
    thisVertex = path[i];
    prevVertex = path[j];
    dLat = prevVertex.lat() - thisVertex.lat();
    if (dLat != 0 && 
      (((thisVertex.lat() < y) && (prevVertex.lat() >= y)) ||
      ((prevVertex.lat() < y) && (thisVertex.lat() >= y)))) {
      if ((thisVertex.lng() + 
        ((y - thisVertex.lat()) * (prevVertex.lng() - thisVertex.lng())) / dLat) < x) {
        oddNodes = !oddNodes;
      }
    }
    j = i;
  }
  return oddNodes;
}

MapLoader.prototype.findPolygon = function(point) {
  var polys = this.jsonData_.polygons;
  var found = '';
  for (var i = 0; i < polys.length; i++) {
    if (this.polymeta_[i].test) {
      if (this.polygonContains(this.polygons_[i], point)) {
        found = this.polymeta_[i].title;
        break; 
      }
    }
  }
  return found;
}

MapLoader.prototype.geocode = function(opts, callback) {
  if (this.geocoder_ == null) {
    this.geocoder_ = new google.maps.Geocoder();
  }
  this.geocoder_.geocode(opts, callback);
}

// Global variable
var loader = null;

// Arguments: number to round, number of decimal places
function roundFloat(number, decimals) { 
	var new_number = new Number(number + '').toFixed(parseInt(decimals));
	return parseFloat(new_number);
}

// This function picks up the click and opens the corresponding info window
function sideBarClick(i) {
  if (loader) {
    var win = new google.maps.InfoWindow({content: loader.htmls_[i]});
    win.open(loader.map_, loader.markers_[i]);
  }
}

function geocodingResultHTML(result) {
  var html = '{ "student_number": ' + sn;
  var point = result.geometry.location;
  html += ',<br/>"lat": ' + roundFloat(point.lat(), 6);
  html += ',<br/>"lng": ' + roundFloat(point.lng(), 6);
  var loc_type = result.geometry.location_type;
  var precision = "exact";
  if (loc_type == google.maps.GeocoderLocationType.APPROXIMATE) {
    precision = 'approximate';
  }
  if (loc_type == google.maps.GeocoderLocationType.GEOMETRIC_CENTER) {
    precision = 'center';
  }
  if (loc_type == google.maps.GeocoderLocationType.RANGE_INTERPOLATED) {
    precision = 'interpolated';
  }
  html += ',<br>"precision": ' + precision + '"';
  html += ',<br/>"formatted_address": "' + result.formatted_address + '"';
  html += ',<br/>"neighborhood": "' + neighborhood + '"';

  for (var i = 0; i < result.address_components.length; i++) {
    var long_name = result.address_components[i].long_name;
    var short_name = result.address_components[i].short_name;
    var type = result.address_components[i].types[0];
    if (type == "street_number" || type == "route" || type == "locality" ||
      type == "sublocality" || type == "postal_code") {
      html += ',<br/>"' + type + '": "' + long_name + '"';
    }
  }
  html += '<br/>},<br/>';
  return html;
}

function codeAddress(sn, full_address, title, html, debugNodeId, callback) {
  if (loader) {
    loader.geocode( { 'address': full_address }, function(results, status) {
      var debugNode = null;
      if (debugNodeId) {
        debugNode = document.getElementById(debugNodeId);
      }
      if (status == google.maps.GeocoderStatus.OK) {
        var point = results[0].geometry.location;
        loader.createMarker(point, title, html);
        var neighborhood = loader.findPolygon(point);
        if (neighborhood == '') {
          neighborhood = 'Unknown';
        }
        if (debugNode) {
          debugNode.innerHTML += geocodingResultHTML(results[0]);
        }
        if (callback) {
          callback({ status: "OK", geocoding: results[0], neighborhood: neighborhood });
        }
      } else {
        if (debugNode) {
          debugNode.innerHTML += "Geocode for " + sn + " was not successful: " + status + "<br/>";
        }
        if (callback) {
          callback({ status: status, gecoding: null, neighborhood: 'Unknown' });
        }
      }
    });
  }
}

// Called by window.onload
function loadMapData(basemapData, mapNodeId, callback) {
  try {
    // creates problems on Internet Explorer 8, at least
    loader = new MapLoader(basemapData, {}, mapNodeId, callback);
    loader.createMap();
  } catch(err) {
    loader = null;
  }
}
