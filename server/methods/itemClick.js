Meteor.methods({
  itemClick: function (itemId) {
    check(itemId, String);
    Items.update({ _id: itemId }, { $inc: { clicks: 1 } });
  }
});
