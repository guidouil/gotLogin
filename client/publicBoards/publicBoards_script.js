Template.publicBoards.onCreated(function(){
  Meteor.subscribe('PublicBoards');
});

Template.publicBoards.onRendered(function () {
});

Template.publicBoards.helpers({
  boards: function () {
    return Boards.find(
      { isPublic: true },
      { sort: { updatedAt: -1 } }
    );
  }
});

Template.publicBoards.events({
});
