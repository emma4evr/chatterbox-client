var app = {
  server: "please enter something",
  username: 'defaultUsername',
  roomname: 'defaultRoomname',
  messages: [],
  lastMessageId: 0,

  init: function() {

    //get username from orig box
    app.username = window.location.search.substr(10);

    //cache jQuery selectors
    app.$message = $('message');
    app.$chats = $('chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');
  },

  //when writing the ajax fetch method, make sure ajax works by calling ajax.fetch() in console and make sure get the success value, not the error value, and not no value at all cuz that means its not connected right
  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      success: function(data) {
      //at first, do console.log(data), to see the format of the data, then can know what to do with that data and how to refer to it
      //should return an object with a result property
      //the result property contains an array of objects
      //each object is a message with properties like a roomname, text, username, etc
      console.log('ajax worked');  //to be removed after

      //the plan:
        //dont do anyhting if nothin to work w
        if (!data.results || !data.results.length) { return; }
        //store messages for caching later
        app.messages = data.results;
        var mostRecentMessage = app.messages[app.messages.length - 1];
        //only bother updating dom if have new message
        if (mostRecentMessage.objectId !== app.lastMessageId) {

        }

          //render each indiv message
            //create a div to hold the message
            //add in the message data
            //add the message to the ui

      //can refer to the array of data returned by app.fetch() as data, to access the array of messages say data.results
      },
      error: function(error) {
        console.log(error);
      }
      }
    })
  }

renderMessages: function(messages) {
  app.$chats.html('');

    for(var i = 0; i < app.messages.length; i++) {
      //make new dom nodes
      //create a div to hold the message
      var $chat = $('<div class="chat"/>');
      //create a span to hold the username, appendTo $chat div we just made above
      var $username = $('span class="username">' + app.messages[i].text + '</span>');
      $username.appendTo($chat);

      //create another span to hold just the message text
      //append that message text span to the new div called chat as well
      var $message = $('<br><span>' + app.messages[i].text + '</span>');
      $message.appendTo($chat);
      //append the chat div we just populated to the chats html element!
      app.$chats.append($chat)
    }
  }


  //keep going from 8min part

}