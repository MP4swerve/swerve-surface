$(document).ready(() => {
  window.visitor = 'defaultUser'; // Set a default visitor
  
  // Create DOM elements for tweets and input form
  const $body = $('body');
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
  $body.prepend($form, $button, $tweetsDiv);
  $form.prepend($usernameInput, $tweetInput, $tweetButton, $createNewUser, $createButton);
  
   // Set background color for the body
   $('body').css('background-color', 'rgb(0, 255, 255)');

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