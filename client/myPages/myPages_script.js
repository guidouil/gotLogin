Template.myPages.onCreated(function () {
  var template = this;
  template.subscribe('MyPages');
});

Template.myPages.helpers({
  pages: function () {
    if (Meteor.userId()) {
      return Pages.find(
        { $or: [{ owners: Meteor.userId() }, { users: Meteor.userId() }] },
        { sort: { updatedAt: -1 } }
      );
    }
  },
  favorite: function () {
    if (! _.contains( this.favorites, Meteor.userId())) {
      return 'empty';
    }
  }
});

Template.myPages.events({
  'click #createPage': function () {
    Session.set('pageRandomName', Fake.color().capitalizeFirstLetter() + ' ' + Fake.user().surname);
    $('#newPageModal').modal({
      onApprove: function () {
        var pageName = $('#pageName').val();
        check(pageName, String);
        var page = {};
        page.name = pageName;
        page.segments = [];
        if ($('#defaultPageTemplate').is(':checked')) {
          var tools = ['github', 'bitbucket', 'slack', 'trello', 'ubugtrack', 'dropbox'];
          page.segments.push({segmentId: Random.id(), name: 'Tools', items: tools, color: 'violet'});
          var items = ['wordpress', 'wpLogin', 'phpMyAdmin', 'googleAnalytics'];
          page.segments.push({segmentId: Random.id(), name: 'Development environment', items: items, color: 'red'});
          page.segments.push({segmentId: Random.id(), name: 'Testing environment', items: items, color: 'orange'});
          page.segments.push({segmentId: Random.id(), name: 'Production environment', items: items, color: 'green'});
        }
        var pageId = Pages.insert(page);
        Session.set('editing', true);
        Router.go('page', {pageId: pageId, name: page.name.replace(/\s+/g, '-').toLowerCase()});
      },
      onHidden: function () {
        Session.delete('pageRandomName');
      }
    });
    $('#newPageModal').modal('show');
  },
  'click .pageHandle': function () {
    Router.go('page', {pageId: this._id, name: this.name.replace(/\s+/g, '-').toLowerCase()});
  },
  'click .favoritePage': function () {
    Meteor.call('favoritePage', this._id);
  }
});

Template.myPages.onRendered(function () {
  setTimeout(function () {
    $('#createPage').popup();
  }, 200);
});

Template.myPages.onDestroyed(function () {
  $('#createPage').popup('hide all');
});
