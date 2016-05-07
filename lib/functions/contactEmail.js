contactEmail = function (user) {
  if (user.emails && user.emails.length) {
    return user.emails[0].address;
  }
  if (user.services && user.services.facebook && user.services.facebook.email) {
    return user.services.facebook.email;
  }
  if (user.services && user.services.google && user.services.google.email) {
    return user.services.google.email;
  }
  if (user.services && user.services.twitter && user.services.twitter.screenName) {
    return '@' + user.services.twitter.screenName;
  }
  return null;
};

validateEmail = function (email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
};
