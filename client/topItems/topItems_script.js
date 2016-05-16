Template.topItems.onCreated(function () {
  var template = this;
  template.subscribe('PublicItems');
});

Template.topItems.helpers({
  items: function () {
    return Items.find( { isPublic: true }, { sort: { clicks: -1 } } );
  }
});

Template.topItems.events({
});
