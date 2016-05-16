isPageOwner = function (pageId, userId) {
  check(pageId, String);
  check(userId, String);
  // check if given userId is one of the page owners
  var page = Pages.findOne({_id: pageId});
  if (page && page.owners && page.owners.length >= 1) {
    if (_.contains(page.owners, userId)) {
      return true;
    }
  }
  return false;
};

isPageUser = function (pageId, userId) {
  check(pageId, String);
  check(userId, String);
  // check if given userId is one of the page users
  var page = Pages.findOne({_id: pageId});
  if (page && page.sellers && page.sellers.length >= 1) {
    if (_.contains(page.sellers, userId)) {
      return true;
    }
  }
  return false;
};
