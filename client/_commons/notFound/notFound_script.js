Template.notFound.helpers({
  originalUrl: function () {
    return Router.current().originalUrl;
  }
});

Template.notFound.events({
  'click #comeBack': function () {
    Router.go('/');
  }
});

Template.notFound.onRendered(function () {
});
