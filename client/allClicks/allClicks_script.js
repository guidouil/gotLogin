Template.allClicks.onCreated(function () {
  Meteor.call('allClicks', function(error, result){
    if(result){
      Session.set('allClicks', result[0].clicks);
    }
  });
});

Template.allClicks.onRendered(function () {
});

Template.allClicks.helpers({
  allClicks: function () {
    return Session.get('allClicks') || 0;
  }
});

Template.allClicks.events({
});
