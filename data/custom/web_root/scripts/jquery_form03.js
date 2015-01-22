function required_if_north_american(val) {
	var birth_country = $j("#birth_country option:selected").val();
	var error = false
	if (birth_country != null && /^US|CA|MX$/.test(birth_country)) {
	  error = (val.length === 0);
	}
	return !error;
}

// happy.js validations
$j(document).ready(function () {
  // copied from generaldemographics.html
  // If they don't select any of the visible options for ethnicity, choose "-1" for them ...
  var defaultEthnicity = document.getElementById("defaultEthnicity");
  if ( defaultEthnicity ) {
	  defaultEthnicity.value = "-1";
  }
  
  $j('#form03').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '#dob': {
        required: true,
        test: happy.date,
        message: 'Required field: please enter in format M/D/YYYY.' },
      '#gender': { 
        required: true,
        message: 'Please choose a gender from the list.' },
      '#birth_city': { 
        required: true,
        message: 'Required field: birth place city.' },
      '#birth_state': { 
        required: 'sometimes',
        test: required_if_north_american,
        message: 'Required field for US, Canada or Mexico birth place: state or province.' },
      '#birth_country': { 
        required: true,
        message: 'Required field: birth place country.' },
      '#first_usa_school': {
        required: 'sometimes',
        test: happy.emptyOrDate,
        message: 'Please enter in format M/D/YYYY.' },
      '.immigrant': { 
        required: true,
        message: 'Required field.' },
      '.hispanic_ethnicity': { 
        required: true,
        message: 'Required field.' },
      '#parent_edu': {
        required: true,
        message: 'Required field.' },
      '#lang_earliest': {
        required: true,
        message: 'Required field.' },
      '#lang_primary': {
        required: true,
        message: 'Required field.' },
      '#lang_spoken': {
        required: true,
        message: 'Required field.' },
      '#lang_adults': {
        required: true,
        message: 'Required field.' }
    }
  });
});
