var DTO = DTO || {};

DTO.Forms = (function(window, undefined) {
  var extractHttpGetParams = function() {
    var match,
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) {
        return decodeURIComponent(s.replace( /\+/g, " "));
      },
      query = window.location.search.substring(1);
    var urlParams = {};
    while (match = search.exec(query)) {
      var key = decode(match[1]);
      if(key in urlParams) {
        var val = '' + urlParams[key] + ', ' + decode(match[2]);
        urlParams[key] = val;
      }
      else {
        urlParams[key] = decode(match[2]);
      }
    }
    return urlParams;
  };

  var persistHttpGetParams = function() {
    var params = extractHttpGetParams();
    for(var key in params) {
      $('form').append('<input type="hidden" id="' + key + '" name="' + key + '" value="' + params[key] + '" />')
    }
  };

  var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  return {
    persistHttpGetParams : persistHttpGetParams,
    getParameterByName : getParameterByName
  }
})(window);
