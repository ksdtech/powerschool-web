// callback when address has been geocoded
function ksdSetNeighborhood(rc) {
  if (rc.status == 'OK' && rc.neighborhood != 'Unknown') {
    var currentHood = jq15("#neighborhood").val();
    if (currentHood == '') {
      jq15("#neighborhood").val(rc.neighborhood);
    }
  }
}

// callback when basemap is loaded
function plotPrimaryResidence() {
  var address = jq15('#address').text();
  codeAddress(null, address, 'Primary Residence', null, null, ksdSetNeighborhood);
}

// happy.js validations
jq15(document).ready(function () {
  // check 'N' for opt out if nothing was checked
  var radios = jq15("input:radio[ends-with(@name,'srs_opt_out']");
  if (radios.is(':checked') === false) {
    radios.filter('[value=N]').attr('checked', true);
  }

  // load the map
  loadMapData(ksdBasemapData, 'map', plotPrimaryResidence);
  
  jq15('#form11').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onRegFormSubmit
  });
});