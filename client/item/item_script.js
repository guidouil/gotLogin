Template.item.onCreated(function () {
  Meteor.subscribe('Item', this.data.itemId);
});

Template.item.onRendered(function(){
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
  }
});

Template.item.events({
  'click .itemClick': function () {
    Meteor.call('itemClick', this._id);
  },
  'click .editItem': function (evt) {
    Session.set('currentSegmentId', $(evt.currentTarget).data('segment'));
    Session.set('currentItem', this);
    if (! $('.right.sidebar').hasClass('visible')) {
      $('.ui.right.sidebar')
        .sidebar('setting', 'transition', 'scale down')
        .sidebar('toggle');
    }
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
          confirmButtonColor: '#DD6B55',
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
  }
});
