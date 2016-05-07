Template.publicPages.onCreated(function(){
  var template = this
  template.subscribe('PublicPages');
});

Template.publicPages.onRendered(function () {
});

Template.publicPages.helpers({
  pages: function () {
    return Pages.find(
      { isPublic: true },
      { sort: { updatedAt: -1 } }
    );
  },
  favorite: function () {
    if (! _.contains( this.favorites, Meteor.userId())) {
      return 'empty';
    }
  }
});

Template.publicPages.events({
  'click .pageHandle': function () {
    Router.go('page', {pageId: this._id, name: this.name.replace(/\s+/g, '-').toLowerCase()});
  },
  'click .favoritePage': function () {
    Meteor.call('favoritePage', this._id);
  }
});
