Meteor.methods({
  getPageOwnersAndUsers: function (pageId) {
    if (this.userId) {
      check(pageId, String);
      if (isPageOwner(pageId, this.userId)) {
        var page = Pages.findOne({_id: pageId});
        var owners = [];
        _.each(page.owners, function (ownerId) {
          var owner = Meteor.users.findOne({_id: ownerId});
          owners.push({
            userId: ownerId,
            email: contactEmail(owner)
          });
        });
        var users = [];
        if (page.users) {
          _.each(page.users, function (userId) {
            var user = Meteor.users.findOne({_id: userId});
            users.push({
              userId: userId,
              email: contactEmail(user)
            });
          });
        }
        return {'owners': owners, 'users': users};
      }
    }
    return false;
  },
  giveOrwnership: function (email, pageId) {
    if (this.userId) {
      check(email, String);
      check(pageId, String);
      if (isPageOwner(pageId, this.userId)) {
        var owner = Meteor.users.findOne({$or:[
          { 'emails.address': email },
          { 'user.services.facebook.email': email },
          { 'user.services.google.email': email }
        ]});
        if (owner) {
          Pages.update({_id: pageId}, {$addToSet: {
            owners: owner._id
          }});
          return true;
        }
      }
      return false;
    }
  },
  removeOwnership: function (ownerId, pageId) {
    if (this.userId) {
      check(ownerId, String);
      check(pageId, String);
      if (isPageOwner(pageId, this.userId)) {
        Pages.update({_id: pageId}, {$pull: {
          owners: ownerId
        }});
        return true;
      }
    }
    return false;
  },
  addUser: function (email, pageId) {
    if (this.userId) {
      check(email, String);
      check(pageId, String);
      if (isPageOwner(pageId, this.userId)) {
        var user = Meteor.users.findOne({$or:[
          { 'emails.address': email },
          { 'user.services.facebook.email': email },
          { 'user.services.google.email': email }
        ]});
        if (user) {
          Pages.update({_id: pageId}, {$addToSet: {
            users: user._id
          }});
          return true;
        }
      }
      return false;
    }
  },
  removeUser: function (userId, pageId) {
    if (this.userId) {
      check(userId, String);
      check(pageId, String);
      if (isPageOwner(pageId, this.userId)) {
        Pages.update({_id: pageId}, {$pull: {
          users: userId
        }});
        return true;
      }
      return false;
    }
  }
});
