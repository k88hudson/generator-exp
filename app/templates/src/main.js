requirejs.config({
  baseUrl: '../bower_components',
  paths: {
    main: '../src/main',<% if (useJade) { %>
    jade: 'jade/runtime',<% } else if (useNunjucks) { %>
    nunjucks: 'nunjucks/browser/nunjucks',<% } %>
    templates: '../templates',
    jquery: 'jquery/jquery'
  }
});

require([
  'jquery',
  'templates'<% if (useNunjucks) { %>,
  'nunjucks'<% } %>

], function (
  $,
  templates<% if (useNunjucks) { %>,
  nunjucks<% } %>
){
  var pageJS = $('#requirejs').data('page');

  $('body').css('background', 'red');<% if (useNunjucks) { %>
  console.log(nunjucks.render('src/index.html'));<% } else if (useJade) { %>
  console.log(templates['src/index']());<% } %>

  if (pageJS) {
    require([pageJS]);
  }

});
