module.exports = function(){
  return {
    index: function(req, res) {
      res.render('index<% if (useNunjucks) { %>.html<% } %>');
    }
  };
};
