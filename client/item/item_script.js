Template.item.onCreated(function () {
  var template = this;
  template.subscribe('Item', this.data.itemId);
});

Template.item.onRendered(function () {
  $('.itemButton').popup();
});

Template.item.helpers({
  isEditing: function () {
    if (Meteor.userId()) {
      return Session.get('editing') || false;
    } else {
      return false;
    }
  },
  item: function () {
    return Items.findOne({_id: this.itemId});
  },
  iconClass: function (icon) {
    if (icon) {
      return 'icon';
    }
  },
  segmentId: function () {
    var template = Template.instance();
    return template.data.segmentId;
  },
  correctUrl: function (url) {
    if (url && url.search('://') === -1) {
      return 'http://' + url;
    }
    return url;
  },
  pageId: function () {
    return Router.current().params.pageId;
  },
  isItemOwner: function () {
    var item = Items.findOne({_id: this._id});
    if (Meteor.userId() && item && _.contains(item.owners, Meteor.userId())) {
      return true;
    }
    return false;
  }
});

Template.item.events({
  'click .itemClick': function () {
    Meteor.call('itemClick', this._id);
  },
  'click .editItem': function (evt) {
    Session.set('currentSegmentId', $(evt.currentTarget).data('segment'));
    Session.set('sideBarData', this);
    Session.set('sideBarTemplate', 'editItem');
    openRightSidebar();
  },
  'click .removeItem': function (evt, tmpl) {
    if (Meteor.userId()) {
      var item = this;
      var currentSegmentId = tmpl.$('.itemButton').data('segment');
      var pageId = Router.current().params.pageId;
      var page = Pages.findOne({ _id: pageId, owners: Meteor.userId() });
      if (page) {
        swal({
          title: 'Drop it?',
          text: 'Remove ' + item.name + ' button from page?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#E03997',
          confirmButtonText: 'Yes, remove it!',
          closeOnConfirm: false
        }, function () {
          _.some(page.segments, function (segment) {
            if (segment.segmentId === currentSegmentId) {
              var indexOfItem = segment.items.indexOf(item._id);
              if (indexOfItem > -1) {
                var indexOfSegment = page.segments.indexOf(segment);
                if (indexOfSegment > -1) {
                  segment.items.splice(indexOfItem, 1);
                  page.segments[indexOfSegment] = segment;
                  Pages.update({ _id: pageId }, {$set:{
                    segments: page.segments
                  }});
                }
              }
              return true;
            }
          });
          swal({
            title: 'Removed!',
            text: 'The ' + item.name + ' button has been removed.',
            timer: 1000,
            type: 'success'
          });
        });
      }
    }
  },
  'click .deleteItem': function (evt) {
    var item = this;
    if (Meteor.userId() && item && _.contains(item.owners, Meteor.userId())) {
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover the ' + item.name + ' button!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#E03997',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: false
      }, function () {
        Items.remove({_id: item._id});
        swal({
          title: 'Deleted!',
          text: 'The ' + item.name + ' button has been deleted.',
          timer: 1000,
          type: 'success'
        });
      });
    }
  }
});
