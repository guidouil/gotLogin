Router.configure({
  layoutTemplate: 'main',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  templateNameConverter: 'camelCase',
  routeControllerNameConverter: 'camelCase'
});

Router.route('/', {
  name: 'home',
  title: 'Home'
});

Router.route('/about', {
  name: 'about',
  title: 'About gotLogin'
});

Router.route('/p/:pageId/:name?', {
  name: 'page',
  title: 'Page'
});

Router.route('/profile', {
  name: 'profile',
  title: 'Profile'
});

Router.route('/edit-profile', {
  name: 'editProfile',
  title: 'Edit your profile'
});

Router.plugin('ensureSignedIn', {
  only: ['profile', 'editProfile', 'admin']
});

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
