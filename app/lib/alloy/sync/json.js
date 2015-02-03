function Sync(method, model, opts) {
  if (method !== 'read') {
    throw 'This sync adapter only reads.';
  } else {
    var xhr = null;
    if (Ti.Network.online) {
      xhr = Ti.Network.createHTTPClient({
        enableKeepAlive: false, 
        
        timeout: 10 * 1000,
        
        onload: function() {
          try {
            var values = JSON.parse(this.responseText);
            model.length = values.length;
            opts.success((model.length === 1) ? values[0] : values, this.responseText);
          } catch (e) {
            var error = this.responseText;
            if(error == "") {
              error = "Error";
            }
            opts.error(model, this.responseText);
          }
        },
        onerror: function(e) {
          var error = this.responseText;
          if(error == "") {
            error = "The server is offline";
          }
          
          try{
            // check to see if response is JSON and has an 'error' node
            var json_error = JSON.parse(this.responseText).error;
            if(json_error) {
              error = json_error;
            }
          } catch(e){}
          
          console.log("error: " + error + " calling: " + url);
          opts.error(model, error);
        }
      });

      var url = model.config.adapter.url;
      if(url == null && model.url != null) {
        url = model.url();
      } else if (_.isFunction(url)) {
        url = url();
      }
      if (opts.params && !_.isEmpty(opts.params)) {
        // If opts.params has been provided, expect it to be
        // a key/value hash of parameters to be appended to the
        // query string
        //
        // ie. params{ key1: 'value1', key2: 'value2'}
        // would be appended to the url as: ?key1=value1&key2=value2
        var query_str = [];
        for (var p in opts.params) {
          if (opts.params.hasOwnProperty(p)) {
            var k = p,
                v = opts.params[p];
            query_str.push(k + "=" + v);
          }
        }
        url += "?" + query_str.join("&");
      }
      xhr.open('GET', url);
      console.log("fetching: " + url);
      xhr.send();
    } else {
      opts.error(model, 'Network is offline');
    }
    return xhr;
  }
}

exports.sync = Sync;