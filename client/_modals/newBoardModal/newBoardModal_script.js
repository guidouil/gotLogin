Template.newBoardModalContent.onCreated(function(){
  this.defaultBoardTemplate = new ReactiveVar(true);
});

Template.newBoardModalContent.onRendered(function () {
});

Template.newBoardModalContent.helpers({
  defaultBoardName: function () {
    return Session.get('boardRandomName');
  },
  defaultBoardTemplateChecked: function () {
    var template = Template.instance();
    if (template.defaultBoardTemplate.get()) {
      return 'checked';
    }
  },
  defaultBoardTemplateValue: function () {
    var template = Template.instance();
    return template.defaultBoardTemplate.get();
  }
});

Template.newBoardModalContent.events({
  'click #defaultBoardCheckbox': function (evt) {
    evt.preventDefault();
    var template = Template.instance();
    if (template.defaultBoardTemplate.get()) {
      template.defaultBoardTemplate.set(false);
    } else {
      template.defaultBoardTemplate.set(true);
    }
  }
});
