## Exp
An express/nunjucks/less/requirejs yeoman generator for quick prototyping.

Ready to deploy to Heroku in minutes!

Uses:

* express
* less
* nunjucks or jade for templating
* requirejs
* jshint
* grunt for precompiling/minification
* Font-Awesome for UI elements (optional)

## Installation

```
npm install -g yo
npm install -g generator-exp
```

## Usage

```
mkdir my-app-name
cd my-app-name
yo exp
```

## Deployment

Use the nodejs-grunt buildpack:
```
heroku create {{your app name}} --buildpack https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt
git push heroku master
```
