Meteor.startup(function () {
  AutoForm.setDefaultTemplate('semanticUI');
});

Template.main.onRendered(function () {

});

UI.registerHelper('contactEmail', contactEmail);

UI.registerHelper('fromNow', function (date) {
  if (date !== null) {
    return moment(date).fromNow();
  }
});

UI.registerHelper('plural', function (number) {
  if (number > 1) {
    return 's';
  }
});

UI.registerHelper('isPageOwner', function () {
  if (Meteor.userId()) {
    return isPageOwner(Router.current().params.pageId, Meteor.userId());
  }
  return false;
});
