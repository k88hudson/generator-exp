Development
============
```
npm install
grunt
node app // or, grunt nodemon
```

Deployment
===========

Use the nodejs-grunt buildpack:
```
heroku create <%= _.slugify(expName) %> --buildpack https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt
git push heroku master
```
You can always set the buildpack config variable separately:
```
heroku config:add BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git
```
