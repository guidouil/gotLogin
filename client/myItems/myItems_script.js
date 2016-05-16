Template.myItems.onCreated(function () {
  var template = this;
  template.subscribe('MyItems');
});

Template.myItems.onRendered(function () {
  setTimeout(function () {
    $('.createItem').popup();
  }, 200);
});

Template.myItems.helpers({
  myItems: function () {
    if (Meteor.userId()) {
      return Items.find( { owners: Meteor.userId() }, { sort: { clicks: -1 } } );
    }
  },
  isEditing: function () {
    if (Meteor.userId()) {
      return Session.get('editing') || false;
    } else {
      return false;
    }
  },
});

Template.myItems.events({
  'click .editMyItem': function () {
    if (Session.get('editing')) {
      Session.set('editing', false);
    } else {
      Session.set('editing', true);
    }
  },
  'click .createItem': function () {
    Session.set('sideBarTemplate', 'editItem');
    Session.delete('sideBarData');
    Session.delete('currentSegmentId');
    openRightSidebar();
  }
});
