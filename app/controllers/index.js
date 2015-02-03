function doClick(e) {
  $.label.text = "Loading..";
  $.list.fetch({
    success: function(collection) {
      // Setting a Ti Studio breakpoint here will crash the app
      // in iOS when using the 3.5.0 SDK. It works fine in 3.4.1
      var r = JSON.stringify(collection);
      console.log(r);
      $.label.text = r;
    },
    error: function(model, message){
      console.log(message);
      $.label.text = message;
    }
  });
}

$.index.open();
