Template.publicPages.onCreated(function(){
  Meteor.subscribe('PublicPages');
});

Template.publicPages.onRendered(function () {
});

Template.publicPages.helpers({
  pages: function () {
    return Pages.find(
      { isPublic: true },
      { sort: { updatedAt: -1 } }
    );
  }
});

Template.publicPages.events({
  'click .pageHandle': function () {
    Router.go('page', {pageId: this._id, name: this.name.replace(/\s+/g, '-').toLowerCase()});
  }
});
