$(document).ready(() => {
  window.visitor = 'defaultUser'; // Set a default visitor
  
  // Create DOM elements for tweets and input form
  const $body = $('body');
  const $header = $('<header>SWERVE SURFACE</header>');
  const $logo = $('<img src="https://th.bing.com/th/id/OIP.HZTabPYFPRJx2KLbxyVEQQHaF7?w=219&h=180&c=7&r=0&o=5&dpr=2&pid=1.7" alt="Logo">');
  const $tweetsDiv = $('<div></div>');
  const $button = $('<button>Click</button>');
  const $tweetInput = $('<input type="text" placeholder="Type your tweet here...">');
  const $tweetButton = $('<button>Post</button>');
  const $usernameInput = $('<input type="text" placeholder="Your username">');
  const $createNewUser = $('<input type="text" placeholder="Create New User">');
  const $createButton = $('<button>Create User<button>')
  const $form = $('<form></form>');
  
  $createButton.css('float', 'right');
  $createNewUser.css('float', 'right');

  // Append elements to the body
  $body.prepend($header, $form, $button, $tweetsDiv);
  $header.prepend($logo);
  $form.prepend($usernameInput, $tweetInput, $tweetButton, $createNewUser, $createButton);
  
  // Set background color for the body
  $('body').css({
    'background-color': '#f5f8fa',
    'font-family': '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif',
    'color': '#14171a',
    'font-size': '14px'
  });

  // Set styles for the form
  $form.css({
    'padding': '10px',
    'border-bottom': '1px solid #e1e8ed',
    'background-color': '#fff'
  });

  // Set styles for the tweet input
  $tweetInput.css({
    'width': '100%',
    'height': '40px',
    'padding': '10px',
    'margin-bottom': '10px',
    'border-radius': '20px',
    'border': '1px solid #ccd6dd',
    'box-sizing': 'border-box',
    'outline': 'none'
  });

  // Set styles for the tweet button
  $tweetButton.css({
    'padding': '10px 20px',
    'background-color': '#1da1f2',
    'color': '#fff',
    'border': 'none',
    'border-radius': '20px',
    'cursor': 'pointer',
    'outline': 'none'
  });

  // Set styles for the tweets container
  $tweetsDiv.css({
    'padding': '20px'
  });

  $logo.css({
    'float': 'left', // Set the logo to float left
    'margin-right': '10px',
    'width': '100px', // Set the width to 100 pixels
    'height': 'auto' // Maintain the aspect ratio
  });

  $('header').css({
    'background-color': '#f5f8fa', // Set background color to Twitter blue
    'color': 'red', // Set text color to white
    'padding': '10px', // Add padding to create space around the content
    'text-align': 'center', // Align text to the center
    'font-size': '100px', // Set font size
    'font-weight': 'bold', // Set font weight to bold
    'text-transform': 'uppercase', // Transform text to uppercase
    'border-bottom': '2px solid #ddd', // Add a bottom border with a light gray color
  });

  // Render a single tweet
  const renderTweet = (tweet) => {
    const $tweet = $('<div></div>');
    const text = `@<a href="#" class="username">${tweet.user}</a>: ${tweet.message}`;
    const timestamp = moment(tweet.created_at).format('MMMM Do YYYY, h:mm:ss a');
    const timeAgo = moment(tweet.created_at).fromNow();
    $tweet.html(text).append(` - ${timestamp}`).append(` - ${timeAgo}`);
    return $tweet;
  };

  // Render an array of tweets
  const renderTweets = (tweetsArray, $targetElement) => {
    tweetsArray.forEach((tweet) => {
      const $tweet = renderTweet(tweet);
      $targetElement.prepend($tweet);
    });
  };

  // Render initial tweets on page load
  renderTweets(streams.home, $tweetsDiv);

  let numTweetsRendered = 0
  // Render new tweets when button is clicked
  $button.on('click', () => {
    const newTweets = streams.home.slice(numTweetsRendered);
    renderTweets(newTweets, $tweetsDiv);
    numTweetsRendered += newTweets.length;
  });

  // Show user's timeline when username is clicked
  $tweetsDiv.on('click', '.username', function(event) {
    event.preventDefault();
    const username = $(this).text();
    const userTweets = streams.users[username];
    if (userTweets) {
      $tweetsDiv.html('')
      renderTweets(userTweets, $tweetsDiv);
    } else {
      alert('User has no tweets!');
    }
  });

  // Post a new tweet when button is clicked
  $tweetButton.on('click', () => {
    event.preventDefault();
    const username = $usernameInput.val().trim();
    const message = $tweetInput.val().trim();
    if (username && message) { // Check if username and message are not empty
      const newTweet = {
        user: username,
        message: message,
        created_at: new Date(),
      };
      addTweet(newTweet); // Add the new tweet to the data structure
      renderTweet(newTweet).prependTo($tweetsDiv); // Render the new tweet and prepend it to the tweets container
      $tweetInput.val(''); // Clear the input field
    } else {
      alert('Please enter both username and tweet message!');
    }
  });

  // Define the addTweet function to add new tweets to the data structure
  const addTweet = (newTweet) => {
    streams.users[newTweet.user].push(newTweet); // Add the tweet to the user's tweets
    streams.home.push(newTweet); // Add the tweet to the home timeline
  };
  
     // Handle hover effect for usernames
     $tweetsDiv.on('mouseenter', '.username', function() {
      $(this).css('color', 'red'); // Change text color to blue on hover
  });

  $tweetsDiv.on('mouseleave', '.username', function() {
      $(this).css('color', ''); // Revert text color to default on hover out
  });
  
  $form.on('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const createUser = $createNewUser.val().trim();
    if (createUser) {
      if (!streams.users[createUser]) {
        streams.users[createUser] = []; // Add the new user to the data structure
        alert(`User ${createUser} was created successfully!`);
      } else {
        alert(`User ${createUser} already exists!`);
      }
    } else {
      alert(`Please enter a valid username`);
    }
  })
});