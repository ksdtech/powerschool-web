// This Javascript is based on code provided by the
// Community Church Javascript Team
// http://www.bisphamchurch.org.uk/   
// http://econym.org.uk/gmap/

function PolyMeta(opts) {
  this.test = opts.test;
  this.title = opts.title;
  return this;
}

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
  var mapOptions = { center: this.jsonData_.center, mapTypeId: google.maps.MapTypeId.ROADMAP, zoom: this.jsonData_.zoom }
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
    this.polygons_[i] = new google.maps.Polygon({
      paths: polys[i].points, 
      strokeColor: polys[i].color,
      strokeWidth: polys[i].width });
    this.polygons_[i].setMap(this.map_);
  }

  // Plot the markers
  var markers = this.jsonData_.markers;
  for (var i = 0; i < markers.length; i++) {
    this.createMarker(markers[i].point, markers[i].title, markers[i].html);
  }
  
  // callback when map is ready
  if (this.callback_) {
    this.callback_();
  }
};

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
        oddNodes = !oddNodes
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
        break 
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
  var win = new google.maps.InfoWindow({content: loader.htmls_[i]});
  win.open(loader.map_, loader.markers_[i]);
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

function codeAddress(sn, full_address, title, html, debugNodeId) {
  var rc = null;
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
      rc = { status: "OK", geocoding: results[0], neighboorhood: neighborhood };
    } else {
      if (debugNode) {
        debugNode.innerHTML += "Geocode for " + sn + " was not successful: " + status + "<br/>";
      }
      rc = { status: status, gecoding: null; neighborhood: 'Unknown' };
    }
  });
  return rc;
}

// Called by window.onload
function loadMapData(basemapData, mapNodeId, callback) {
  loader = new MapLoader(basemapData, {}, mapNodeId, callback);
  loader.createMap();
}
