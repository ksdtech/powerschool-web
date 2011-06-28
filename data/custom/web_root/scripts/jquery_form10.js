// called when basemap is loaded
function plotPrimaryResidence() {
  var address = jq15('#address').text();
  codeAddress(null, address, 'Primary Residence', null, null);
}

// happy.js validations
jq15(document).ready(function () {
  loadMapData(ksdBasemapData, 'map', plotPrimaryResidence);
  jq15('#form10').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onRegFormSubmit
  });
});