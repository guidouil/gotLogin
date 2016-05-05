UsersClicks = new Mongo.Collection('usersclicks');

UsersClicks.allow({
  insert: function (userId, doc) {
    return userId && _.contains(doc._id, userId);
  },
  update: function (userId, doc) {
    return userId && _.contains(doc._id, userId);
  },
  remove: function (userId, doc) {
    return false;
  },
  fetch: ['_id']
});

var UsersClicksSchema = new SimpleSchema({
  clicks: {
    type: Number,
    label: 'Clicks counter',
    optional: true,
    autoform: {
      omit: true
    }
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    },
    autoform: {
      omit: true
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

UsersClicks.attachSchema(UsersClicksSchema);
