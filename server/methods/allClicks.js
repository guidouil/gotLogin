Meteor.methods({
  allClicks: function () {
    var pipeline = [
      {$group: {_id: null, clicks: {$sum: '$clicks'}}}
    ];
    return Items.aggregate(pipeline);
  }
});
