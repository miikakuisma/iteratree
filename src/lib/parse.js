import { logger } from "./helpers";

// eslint-disable-next-line no-undef
const Parse = require("parse");
Parse.serverURL = "https://parseapi.back4app.com";
Parse.initialize(
  "o9nRKZJ6oS6b5G3lPgFmAEoSuARBZLEjghahwdS7",
  "RDqcVOJSDAWGOiyjsxoWT3c7uVf6nCsXDp4VMQwp",
);

export function getCurrentUser({ onSuccess, onError }) {
  logger('API Request (getCurrentUser)');
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
      // logger(JSON.parse(foundUser))
      onSuccess(JSON.parse(foundUser));
    }
  }, (error) => {
    if (typeof document !== 'undefined') {
      onError(error);
    }
  });
}

export function signIn({ username, password, onSuccess, onError }) {
  logger('API Request (signIn)');
  Parse.User.logIn(username, password).then(function(user) {
    // logger('User logged in: ' + user.get("username") + ' and email: ' + user.get("email"));
    onSuccess({
      username: user.get("username"),
      email: user.get("email"),
      payload: user
    });
  }).catch(function(error){
    // logger("Error: " + error.code + " " + error.message);
    onError(error.message);
  });
}

export function signOut() {
  window.localStorage.clear();
  window.location.reload();
}

export function signUp({ username, password, email, onSuccess, onError }) {
  logger('API Request (signUp)');
  var user = new Parse.User();
  user.set("username", username);
  user.set("password", password);
  user.set("email", email);
  user.signUp().then(function(user) {
      // logger('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
      onSuccess({
        username: user.get("username"),
        email: user.get("email"),
      });
  }).catch(function(error){
      // logger("Error: " + error.code + " " + error.message);
      onError(error);
  });
}

export function resetPassword({ email, onSuccess, onError  }) {
  logger('API Request (resetPassword)');
  Parse.User.requestPasswordReset(email).then(function() {
    onSuccess("Password reset request was sent successfully");
  }).catch(function(error) {
    onError("The login failed with error: " + error.code + " " + error.message);
  });
}

export function saveToDB({ tree, onSuccess, onError }) {
  logger('API Request (save)');
  const currentUser = Parse.User.current();
  if (!currentUser) {
    onError("You must be signed in first");
    return false;
  }

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

export function renameTree({ treeId, newName, onSuccess, onError }) {
  logger('API Request (update)');
  const TreeClass = Parse.Object.extend('Tree');
  const query = new Parse.Query(TreeClass);

  query.get(treeId).then((object) => {
    object.set('name', newName);
    object.save().then((response) => {
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

export function updateTreeInDB({ tree, onSuccess, onError }) {
  logger('API Request (update)');
  const TreeClass = Parse.Object.extend('Tree');
  const query = new Parse.Query(TreeClass);

  query.get(tree[0].root.id).then((object) => {
    object.set('tree', tree);
    object.save().then((response) => {
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
  logger('API Request (get)');
  const TreeClass = Parse.Object.extend('Tree');
  const query = new Parse.Query(TreeClass);
  query.equalTo("owner", currentUser.id);
  query.find().then((results) => {
    if (typeof document !== 'undefined') {
      // logger(JSON.parse(JSON.stringify(results)))
      onSuccess(JSON.parse(JSON.stringify(results)));
    }
  }, (error) => {
    if (typeof document !== 'undefined') {
      onError(error);
    }
  });
}

export function loadTree({ id, onSuccess, onError }) {
  logger('API Request (load)');
  const TreeClass = Parse.Object.extend('Tree');
  const query = new Parse.Query(TreeClass);
  query.equalTo("objectId", id);
  query.find().then((results) => {
    if (typeof document !== 'undefined') {
      // logger(JSON.parse(JSON.stringify(results)))
      onSuccess(JSON.parse(JSON.stringify(results)));
    }
  }, (error) => {
    if (typeof document !== 'undefined') {
      onError(error);
    }
  });
}

export function deleteTree({ id, onSuccess, onError }) {
  logger('API Request (delete)');
  const TreeClass = Parse.Object.extend('Tree');
  const query = new Parse.Query(TreeClass);
  query.get(id).then((object) => {
    object.destroy().then(() => {
      // logger(response)
      onSuccess(`Tree ${id} was deleted`);
    }, () => {
      onError("Couldn't delete that Tree");
    });
  });
}
