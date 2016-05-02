Template.sidebar.onRendered(function () {
  
});

Template.sidebar.helpers({
  item: function () {
    return Session.get('currentItem');
  }
});

Template.sidebar.events({
  'click a.item': function () {
    $('.ui.labeled.icon.sidebar').sidebar('toggle');
  }
});
