Template.sidebar.onRendered(function () {

});

Template.sidebar.helpers({
  sideBarTemplate: function () {
    return Session.get('sideBarTemplate');
  },
  sideBarData: function () {
    return Session.get('sideBarData');
  }
});

Template.sidebar.events({
  'click a.item': function () {
    $('.ui.labeled.icon.sidebar').sidebar('toggle');
  }
});
