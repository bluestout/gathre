$(() => {
  $('#chkPassport').click(function() {
    if ($(this).is(':checked')) {
      $('.shown-if-js .step__footer__continue-btn').show();
    } else {
      $('.shown-if-js .step__footer__continue-btn').hide();
    }
  });
});

