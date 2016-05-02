Template.main.onRendered(function () {

});

UI.registerHelper('contactEmail', contactEmail);

UI.registerHelper('fromNow', function (date) {
  if (date !== null) {
    return moment(date).fromNow();
  }
});
