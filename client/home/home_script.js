Template.home.onRendered(function () {
  document.title = 'gotLogin';
});

Template.home.onDestroyed(function () {
  Session.set('editing', false);
});
