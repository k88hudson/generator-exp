var express = require('express');
var Habitat = require('habitat');<% if (useNunjucks) { %>
var nunjucks = require('nunjucks');<% } %>
var routes = require('./routes')();

Habitat.load();

var app = express();
var env = new Habitat();
var optimize = env.get('OPTIMIZE');
<% if (useNunjucks) { %>
var nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname + '/src'), {
  autoescape: true
});<% } %>
var cacheSettings = optimize ? { maxAge: '31556952000' } : undefined; // one year;

app.locals({
  OPTIMIZE: env.get('OPTIMIZE')
});
<% if (useNunjucks) { %>
nunjucksEnv.express(app);<% } %>
<% if (useJade) { %>
app.set('view engine', 'jade');
app.set('views', __dirname + '/src');<% } %>
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.static(__dirname + '/dist', cacheSettings));
app.use(express.static(__dirname + '/public', cacheSettings));
app.use('/bower_components', express.static(__dirname + '/bower_components', cacheSettings));

app.use(app.router);

app.get('/', routes.index);

app.listen(env.get('PORT'), function () {
  console.log('Now listening on http://localhost:%d', env.get('PORT'));
});
