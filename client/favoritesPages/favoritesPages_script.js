Template.favoritesPages.onCreated(function () {
  var template = this;
  template.subscribe('FavoritesPages');
});

Template.favoritesPages.helpers({
  favoritesPages: function () {
    if (Meteor.userId()) {
      return Pages.find({ $or: [{ isPublic: true }, { owners: Meteor.userId() }, { users: Meteor.userId() }], favorites: Meteor.userId() });
    }
  }
});

Template.favoritesPages.events({
  'click .favoritePage': function () {
    Meteor.call('favoritePage', this._id);
  }
});

Template.favoritesPages.onRendered(function () {
});
