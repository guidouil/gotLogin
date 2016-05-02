Template.topItems.onCreated(function () {
  Meteor.subscribe('PublicItems');
});

Template.topItems.helpers({
  items: function () {
    return Items.find( { }, { sort: { clicks: -1 } } );
  }
});

Template.topItems.events({
});
