openRightSidebar = function () {
  setTimeout(function () {
    if (Session.get('sideBarTemplate')) {
      if (! $('.right.sidebar').hasClass('visible')) {
        $('.ui.right.sidebar')
          .sidebar('setting', 'transition', 'overlay')
          .sidebar('toggle');
      }
    }
  }, 100);
};
