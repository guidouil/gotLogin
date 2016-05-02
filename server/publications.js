Meteor.publish('MyBoards', function () {
  if (this.userId) {
    return Boards.find({ $or: [{ owners: this.userId }, { users: this.userId }] });
  }
});

Meteor.publish('PublicBoards', function () {
  return Boards.find({ isPublic: true });
});

Meteor.publish('Board', function (boardId) {
  check(boardId, String);
  if (this.userId) {
    return Boards.find({ _id: boardId, $or: [{ isPublic: true }, { owners: this.userId }, { users: this.userId }] });
  }
  return Boards.find({ _id: boardId, isPublic: true });
});

Meteor.publish('PublicItems', function () {
  return Items.find({ isPublic: true });
});

Meteor.publish('Item', function (itemId) {
  check(itemId, String);
  return Items.find({ _id: itemId, $or: [{ isPublic: true }, { owners: this.userId }, { users: this.userId }] });
});
