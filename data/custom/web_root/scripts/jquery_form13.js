// callback when address has been geocoded
function ksdSetNeighborhood(rc) {
  if (rc.status == 'OK' && rc.neighborhood != 'Unknown') {
    var currentHood = $j("#neighborhood").val();
    if (currentHood == '') {
      $j("#neighborhood").val(rc.neighborhood);
    }
  }
}

// callback when basemap is loaded
function plotPrimaryResidence() {
  var address = $j('#address').text();
  codeAddress(null, address, 'Primary Residence', null, null, ksdSetNeighborhood);
}

// happy.js validations
$j(document).ready(function () {
  // check 'N' for opt out if nothing was checked
  var radios = $j("input:radio[ends-with(@name,'srs_opt_out']");
  if (radios.is(':checked') === false) {
    radios.filter('[value=N]').attr('checked', true);
  }

  // load the map
  loadMapData(ksdBasemapData, 'map', plotPrimaryResidence);
  
  $j('#form13').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit
  });
});