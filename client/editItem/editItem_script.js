Template.editItem.onRendered(function () {
  Tracker.autorun(function () {
    $('.itemButtonPreview').popup();
  });
});

Template.editItem.onDestroyed(function () {
  Session.delete('sideBarData');
  Session.delete('sideBarTemplate');
});

Template.editItem.helpers({
  item: function () {
    return Session.get('sideBarData');
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
    var item = Session.get('sideBarData');
    if (Meteor.userId() && item && _.contains(item.owners, Meteor.userId())) {
      return true;
    }
    return false;
  }
});

var validateUrl = function (value) {
  return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
};

Template.editItem.events({
  'click .saveItem': function (evt, tmpl) {
    evt.preventDefault();
    var item = Session.get('sideBarData');
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
    if (! validateUrl(itemUrl)) {
      $('#itemUrl').parent().addClass('error');
      return false;
    }
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

    Session.delete('sideBarData');
    Session.delete('sideBarTemplate');
    $('.ui.right.sidebar').sidebar('hide');
    $('select').dropdown('restore defaults');
  },
  'click .cancelItem': function () {
    Session.delete('sideBarData');
    Session.delete('sideBarTemplate');
    $('.ui.right.sidebar').sidebar('hide');
    $('select').dropdown('restore defaults');
  },
  'input #itemName, input #itemUrl, input #itemDescription': function (evt) {
    var currentItem = Session.get('sideBarData') || {};
    if (evt.currentTarget.value) {
      currentItem[evt.currentTarget.name] = evt.currentTarget.value;
    }
    Session.set('sideBarData', currentItem);
  },
  'change #itemIcon, change #itemColor': function (evt) {
    var currentItem = Session.get('sideBarData') || {};
    if (evt.currentTarget.value) {
      currentItem[evt.currentTarget.name] = evt.currentTarget.value;
    }
    Session.set('sideBarData', currentItem);
  },
  'click #itemIsPublic': function (evt) {
    var currentItem = Session.get('sideBarData') || {};
    if (currentItem.isPublic) {
      currentItem.isPublic = false;
    } else {
      currentItem.isPublic = true;
    }
    Session.set('sideBarData', currentItem);
  }
});
