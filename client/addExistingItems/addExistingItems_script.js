Template.addExistingItems.onCreated(function ( ){
  var template = this;
  if (Meteor.userId()) {
    template.subscribe('myItems');
    template.subscribe('publicItems');
  }
});

Template.addExistingItems.onRendered(function () {
  $('.menu .item').tab();
});

Template.addExistingItems.helpers({
  myItems: function () {
    if (Meteor.userId()) {
      return Items.find( { owners: Meteor.userId() }, { sort: { name: 1 } } );
    }
  },
  publicItems: function () {
    if (Meteor.userId()) {
      return Items.find( { isPublic: true }, { sort: { name: 1 } } );
    }
  }
});

Template.addExistingItems.events({
});

Template.itemToAdd.onCreated(function () {
  var template = this;
  template.subscribe('Item', this.data.itemId);
});

Template.itemToAdd.helpers({
  item: function () {
    return Items.findOne({_id: this.itemId});
  },
  iconClass: function (icon) {
    if (icon) {
      return 'icon';
    }
  },
});

Template.itemToAdd.events({
  'click .addThisItem': function (e, t) {
    var newItemId = this._id;
    var pageId = Router.current().params.pageId;
    var page = Pages.findOne({ _id: pageId, owners: Meteor.userId() });
    var currentSegmentId = Session.get('currentSegmentId');
    if (page && currentSegmentId) {
      _.some(page.segments, function (segment) {
        if (segment.segmentId === currentSegmentId) {
          var indexOfSegment = page.segments.indexOf(segment);
          if (indexOfSegment > -1) {
            segment.items.push(newItemId);
            page.segments[indexOfSegment] = segment;
            Pages.update({ _id: pageId }, {$set:{
              segments: page.segments
            }});
          }
          Session.delete('sideBarData');
          Session.delete('currentSegmentId');
          $('.ui.right.sidebar').sidebar('hide');
          return true;
        }
      });
    }
  }
});
