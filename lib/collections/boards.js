Boards = new Mongo.Collection('boards');

Boards.allow({
  insert: function (userId, doc) {
    return userId && _.contains(doc.owners, userId);
  },
  update: function (userId, doc) {
    return userId && _.contains(doc.owners, userId);
  },
  remove: function (userId, doc) {
    return userId && _.contains(doc.owners, userId);
  },
  fetch: ['owners']
});

var SegmentSchema = new SimpleSchema({
  segmentId: {
    type: SimpleSchema.RegEx.Id,
    autoform: {
      omit: true
    }
  },
  name: {
    type: String,
    label: 'Segment name',
    optional: true,
    autoform: {
      omit: true
    }
  },
  color: {
    type: String,
    label: 'Segment color',
    optional: true,
    autoform: {
      omit: true
    }
  },
  description: {
    type: String,
    label: 'Segment description',
    optional: true,
    autoform: {
      rows: 3
    }
  },
  order: {
    type: Number,
    label: 'Segment order',
    optional: true,
    autoform: {
      omit: true
    }
  },
  items: {
    type: [SimpleSchema.RegEx.Id],
    label: 'Buttons',
    optional: true,
    autoform: {
      omit: true
    }
  },
});

var BoardsSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name'
  },
  description: {
    type: String,
    label: 'Description',
    optional: true,
    autoform: {
      rows: 3
    }
  },
  isPublic: {
    type: Boolean,
    label: 'Public board',
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        return false;
      }
    }
  },
  owners: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    },
    autoValue: function () { if (this.isInsert) { return [this.userId]; }}
  },
  users: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }
  },
  segments: {
    type: [SegmentSchema],
    label: 'Segments',
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
      if (this.isInsert || this.isUpdate) {
        return new Date();
      }
    },
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Boards.attachSchema(BoardsSchema);
