// called when basemap is loaded
function plotAll() {
  var address = jq15('#address').text();
  codeAddress(null, address, 'Primary Residence', null, null);
}

// happy.js validations
jq15(document).ready(function () {
  loadMapData('http://ps.kentfieldschools.org/guardian/basemap.json', 'map', null);
  jq15('#form10').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onRegFormSubmit
  });
});