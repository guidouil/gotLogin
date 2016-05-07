Template.ownersAndUsers.helpers({
  owners: function () {
    return Session.get('owners');
  },
  users: function () {
    return Session.get('users');
  },
  page: function () {
    return Pages.findOne({_id: Router.current().params.pageId});
  }
});

Template.ownersAndUsers.events({
  'click #removeOwner': function () {
    if (this.userId === Meteor.userId()) {
      swal('Nope !', 'You can not remove yourself.', 'error');
      return false;
    } else {
      var pageId = Router.current().params.pageId;
      Meteor.call('removeOwnership', this.userId, pageId, function (error, result) {
        if (error) {
          console.log(error);
        }
        if (result === true) {
          Meteor.call('getPageOwnersAndUsers', pageId, function (err, result) {
            if (result.owners) {
              Session.set('owners', result.owners);
            }
          });
        }
      });
    }
  },
  'keypress #ownerMail': function (evt) {
    $('#ownerMail').parent().removeClass('error');
    if (evt.which === 13) {
      giveOrwnership(this._id);
    }
  },
  'click #searchOwner': function () {
    $('#ownerMail').parent().removeClass('error');
    giveOrwnership(this._id);
  },
  'click #removeUser': function () {
    var pageId = Router.current().params.pageId;
    Meteor.call('removeUser', this.userId, pageId, function (error, result) {
      if (error) {
        console.log(error);
      }
      if (result === true) {
        Meteor.call('getPageOwnersAndUsers', pageId, function (err, result) {
          if (result.users) {
            Session.set('users', result.users);
          }
        });
      }
    });
  },
  'keypress #userMail': function (evt) {
    $('#userMail').parent().removeClass('error');
    if (evt.which === 13) {
      addUser(this._id);
    }
  },
  'click #searchUser': function () {
    $('#userMail').parent().removeClass('error');
    addUser(this._id);
  }
});

Template.ownersAndUsers.onRendered(function () {
});

Template.ownersAndUsers.onCreated(function () {
  var template = this;
  template.subscribe('Page', Router.current().params.pageId);
  Meteor.call('getPageOwnersAndUsers', Router.current().params.pageId, function (err, result) {
    if (result.owners) {
      Session.set('owners', result.owners);
    }
    if (result.users) {
      Session.set('users', result.users);
    }
  });
});

var giveOrwnership = function (pageId) {
  var email = $('#ownerMail').val();
  if (validateEmail(email)) {
    Meteor.call('giveOrwnership', email, pageId, function (error, result){
      if (error) {
        console.log('error', error);
      }
      if (result === false) {
        swal('Who?', 'Nobody in our database has this email address.', 'error');
      }
      if (result === true) {
        Meteor.call('getPageOwnersAndUsers', pageId, function (err, result) {
          if (result.owners) {
            Session.set('owners', result.owners);
          }
        });
        swal('Great', 'This user now administrate the page as you do.', 'success');
        $('#ownerMail').val('');
      }
    });
  } else {
    $('#ownerMail').parent().addClass('error');
  }
};

var addUser = function (pageId) {
  var email = $('#userMail').val();
  if (validateEmail(email)) {
    Meteor.call('addUser', email, pageId, function (error, result){
      if (error) {
        console.log('error', error);
      }
      if (result === false) {
        swal('Who?', 'Nobody in our database has this email address.', 'error');
      }
      if (result === true) {
        Meteor.call('getPageOwnersAndUsers', pageId, function (err, result) {
          if (result.users) {
            Session.set('users', result.users);
          }
        });
        swal('Awesome', 'The user can access this private page.', 'success');
        $('#userMail').val('');
      }
    });
  } else {
    $('#userMail').parent().addClass('error');
  }
};
