Template.editItem.onRendered(function () {
  Tracker.autorun(function () {
    if (Session.get('currentItem')) {
      $('#itemIcon').dropdown('set selected', Session.get('currentItem').icon);
      $('#itemColor').dropdown('set selected', Session.get('currentItem').color);
    } else {
      $('select').dropdown();
    }
    $('.itemButtonPreview').popup();
  });
});

Template.editItem.helpers({
  item: function () {
    return Session.get('currentItem');
  },
  iconClass: function (icon) {
    if (icon && icon !== 'noIcon') {
      return 'icon';
    }
  },
  isIcon: function (icon) {
    if (icon && icon !== 'noIcon') {
      return true;
    }
    return false;
  },
  isItemOwner: function () {
    var item = Session.get('currentItem');
    if (Meteor.userId() && item && _.contains(item.owners, Meteor.userId())) {
      return true;
    }
    return false;
  }
});

Template.editItem.events({
  'click .saveItem': function (evt, tmpl) {
    evt.preventDefault();
    var item = Session.get('currentItem');
    var itemName = tmpl.find('#itemName').value;
    var itemUrl = tmpl.find('#itemUrl').value;
    var itemIcon = tmpl.find('#itemIcon').value;
    var itemColor = tmpl.find('#itemColor').value;
    var itemDescription = tmpl.find('#itemDescription').value;
    var itemIsPublic = $('#itemIsPublicBox').is(':checked');
    check(itemName, String);
    check(itemUrl, String);
    check(itemIcon, String);
    check(itemColor, String);
    check(itemDescription, String);
    check(itemIsPublic, Boolean);
    var itemUpdate = {};
    itemUpdate.name = itemName;
    itemUpdate.url = itemUrl;
    if (itemIcon === 'noIcon') {
      itemIcon = '';
    }
    itemUpdate.icon = itemIcon;
    if (itemColor === 'noColor') {
      itemColor = '';
    }
    itemUpdate.color = itemColor;
    itemUpdate.description = itemDescription;
    itemUpdate.isPublic = itemIsPublic;

    if (Meteor.userId() && item && item._id && _.contains(item.owners, Meteor.userId())) {
      Items.update({ _id: item._id }, {$set: itemUpdate});

    } else if (Meteor.userId()) {
      if (item._id) {
        itemUpdate.source = item._id;
      }
      itemUpdate.owners = [Meteor.userId()];
      var newItemId = Items.insert(itemUpdate);
      var pageId = Router.current().params.pageId;
      var page = Pages.findOne({ _id: pageId, owners: Meteor.userId() });
      var currentSegmentId = Session.get('currentSegmentId');
      if (page && currentSegmentId) {
        _.some(page.segments, function (segment) {
          if (segment.segmentId === currentSegmentId) {
            if (item._id) {
              var indexOfItem = segment.items.indexOf(item._id);
              if (indexOfItem > -1) {
                var indexOfSegment = page.segments.indexOf(segment);
                if (indexOfSegment > -1) {
                  segment.items[indexOfItem] = newItemId;
                  page.segments[indexOfSegment] = segment;
                  Pages.update({ _id: pageId }, {$set:{
                    segments: page.segments
                  }});
                }
              }
            } else {
              var indexOfSegment = page.segments.indexOf(segment);
              if (indexOfSegment > -1) {
                segment.items.push(newItemId);
                page.segments[indexOfSegment] = segment;
                Pages.update({ _id: pageId }, {$set:{
                  segments: page.segments
                }});
              }
            }
            return true;
          }
        });
      }
    }

    Session.delete('currentItem');
    $('.ui.right.sidebar').sidebar('hide');
    $('select').dropdown('restore defaults');
  },
  'click .cancelItem': function () {
    Session.delete('currentItem');
    $('.ui.right.sidebar').sidebar('hide');
    $('select').dropdown('restore defaults');
  },
  'input #itemName, input #itemUrl, input #itemDescription': function (evt) {
    var currentItem = Session.get('currentItem') || {};
    if (evt.currentTarget.value) {
      currentItem[evt.currentTarget.name] = evt.currentTarget.value;
    }
    Session.set('currentItem', currentItem);
  },
  'change select': function (evt) {
    var currentItem = Session.get('currentItem') || {};
    if (evt.currentTarget.value) {
      currentItem[evt.currentTarget.name] = evt.currentTarget.value;
    }
    Session.set('currentItem', currentItem);
  },
  'click #itemIsPublic': function (evt) {
    var currentItem = Session.get('currentItem') || {};
    if (currentItem.isPublic) {
      currentItem.isPublic = false;
    } else {
      currentItem.isPublic = true;
    }
    Session.set('currentItem', currentItem);
  }
});
