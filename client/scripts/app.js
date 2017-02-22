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
    server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    username: 'anonymous',
    roomname: 'lobby',
    lastMessageId : 0,
    friends: {},
    messages: []
  };

  app.init = function() {
    app.username = window.location.search.substr(10);
    //need message, chats, roomselect, send
    $('#chats').on('click', '.username', app.handleUsernameClick);
    $('#send').on('submit', app.handleSubmit());
    $('#roomSelect').on('change', app.handleRoomChange());

    app.startSpinner();
    app.fetch(false);
    // console.log(app.fetch());
    setInterval(function() { app.fetch(true) }, 3000 );
  };

  app.send = function(message) {
    app.startSpinner();

    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      // contentType: 'application/json',
      success: function (data) {
        $('#message').val('');

        app.fetch();
        console.log('chatterbox: Message sent', data);
      },
      error: function (error) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', error);
      }
    });
  };

  app.fetch = function(animate) {
    // console.log('fetch fired');
    $.ajax({
      url: app.server,
      type: 'GET',
      //instructions on how to order the elements when we fetch them, so when we render them, they are ordered by opposite of when created, so last created will be shown first in list of messages rendered
      data: {order: '-createdAt' },
      contentType: 'application/json',
      success: function (data) {
        if (!data.results || !data.results.length) { return; }
        //store messages for caching later
        app.messages = data.results;

        var mostRecentMessage = data.results[data.results.length - 1];
        //only bother updating dom if have new message
        if (mostRecentMessage.objectId !== app.lastMessageId) {
          app.renderRoomList(data.results);

          // Update the UI with the fetched messages
          app.renderMessages(data.results, animate);

          // Store the ID of the most recent message
          app.lastMessageId = mostRecentMessage.objectId;
          // data.results.forEach(function(element) { app.renderMessage(element) });
          console.log('chatterbox: Message retrieved', data);
        }
      },
      error: function (error) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', error);
      }
    });
  };

  app.clearMessages = function() {
    $('#chats').html(''); // from the solution
    // $('#chats').empty();
  };

  app.renderMessages = function(messages, animate) { // removed , animate from parameters
    app.clearMessages();
    app.stopSpinner();
    if (Array.isArray(messages)) {
      // Add all fetched messages that are in our current room
      messages
        .filter(function(message) {
          return message.roomname === app.roomname ||
                 app.roomname === 'lobby' && !message.roomname;
        })
        .forEach(app.renderMessage);
    }
    if (animate) {
      $('body').animate({ scrollTop: '0px' }, 'fast');
    }

    // this is how we were using this function vvv down here
    // $('#chats').prepend('<p>' + '<span onclick="app.handleUsernameClick(innerHTML)" >' + escapeHtml(message.username) + '</span>' + ': ' + escapeHtml(message.text) + '</p>');
  };
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
  app.renderRoomList = function(messages) {
    $('#roomSelect').html('<option value="__newRoom">New room...</option>');

    if (messages) {
      var rooms = {};
      messages.forEach(function(message) {
        var roomname = message.roomname;
        if (roomname && !rooms[roomname]) {
          // Add the room to the select menu
          app.renderRoom(roomname);

          // Store that we've added this room already
          rooms[roomname] = true;
        }
      });
    }

    // Select the menu option
    $('#roomSelect').val(app.roomname);
  };

  // var message = {
  //   username: 'emmajo',
  //   text: '<script> alert("gotcha") </script>',
  //   roomname: 'youandme'
  // };

  var escapeHtml = str => {
    var span = document.createElement('span');
    span.appendChild(document.createTextNode(str));
    return span.innerHTML;
  };

//make username a link or button consisting of only text? idea is to make clickable
//on click, call handleUsernameClick


//   <span id="SpecialSpan"
//       onmouseover="this.style.cursor='pointer'"
//       onmouseout="this.style.cursor='default'"
//       onclick="a()";>
//       *click here*
// </span>



  app.renderRoom = function(roomname) {
    // Prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(roomname).text(roomname);

    // Add to select
    $('#roomSelect').append($option);

    // this is how we were using this function before
    // $('#roomSelect').prepend('<p>' + escapeHtml(message.roomname) + '</p>');
  };

  app.renderMessage = function(message) {
    if (!message.roomname) {
      message.roomname = 'lobby';
    }

    // Create a div to hold the chats
    var $chat = $('<div class="chat"/>');

    // Add in the message data using DOM methods to avoid XSS
    // Store the username in the element's data attribute
    var $username = $('<span class="username"/>');
    $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);

    // Add the friend class
    if (app.friends[message.username] === true) {
      $username.addClass('friend');
    }

    var $message = $('<br><span/>');
    $message.text(message.text).appendTo($chat);

    // Add the message to the UI
    $('#chats').append($chat);
  };

  app.handleUsernameClick = function(event) {
    var username = $(event.target).data('username');

    if (username !== undefined) {
      // Toggle friend
      app.friends[username] = !app.friends[username];

      // Escape the username in case it contains a quote
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';

      // Add 'friend' CSS class to all of that user's messages
      var $usernames = $(selector).toggleClass('friend');
    }
    // console.log(innerHTML);
    //creatively determine what we want to happen when a user "adds a friend"
    //ideas?
    //can just do an alert box for now to get functionality down, spice up later w animation or displaying other component of website?
  };

  app.handleRoomChange = function(event) {

    var selectIndex = $('#roomSelect').prop('selectedIndex');
    // New room is always the first option
    if (selectIndex === 0) {
      var roomname = prompt('Enter room name');
      if (roomname) {
        // Set as the current room
        app.roomname = roomname;

        // Add the room to the menu
        app.renderRoom(roomname);

        // Select the menu option
        $('#roomSelect').val(roomname);
      }
    } else {
      app.startSpinner();
      // Store as undefined for empty names
      app.roomname = $('roomSelect').val();
    }
    // Rerender messages
    app.renderMessages(app.messages);
  };

  app.handleSubmit = function(event) {
    var message = {
      username: app.username,
      text: $('#message').val(),
      roomname: app.roomname || 'lobby'
    };

    app.send(message);
    // Stop the form from submitting
    // event.preventDefault(); this causes spec runner to fail with "before all" hook when enabled
  };

  app.startSpinner = function() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', 'true');
  };

  app.stopSpinner = function() {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
  };
// app.send(message);
// app.renderMessage(message);
//escapeHTML: used arrow for function, possibly need to change back to normal format?

// YOU DO NOT NEED TO EDIT THIS CODE
  // if (!/(&|\?)username=/.test(window.location.search)) {
  //   var newSearch = window.location.search;
  //   if (newSearch !== '' & newSearch !== '?') {
  //     newSearch += '&';
  //   }
  //   newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  //   window.location.search = newSearch;
  // }




