Template.newPageModalContent.onCreated(function(){
  this.defaultPageTemplate = new ReactiveVar(true);
});

Template.newPageModalContent.onRendered(function () {
});

Template.newPageModalContent.helpers({
  defaultPageName: function () {
    return Session.get('pageRandomName');
  },
  defaultPageTemplateChecked: function () {
    var template = Template.instance();
    if (template.defaultPageTemplate.get()) {
      return 'checked';
    }
  },
  defaultPageTemplateValue: function () {
    var template = Template.instance();
    return template.defaultPageTemplate.get();
  }
});

Template.newPageModalContent.events({
  'click #defaultPageCheckbox': function (evt) {
    evt.preventDefault();
    var template = Template.instance();
    if (template.defaultPageTemplate.get()) {
      template.defaultPageTemplate.set(false);
    } else {
      template.defaultPageTemplate.set(true);
    }
  }
});
