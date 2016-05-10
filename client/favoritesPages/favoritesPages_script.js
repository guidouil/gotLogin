Template.favoritesPages.onCreated(function () {
  var template = this;
  template.subscribe('FavoritesPages');
});

Template.favoritesPages.helpers({
  favoritesPages: function () {
    if (Meteor.userId()) {
      return Pages.find(
        { $or: [{ isPublic: true }, { owners: Meteor.userId() }, { users: Meteor.userId() }], favorites: Meteor.userId() },
        { sort: { updatedAt: -1 } }
      );
    }
  }
});

Template.favoritesPages.events({
});

Template.favoritesPages.onRendered(function () {
});
