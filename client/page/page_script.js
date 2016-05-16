Template.page.onCreated(function () {
  var template = this;
  template.subscribe('Page', Router.current().params.pageId);
});

Template.page.onRendered(function () {
  setTimeout(function () {
    $('#pageSettings')
    .popup({
      popup     : $('.custom.popup'),
      inline    : true,
      hoverable : true,
      position  : 'bottom left'
    });
    if (Session.get('editing')) {
      $('select').dropdown();
      $('.itemsList').each(function () {
        Sortable.create(document.getElementById(this.id), {
          onSort: function (event) {
            setSegmentItemsOrder(event);
          }
        });
      });
      Sortable.create(document.getElementById('pageSegments'), {
        draggable: 'pageSegment'
      });
    }
  }, 400);

  Tracker.autorun(function () {
    document.title = Session.get('documentTitle');
  });
});

Template.page.helpers({
  page: function () {
    var page = Pages.findOne({ _id: Router.current().params.pageId });
    if (page) {
      Session.set('documentTitle', page.name);
    }
    return page;
  },
  isEditing: function () {
    return Session.get('editing') || false;
  },
  selectedSegmentColor: function (color) {
    if (this.color === color) {
      return 'selected';
    }
  },
  favorite: function () {
    if (! Meteor.userId() || ! _.contains( this.favorites, Meteor.userId())) {
      return 'empty';
    }
  }
});

Template.page.events({
  'click #editPage': function () {
    Session.set('editing', true);
    setTimeout(function () {
      $('select').dropdown();
      $('.itemsList').each(function () {
        Sortable.create(document.getElementById(this.id), {
          onSort: function (event) {
            setSegmentItemsOrder(event);
          }
        });
      });
    }, 400);
  },
  'click #pageIsPublic': function () {
    var pageId = Router.current().params.pageId;
    var page = Pages.findOne({ _id: pageId });
    if (page.isPublic) {
      Pages.update({ _id: pageId }, {$set:{
        isPublic: false
      }});
    } else {
      Pages.update({ _id: pageId }, {$set:{
        isPublic: true
      }});
    }
  },
  'click #savePage': function (evt, tmpl) {
    var pageId = Router.current().params.pageId;
    var page = Pages.findOne({ _id: pageId });
    if (Meteor.userId() && page && _.contains( page.owners, Meteor.userId())) {
      var pageUpdate = {};
      pageUpdate.name = tmpl.find('.pageName').value;
      pageUpdate.description = tmpl.find('.pageDescription').value;
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
      _.each( page.segments, function (segment, index) {
        _.find( segmentsUpdate, function (segmentUpdate, index) {
          if (segment.segmentId === segmentUpdate.segmentId) {
            segmentsUpdate[index].items = segment.items;
          }
        });
      });
      pageUpdate.segments = segmentsUpdate;
      Pages.update({ _id: pageId }, { $set: pageUpdate });
    }
    Session.set('editing', false);
    setTimeout(function () {
      $('.itemButton').popup();
      $('#pageSettings')
      .popup({
        popup     : $('.custom.popup'),
        inline    : true,
        hoverable : true,
        position  : 'bottom left'
      });
    }, 100);
  },
  'click #deletePage': function () {
    var page = Pages.findOne({ _id: Router.current().params.pageId });
    if (Meteor.userId() && page && _.contains(page.owners, Meteor.userId())) {
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover the ' + page.name + ' page!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: false
      }, function () {
        Pages.remove({_id: page._id});
        swal({
          title: 'Deleted!',
          text: 'The ' + page.name + ' page has been deleted.',
          timer: 1000,
          type: 'success'
        });
        Router.go('/');
      });
    }
  },
  'click .addItem': function (evt) {
    Session.set('currentSegmentId', $(evt.currentTarget).data('segment'));
    Session.delete('sideBarData');
    Session.set('sideBarTemplate', 'editItem');
    openRightSidebar();
  },
  'click #addSegment': function () {
    var emptySegment = {};
    emptySegment.segmentId = Random.id();
    Pages.update({ _id: Router.current().params.pageId }, { $push: { segments: emptySegment } });
  },
  'click #ownersAndUsers': function () {
    Session.set('sideBarData', this);
    Session.set('sideBarTemplate', 'ownersAndUsers');
    openRightSidebar();
  },
  'click #forkPage': function () {
    var page = this;
    delete page._id;
    delete page.owners;
    delete page.users;
    delete page.favorites;
    delete page.createdAt;
    delete page.updatedAt;
    page.isPublic = false;
    Pages.insert(page);
    Router.go('home');
  },
  'click .favoriteOnPage': function () {
    if (Meteor.userId()) {
      Meteor.call('favoritePage', this._id);
    }
  }
});

Template.page.onDestroyed(function () {
  Session.set('editing', false);
});

var setSegmentItemsOrder = function (event) {
  if (Meteor.userId()) {
    var orderedItems = [];
    $('#'+event.from.id).find('.item').each(function () {
      orderedItems.push(this.id);
    });
    var pageId = Router.current().params.pageId;
    var page = Pages.findOne({ _id: pageId, owners: Meteor.userId() });
    var currentSegmentId = event.from.id;
    if (page && currentSegmentId && orderedItems.length >= 1) {
      _.some(page.segments, function (segment) {
        if (segment.segmentId === currentSegmentId) {
          var indexOfSegment = page.segments.indexOf(segment);
          if (indexOfSegment > -1) {
            segment.items = orderedItems;
            page.segments[indexOfSegment] = segment;
            Pages.update({ _id: pageId }, {$set:{
              segments: page.segments
            }});
          }
        }
      });
    }
  }
};
