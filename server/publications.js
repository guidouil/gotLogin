Meteor.publish('MyPages', function () {
  if (this.userId) {
    return Pages.find({ $or: [{ owners: this.userId }, { users: this.userId }] });
  }
});

Meteor.publish('PublicPages', function () {
  return Pages.find({ isPublic: true });
});

Meteor.publish('Page', function (pageId) {
  check(pageId, String);
  if (this.userId) {
    return Pages.find({ _id: pageId, $or: [{ isPublic: true }, { owners: this.userId }, { users: this.userId }] });
  }
  return Pages.find({ _id: pageId, isPublic: true });
});

Meteor.publish('MyItems', function () {
  if (this.userId) {
    return Items.find({ owners: this.userId });
  }
});

Meteor.publish('PublicItems', function () {
  return Items.find({ isPublic: true });
});

Meteor.publish('Item', function (itemId) {
  check(itemId, String);
  return Items.find({ _id: itemId });
});

Meteor.publish('UsersClicks', function () {
  if (this.userId) {
    return UsersClicks.find({ _id: this.userId });
  }
});
