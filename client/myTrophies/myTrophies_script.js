Template.myTrophies.onCreated(function () {
  var template = this;
  template.subscribe('UsersClicks');
});

Template.myTrophies.helpers({
  myTrophies: function () {
    var userClicks = UsersClicks.findOne({_id: Meteor.userId()});
    if (userClicks && userClicks.clicks) {
      return _.filter(trophies, function (trophy) {
        return trophy.count <= userClicks.clicks;
      });
    }
  },
  nextTrophyCount: function () {
    var userClicks = UsersClicks.findOne({_id: Meteor.userId()});
    if (userClicks && userClicks.clicks) {
      var nextTrophy = _.find(trophies, function (trophy) {
        return trophy.count > userClicks.clicks;
      });
      return nextTrophy.count;
    }
  }
});

Template.myTrophies.events({
});
