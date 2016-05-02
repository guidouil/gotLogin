Template.board.onCreated(function () {
  Meteor.subscribe('Board', Router.current().params.boardId);
});

Template.board.onRendered(function () {
  setTimeout(function () {
    $('#boardSettings')
    .popup({
      on        : 'click',
      popup     : $('.custom.popup'),
      inline    : true,
      hoverable : true,
      position  : 'bottom left'
    });
    if (Session.get('editing')) {
      $('select').dropdown();
    }
  }, 200);

  Tracker.autorun(function () {
    document.title = Session.get('documentTitle');
  });
});

Template.board.helpers({
  board: function () {
    var board = Boards.findOne({ _id: Router.current().params.boardId });
    if (board) {
      Session.set('documentTitle', board.name);
    }
    return board;
  },
  isEditing: function () {
    return Session.get('editing') || false;
  },
  selectedSegmentColor: function (color) {
    if (this.color === color) {
      return 'selected';
    }
  },
  isBoardOwner: function () {
    if (Meteor.userId()) {
      var board = Boards.findOne({ _id: Router.current().params.boardId });
      if (board && _.contains(board.owners, Meteor.userId())) {
        return true;
      }
    }
    return false;
  }
});

Template.board.events({
  'click #editBoard': function () {
    Session.set('editing', true);
    setTimeout(function () {
      $('select').dropdown();
    }, 200);
  },
  'click #saveBoard': function (evt, tmpl) {
    var boardId = Router.current().params.boardId;
    var board = Boards.findOne({ _id: boardId });
    if (Meteor.userId() && board && _.contains( board.owners, Meteor.userId())) {
      var boardUpdate = {};
      boardUpdate.name = tmpl.find('.boardName').value;
      boardUpdate.description = tmpl.find('.boardDescription').value;
      var segmentsUpdate = [];
      $('.segmentName').each(function () {
        segmentsUpdate.push({
          segmentId: $(this).data('id'),
          name: $(this).val()
        });
      });
      $('.segmentDescription').each(function () {
        if ($(this).val()) {
          var segmentId = $(this).data('id');
          var description = $(this).val();
          _.find( segmentsUpdate, function (segment, index) {
            if (segment.segmentId === segmentId) {
              segmentsUpdate[index].description = description;
            }
          });
        }
      });
      $('.segmentColor').each(function () {
        if ($(this).children().val()) {
          var segmentId = $(this).children().data('id');
          var color = $(this).children().val();
          _.find( segmentsUpdate, function (segment, index) {
            if (segment.segmentId === segmentId) {
              segmentsUpdate[index].color = color;
            }
          });
        }
      });
      _.each( board.segments, function (segment, index) {
        _.find( segmentsUpdate, function (segmentUpdate, index) {
          if (segment.segmentId === segmentUpdate.segmentId) {
            segmentsUpdate[index].items = segment.items;
          }
        });
      });
      boardUpdate.segments = segmentsUpdate;
      Boards.update({ _id: boardId }, { $set: boardUpdate });
    }
    Session.set('editing', false);
    setTimeout(function () {
      $('.itemButton').popup();
    }, 100);
  },
  'click #deleteBoard': function () {
    var board = Boards.findOne({ _id: Router.current().params.boardId });
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover the ' + board.name + ' board!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false
    }, function () {
      Boards.remove({_id: board._id});
      swal({
        title: 'Deleted!',
        text: 'The ' + board.name + ' board has been deleted.',
        timer: 1000,
        type: 'success'
      });
      Router.go('/');
    });
  },
  'click .addItem': function (evt) {
    Session.set('currentSegment', $(evt.currentTarget).data('segment'));
    Session.set('currentItem', true);
    if (! $('.right.sidebar').hasClass('visible')) {
      $('.ui.right.sidebar')
        .sidebar('setting', 'transition', 'scale down')
        .sidebar('toggle');
    }
  },
  'click #addSegment': function () {
    var emptySegment = {};
    emptySegment.segmentId = Random.id();
    Boards.update({ _id: Router.current().params.boardId }, { $push: { segments: emptySegment } });
  }
});

Template.board.onDestroyed(function () {
  Session.set('editing', false);
});
