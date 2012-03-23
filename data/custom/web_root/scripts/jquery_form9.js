function todayIfBlank(val) {
  if (val === '') {
    val = today_mdy();
  }
  return val;
}

// happy.js validations
jq15(document).ready(function () {
  jq15('#form9').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '.annual_notice': {
        required: true,
        message: 'Required field.' },
      '.release_directory_info': {
        required: true,
        message: 'Required field.' },
      '.previous_school_contact': {
        required: true,
        message: 'Required field.' },
      '#emergency_hospital': {
        required: true,
        message: 'Required field.' },
      '.emergency_care': {
        required: true,
        message: 'Required field.' },
      '.ipm_notifications': {
        required: true,
        message: 'Required field.' },
      '.off_campus_walks': {
        required: true,
        message: 'Required field.' },
      '.acceptable_use': {
        required: true,
        message: 'Required field.' },
      '.computer_use': {
        required: true,
        message: 'Required field.' },
      '.google_apps': {
        required: true,
        message: 'Required field.' },
      '.social_learning': {
        required: true,
        message: 'Required field.' },
      '.publish_images': {
        required: true,
        message: 'Required field.' },
      '.publish_articles': {
        required: true,
        message: 'Required field.' },
      '.publish_works': {
        required: true,
        message: 'Required field.' }
    }
  });
});