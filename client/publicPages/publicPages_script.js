Template.publicPages.onCreated(function(){
  var template = this;
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
  }
});

Template.publicPages.events({
});
