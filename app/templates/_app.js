var express = require('express');
var Habitat = require('habitat');<% if (useLess) { %>
var lessMiddleware = require('less-middleware');<% } %><% if (useStylus) { %>
var stylus = require('stylus');
var nib = require('nib');<% } %><% if (useNunjucks) { %>
var nunjucks = require('nunjucks');<% } %><% if (useJade) { %>
var jade = require('jade');<% } %>
var path = require('path');
var routes = require('./routes');

Habitat.load();

var app = express();
var env = new Habitat();
var optimize = env.get('OPTIMIZE');
<% if (useNunjucks) { %>
var nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.join(__dirname, 'views')), {
  autoescape: true
});<% } %>
var tmpDir = path.join(require('os').tmpDir(), '<%= _.slugify(expName) %>');

app.locals({
  OPTIMIZE: env.get('OPTIMIZE')
});<% if (useNunjucks) { %>
nunjucksEnv.express(app);<% } %>

app.use(express.logger());
app.use(express.compress());
<% if (useLess) { %>
app.use(lessMiddleware({
  once: optimize,
  dest: tmpDir,
  src: __dirname + '/public',
  paths: __dirname,
  compress: optimize,
  yuicompress: optimize,
  optimization: optimize ? 0 : 2
}));<% } %><% if (useStylus) { %>
function stylusCompile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', optimize)
    .use(nib());
}
app.use(stylus.middleware({
  src: path.join(__dirname, '/public'),
  compile: stylusCompile
}));
<% } %>
var cacheSettings = optimize ? { maxAge: '31556952000' } : undefined; // one year;

app.use(express.static(__dirname + '/public', {
  maxAge: '31556952000' // one year
}));

app.use(express.static(tmpDir, cacheSettings));
app.use(express.static(__dirname + '/public', cacheSettings));
app.use('/bower_components', express.static(__dirname + '/bower_components', cacheSettings));
app.use('/views', express.static(__dirname + '/views', cacheSettings));

app.use(app.router);

app.get('/', routes.index);

app.listen(env.get('PORT'), function () {
  console.log('Now listening on http://localhost:%d', env.get('PORT'));
});
