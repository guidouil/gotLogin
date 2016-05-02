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
    check(itemName, String);
    check(itemUrl, String);
    check(itemIcon, String);
    check(itemColor, String);
    check(itemDescription, String);
    var itemUpdate = {};
    itemUpdate.name= itemName;
    itemUpdate.url= itemUrl;
    if (itemIcon === 'noIcon') {
      itemIcon = '';
    }
    itemUpdate.icon= itemIcon;
    if (itemColor === 'noColor') {
      itemColor = '';
    }
    itemUpdate.color= itemColor;
    itemUpdate.description= itemDescription;
    Items.update({ _id: item._id }, {$set: itemUpdate});
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
  }
});
