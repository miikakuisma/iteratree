
const Parse = require("parse");
Parse.serverURL = "https://parseapi.back4app.com";
Parse.initialize(
  "o9nRKZJ6oS6b5G3lPgFmAEoSuARBZLEjghahwdS7",
  "RDqcVOJSDAWGOiyjsxoWT3c7uVf6nCsXDp4VMQwp",
);

export function getCurrentUser({ onSuccess, onError }) {
  const User = new Parse.User();
  const query = new Parse.Query(User);
  const currentUser = Parse.User.current();
  if (!currentUser) {
    onError('No user')
    return false;
  }
  query.get(currentUser.id).then((user) => {
    if (typeof document !== 'undefined') {
      const foundUser = JSON.stringify(user);
      console.log(JSON.parse(foundUser))
      onSuccess(JSON.parse(foundUser));
    };
  }, (error) => {
    if (typeof document !== 'undefined') {
      onError(error);
    }
  });
}

export function signIn({ username, password, onSuccess, onError }) {
  var user = Parse.User
  .logIn(username, password).then(function(user) {
    console.log('User logged in: ' + user.get("username") + ' and email: ' + user.get("email"));
    onSuccess({
      username: user.get("username"),
      email: user.get("email"),
      payload: user
    });
  }).catch(function(error){
    console.log("Error: " + error.code + " " + error.message);
    onError(error.message);
  });
}

export function signOut() {
  window.localStorage.clear();
  window.location.reload();
}

export function signUp({ username, password, email, onSuccess, onError }) {
  var user = new Parse.User();
  user.set("username", username);
  user.set("password", password);
  user.set("email", email);
  user.signUp().then(function(user) {
      console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
      onSuccess({
        username: user.get("username"),
        email: user.get("email"),
      });
  }).catch(function(error){
      console.log("Error: " + error.code + " " + error.message);
      onError(error);
  });
}

export function resetPassword() {

  // function resetPassword() {
  //   Parse.User.requestPasswordReset("email@example.com").then(function() {
  //     console.log("Password reset request was sent successfully");
  //   }).catch(function(error) {
  //     console.log("The login failed with error: " + error.code + " " + error.message);
  //   });
  // }

}

export function saveToDB({ tree, onSuccess, onError }) {
  const currentUser = Parse.User.current();

  const TreeClass = Parse.Object.extend('Tree');
  const newTree = new TreeClass();

  newTree.set('name', tree[0].title);
  newTree.set('tree', tree);
  newTree.set('owner', currentUser.id);

  newTree.save().then(
    (result) => {
      if (typeof document !== 'undefined') {
        onSuccess(JSON.parse(JSON.stringify(result)));
      }
    },
    (error) => {
      if (typeof document !== 'undefined') {
        onError(error);
      }
    }
  );
}
