// This Javascript is based on code provided by the
// Community Church Javascript Team
// http://www.bisphamchurch.org.uk/   
// http://econym.org.uk/gmap/

function PolyMeta(opts) {
  this.test = opts.test;
  this.title = opts.title;
  return this;
}

function MapLoader(url, params, mapNodeId, sideBarNodeId) {
  this.url_ = url;
  this.params_ = params;
  this.mapNodeId_ = mapNodeId;
  this.sideBarNodeId_ = sideBarNodeId;
  this.map_ = null;
  this.jsonData_ = null;
  this.markers_ = [];
  this.htmls_ = [];
  this.polygons_ = [];
  this.polymeta_ = [];
  this.sideBarHtml_ = "";
  this.geocoder_ = null;
  return this;
}

MapLoader.prototype.loadMap = function() {
  var me = this;
  
  // load our marker and polyline data
  JSONP.get(me.url_, me.params_, function(data) { me.createMap(data); });
}

MapLoader.prototype.createMap = function(data) {
  this.jsonData_ = data;
  
  // Display the map, with some controls
  var mapOptions = { center: this.jsonData_.center, mapTypeId: google.maps.MapTypeId.ROADMAP, zoom: this.jsonData_.zoom }
  var map = new google.maps.Map(document.getElementById(this.mapNodeId_), mapOptions);
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

  plotAll();

  // Put the assembled sideBarHtml contents into the div
  if (this.sideBarNodeId_) {
    var sideBar = document.getElementById(this.sideBarNodeId_);
    if (sideBar) {
      sideBar.innerHTML = this.sideBarHtml_;
    }
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

function codeAddress(sn, full_address, title, html, debugNodeId) {
  loader.geocode( { 'address': full_address }, function(results, status) {
    var debugNode = null;
    if (debugNodeId) {
      debugNode = document.getElementById(debugNodeId);
    }
    if (status == google.maps.GeocoderStatus.OK) {
      var point = results[0].geometry.location;
      loader.createMarker(point, title, html);
      if (debugNode) {
        var html = '{ "student_number": ' + sn;
        html += ',<br/>"lat": ' + roundFloat(point.lat(), 6);
        html += ',<br/>"lng": ' + roundFloat(point.lng(), 6);
        var loc_type = results[0].geometry.location_type;
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
        html += ',<br/>"formatted_address": "' + results[0].formatted_address + '"';
        var foundPoly = loader.findPolygon(point)
        if (foundPoly == '') {
          foundPoly = 'Unknown';
        }
        html += ',<br/>"neighborhood": "' + foundPoly + '"';
        
        for (var i = 0; i < results[0].address_components.length; i++) {
          var long_name = results[0].address_components[i].long_name;
          var short_name = results[0].address_components[i].short_name;
          var type = results[0].address_components[i].types[0];
          if (type == "street_number" || type == "route" || type == "locality" ||
            type == "sublocality" || type == "postal_code") {
            html += ',<br/>"' + type + '": "' + long_name + '"';
          }
        }
        html += '<br/>},<br/>';
        debugNode.innerHTML += html;
      }
    } else {
      if (debugNode) {
        html = "Geocode for " + sn + " was not successful: " + status + "<br/>";
        debugNode.innerHTML += html;
      }
    }
  });
}

function gmaps_initialized() {
  loader.loadMap();
}

// Called by window.onload
function loadMapData(url, mapNodeId, sideBarNodeId) {
  loader = new MapLoader(url, {}, mapNodeId, sideBarNodeId);
  
  // var script = document.createElement("script");
  // script.type = "text/javascript";
  // script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=gmaps_initialized";
  // document.body.appendChild(script);
  
  gmaps_initialized();
}
