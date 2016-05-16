Template.myClicks.helpers({
  myClicks: function () {
    if (Meteor.userId()) {
      var userClicks = UsersClicks.findOne({_id: Meteor.userId()});
      if (userClicks) {
        return userClicks.clicks;
      }
    }
    return 0;
  },
  currentTrophy: function () {
    if (Meteor.userId()) {
      var userClicks = UsersClicks.findOne({_id: Meteor.userId()});
      if (userClicks) {
        var currentTrophy = '';
        _.find(trophies, function (trophy, index) {
          currentTrophy = trophies[index-1];
          return userClicks.clicks < trophy.count;
        });
        return currentTrophy;
      }
    }
  }
});

Template.myClicks.events({
  'click .currentTrophy': function () {
    Session.delete('sideBarData');
    Session.set('sideBarTemplate', 'myTrophies');
    openRightSidebar();
  }
});

Template.myClicks.onCreated(function () {
  var template = this;
  template.subscribe('UsersClicks');
});
