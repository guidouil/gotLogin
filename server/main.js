import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  if (Items.find().count() === 0) {
    Items.insert({_id: 'github', name: 'GitHub', url: 'https://github.com', icon: 'github', color: 'brown', clicks: 0, isPublic: true, owners: ['nobody']});
    Items.insert({_id: 'bitbucket', name: 'Bitbucket', url: 'https://bitbucket.org', icon: 'bitbucket', color: 'blue', clicks: 0, isPublic: true, owners: ['nobody']});
    Items.insert({_id: 'slack', name: 'Slack', url: 'https://slack.com', icon: 'slack', color: 'green', clicks: 0, isPublic: true, owners: ['nobody']});
    Items.insert({_id: 'trello', name: 'Trello', url: 'https://trello.com', icon: 'trello', color: '', clicks: 0, isPublic: true, owners: ['nobody']});
    Items.insert({_id: 'ubugtrack', name: 'uBugTrack', url: 'https://ubugtrack.com', icon: 'bug', color: 'black', clicks: 0, isPublic: true, owners: ['nobody']});
    Items.insert({_id: 'wikipedia', name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Random', icon: 'help', color: 'olive', clicks: 0, isPublic: true, owners: ['nobody']});
    Items.insert({_id: 'dropbox', name: 'Dropbox', url: 'https://www.dropbox.com', icon: 'dropbox', color: 'blue', clicks: 0, isPublic: true, owners: ['nobody']});
    Items.insert({_id: 'wordpress', name: 'WordPress', url: 'https://wordpress.org', icon: 'browser', color: 'green', clicks: 0, isPublic: true, owners: ['nobody']});
    Items.insert({_id: 'wpLogin', name: 'WP Admin', url: 'https://wordpress.com/wp-login.php', icon: 'dashboard', color: 'orange', clicks: 0, isPublic: true, owners: ['nobody']});
    Items.insert({_id: 'phpMyAdmin', name: 'phpMyAdmin', url: 'https://www.phpmyadmin.net', icon: 'database', color: 'red', clicks: 0, isPublic: true, owners: ['nobody']});
    Items.insert({_id: 'googleAnalytics', name: 'Google Analytics', url: 'https://www.google.com/analytics', icon: 'line chart', color: 'teal', clicks: 0, isPublic: true, owners: ['nobody']});
  }
});
