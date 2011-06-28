function setNeighborhood(rc)
  if (rc.status == 'OK') {
    var currentHood = jq15("#neighborhood").val();
    if (currentHood == '') {
      jq15("#neighboorhood").val() = rc.neighborhood;
    }
  }
}

// called when basemap is loaded
function plotPrimaryResidence() {
  var address = jq15('#address').text();
  codeAddress(null, address, 'Primary Residence', null, null, setNeighborhood);
}

// happy.js validations
jq15(document).ready(function () {
  loadMapData(ksdBasemapData, 'map', plotPrimaryResidence);
  jq15('#form10').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onRegFormSubmit
  });
});