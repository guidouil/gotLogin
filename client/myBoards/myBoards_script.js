Template.myBoards.onCreated(function(){
  Meteor.subscribe('MyBoards');
});

Template.myBoards.helpers({
  boards: function () {
    if (Meteor.userId()) {
      return Boards.find(
        { $or: [{ owners: Meteor.userId() }, { users: Meteor.userId() }] },
        { sort: { updatedAt: -1 } }
      );
    }
  }
});

Template.myBoards.events({
  'click #createBoard': function () {
    Session.set('boardRandomName', Fake.color().capitalizeFirstLetter() + ' ' + Fake.user().surname);
    $('#newBoardModal').modal({
      onApprove: function () {
        var boardName = $('#boardName').val();
        check(boardName, String);
        var board = {};
        board.name = boardName;
        board.segments = [];
        if ($('#defaultBoardTemplate').is(':checked')) {
          var tools = ['github', 'bitbucket', 'slack', 'trello', 'ubugtrack', 'dropbox'];
          board.segments.push({segmentId: Random.id(), name: 'Tools', items: tools, color: 'violet'});
          var items = ['wordpress', 'wpLogin', 'phpMyAdmin', 'googleAnalytics'];
          board.segments.push({segmentId: Random.id(), name: 'Development environment', items: items, color: 'red'});
          board.segments.push({segmentId: Random.id(), name: 'Testing environment', items: items, color: 'orange'});
          board.segments.push({segmentId: Random.id(), name: 'Production environment', items: items, color: 'green'});
        }
        var boardId = Boards.insert(board);
        Session.set('editing', true);
        Router.go('board', {boardId: boardId, name: board.name.replace(/\s+/g, '-').toLowerCase()});
      },
      onHidden: function () {
        Session.delete('boardRandomName');
      }
    });
    $('#newBoardModal').modal('show');
  },
  'click .boardHandle': function () {
    Router.go('board', {boardId: this._id, name: this.name.replace(/\s+/g, '-').toLowerCase()});
  }
});

Template.myBoards.onRendered(function () {
  $('#createBoard').popup();
});

Template.myBoards.onDestroyed(function () {
  $('#createBoard').popup('hide all');
});
