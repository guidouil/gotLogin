Template.myItems.onCreated(function(){
  Meteor.subscribe('MyItems');
});

Template.myItems.helpers({
  myItems: function () {
    if (Meteor.userId()) {
      return Items.find( { owners: Meteor.userId() }, { sort: { clicks: -1 } } );
    }
  }
});

Template.myItems.events({
  'click .editMyItem': function () {
    if (Session.get('editing')) {
      Session.set('editing', false);
    } else {
      Session.set('editing', true);
    }
  }
});
