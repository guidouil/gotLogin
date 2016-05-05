Meteor.methods({
  itemClick: function (itemId) {
    check(itemId, String);
    Items.update({ _id: itemId }, { $inc: { clicks: 1 } });
    if (this.userId) {
      UsersClicks.upsert( {_id: this.userId }, { $inc: { clicks: 1 } });
    }
  }
});
