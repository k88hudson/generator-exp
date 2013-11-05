'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var ExpGenerator = module.exports = function ExpGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
      skipInstall: options['skip-install']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ExpGenerator, yeoman.generators.Base);

ExpGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'expName',
    message: 'What would you like to name your experiment?',
    default: 'my-exp'
  }, {
    type: 'list',
    name: 'templateEngine',
    message: 'Which templating engine do you prefer?',
    choices: [
      "nunjucks",
      "jade",
    ],
    default: "nunjucks"
  }, {
    type: 'confirm',
    name: 'useFontAwesome',
    message: 'Would you like to use Font Awesome?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.expName = props.expName;
    this.useNunjucks = props.templateEngine === 'nunjucks';
    this.useJade = props.templateEngine === 'jade';
    this.useFontAwesome = props.useFontAwesome;

    cb();
  }.bind(this));
};

ExpGenerator.prototype.projectFiles = function projectFiles() {
  this.copy('jshintrc', '.jshintrc');
  this.copy('gitignore', '.gitignore');
  this.copy('Procfile', 'Procfile');
  this.template('_README.md', 'README.md');
};

ExpGenerator.prototype.configFiles = function configFiles() {
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('Gruntfile.js', 'Gruntfile.js');
  this.template('env', '.env');
  this.copy('env', '.env-dist');
};

ExpGenerator.prototype.app = function app() {
  this.mkdir('routes');

  this.template('_app.js', 'app.js');
  this.template('routes/index.js', 'routes/index.js');

};

ExpGenerator.prototype.frontEnd = function frontEnd() {
  this.mkdir('src');
  this.mkdir('dist');
  this.mkdir('public');
  if (this.useNunjucks) {
    this.template('src/index.html', 'src/index.html');
  }
  if (this.useJade) {
    this.template('src/index.jade', 'src/index.jade');
  }
  this.template('src/main.js', 'src/main.js');
  this.template('src/main.less', 'src/main.less');
};
