Template.item.onCreated(function () {
  Meteor.subscribe('Item', this.data.itemId);
});

Template.item.onRendered(function(){
  $('.itemButton').popup();
});

Template.item.helpers({
  isEditing: function () {
    return Session.get('editing') || false;
  },
  item: function () {
    return Items.findOne({_id: this.itemId});
  },
  iconClass: function (icon) {
    if (icon) {
      return 'icon';
    }
  },
  segmentId: function () {
    var template = Template.instance();
    return template.data.segmentId;
  }
});

Template.item.events({
  'click .itemClick': function () {
    Meteor.call('itemClick', this._id);
  },
  'click .editItem': function (evt) {
    console.log(this);
    Session.set('currentSegment', $(evt.currentTarget).data('segment'));
    Session.set('currentItem', this);
    if (! $('.right.sidebar').hasClass('visible')) {
      $('.ui.right.sidebar')
        .sidebar('setting', 'transition', 'scale down')
        .sidebar('toggle');
    }
  },
  'click .removeItem': function (evt, tmpl) {
    var item = this;
    console.log(item);
    var segmentId = tmpl.$('.itemButton').data('segment');
    console.log(segmentId);
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover ' + item.name + ' button!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false
    }, function () {
      Boards.update(
        { _id: Router.current().params.boardId, 'segments.segmentId': segmentId },
        { $pull: { 'segments.$.items': item } }
      );
      swal('Deleted!', 'The ' + item.name + ' button has been deleted.', 'success');
    });
  }
});
