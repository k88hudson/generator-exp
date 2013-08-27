'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var ExpGenerator = module.exports = function ExpGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ExpGenerator, yeoman.generators.Base);

ExpGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
    {
      type: 'list',
      name: 'cssEngine',
      message: 'Which CSS preprocessor do you like?',
      choices: [
        "less",
        "stylus"
      ],
      default: "less"
    },
    {
      name: 'expName',
      message: 'What would you like to name your experiment?',
      default: 'my-exp'
    },
    {
      type: 'list',
      name: 'templateEngine',
      message: 'Which templating engine?',
      choices: [
        "jade",
        "nunjucks"
      ],
      default: "nunjucks"
    },
    {
      type: 'confirm',
      name: 'useFontAwesome',
      message: 'Would you like to use Font Awesome?',
      default: true
    }
  ];

  this.prompt(prompts, function (props) {
    this.expName = props.expName;
    this.useNunjucks = props.templateEngine === 'nunjucks';
    this.useJade = props.templateEngine === 'jade';
    this.useLess = props.cssEngine === 'less';
    this.useStylus = props.cssEngine === 'stylus';
    this.useFontAwesome = props.useFontAwesome;

    cb();
  }.bind(this));
};

ExpGenerator.prototype.projectFiles = function projectFiles() {
  this.copy('jshintrc', '.jshintrc');
  this.copy('gitignore', '.gitignore');
  this.copy('Procfile', 'Procfile');
};

ExpGenerator.prototype.configFiles = function configFiles() {
  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.copy('env', '.env');
};

ExpGenerator.prototype.app = function app() {
  this.mkdir('views');
  this.mkdir('routes');

  this.template('_app.js', 'app.js');
  this.template('routes/index.js', 'routes/index.js');
};

ExpGenerator.prototype.frontEnd = function frontEnd() {
  this.mkdir('public');
  this.template('public/main.js', 'public/main.js');
  if (this.useLess) {
    this.template('public/main.less', 'public/main.less');
  }
};
