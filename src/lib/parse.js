// eslint-disable-next-line no-undef
const Parse = require("parse");
Parse.serverURL = "https://parseapi.back4app.com";
Parse.initialize(
  "o9nRKZJ6oS6b5G3lPgFmAEoSuARBZLEjghahwdS7",
  "RDqcVOJSDAWGOiyjsxoWT3c7uVf6nCsXDp4VMQwp",
);

export function getCurrentUser({ onSuccess, onError }) {
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
      // console.log(JSON.parse(foundUser))
      onSuccess(JSON.parse(foundUser));
    }
  }, (error) => {
    if (typeof document !== 'undefined') {
      onError(error);
    }
  });
}

export function signIn({ username, password, onSuccess, onError }) {
  Parse.User.logIn(username, password).then(function(user) {
    // console.log('User logged in: ' + user.get("username") + ' and email: ' + user.get("email"));
    onSuccess({
      username: user.get("username"),
      email: user.get("email"),
      payload: user
    });
  }).catch(function(error){
    // console.log("Error: " + error.code + " " + error.message);
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
      // console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
      onSuccess({
        username: user.get("username"),
        email: user.get("email"),
      });
  }).catch(function(error){
      // console.log("Error: " + error.code + " " + error.message);
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
  if (!currentUser) {
    onError("You must be signed in first");
    return false;
  }

  // Let's do this
  const TreeClass = Parse.Object.extend('Tree');
  const newTree = new TreeClass();

  newTree.set('name', tree[0].root.name);
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

export function updateTreeInDB({ tree, onSuccess, onError }) {
  const TreeClass = Parse.Object.extend('Tree');
  const query = new Parse.Query(TreeClass);

  // here you put the objectId that you want to update
  query.get(tree[0].root.id).then((object) => {
    object.set('tree', tree);
    object.save().then((response) => {
      // You can use the "get" method to get the value of an attribute
      // Ex: response.get("<ATTRIBUTE_NAME>")
      if (typeof document !== 'undefined') {
        onSuccess(JSON.parse(JSON.stringify(response)));
      }
    }, (error) => {
      if (typeof document !== 'undefined') {
        onError(error);
      }
    });
  });
}

export function getMyTrees({ onSuccess, onError }) {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    onError("Log in first");
    return false;
  }

  const TreeClass = Parse.Object.extend('Tree');
  const query = new Parse.Query(TreeClass);
  query.equalTo("owner", currentUser.id);
  query.find().then((results) => {
    if (typeof document !== 'undefined') {
      // console.log(JSON.parse(JSON.stringify(results)))
      onSuccess(JSON.parse(JSON.stringify(results)));
    }
  }, (error) => {
    if (typeof document !== 'undefined') {
      onError(error);
    }
  });
}

export function loadTree({ id, onSuccess, onError }) {
  const TreeClass = Parse.Object.extend('Tree');
  const query = new Parse.Query(TreeClass);
  query.equalTo("objectId", id);
  query.find().then((results) => {
    if (typeof document !== 'undefined') {
      // console.log(JSON.parse(JSON.stringify(results)))
      onSuccess(JSON.parse(JSON.stringify(results)));
    }
  }, (error) => {
    if (typeof document !== 'undefined') {
      onError(error);
    }
  });
}

export function deleteTree({ id, onSuccess, onError }) {
  const TreeClass = Parse.Object.extend('Tree');
  const query = new Parse.Query(TreeClass);
  query.get(id).then((object) => {
    object.destroy().then(() => {
      // console.log(response)
      onSuccess(`Tree ${id} was deleted`);
    }, () => {
      onError("Couldn't delete that Tree");
    });
  });
}
