Meteor.methods({
  favoritePage: function (pageId) {
    var page = Pages.findOne({_id: pageId});
    if (page.isPublic || isPageOwner(pageId, this.userId) || isPageUser(pageId, this.userId)) {
      if (_.contains(page.favorites, this.userId)) {
        Pages.update({ _id: pageId }, { $pull: {
          favorites: this.userId
        }});
      } else {
        Pages.update({ _id: pageId }, { $push: {
          favorites: this.userId
        }});
      }
    }
  }
});
