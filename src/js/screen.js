(function ($) {

  $(function() {
    console.log(drift);

    // Handle drift chat events
    drift.on('ready', function(api, payload) {
      var toggleStatus = false;

      $('[drift-toggle]').click(function(e) {
        api.sidebar.toggle();
      });

      $('[drift-start]').click(function(e) {
        api.goToNewConversation();
      });
    });

  });

})(jQuery);
