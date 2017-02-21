// YOUR CODE HERE:
// our to do list!

  // get to know each other a little better
  // discuss how each of us likes to work and what our workflow for this sprint will be

  // start discussing the project, making sure we understand what we're supposed to be doing
  // make sure we understand the components of our project and how they work together

  // create a plan of attack; start pseudo coding stuff out
  // Make Chatterbox Great Again.
  // var message = {
  //   username: 'shawndrost',
  //   text: 'trololo',
  //   roomname: '4chan'
  // };


  var app = {
    'server': 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages'
  };


  app.init = function() {
    console.log('init method');
  };

  app.send = function(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.fetch = function() {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.clearMessages = function() {
    //   $.ajax({
    //   url: this.server,
    //   type: 'DELETE',
    //   data: JSON.stringify(message),
    //   contentType: 'application/json',
    //   success: function (data) {
    //     console.log('chatterbox: Message sent');
    //   },
    //   error: function (data) {
    //     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    //     console.error('chatterbox: Failed to send message', data);
    //   }
    // });
    $('#chats').empty();
  };

  // var message = {
  //   username: 'shawndrost',
  //   text: 'trololo',
  //   roomname: '4chan'
  // };

  app.renderMessage = function(message) {
    $('#chats').append();
  };

// using jquery to traverse the dom and find chats: $("#chats").find("blink")






