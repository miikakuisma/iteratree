import * as Env from '../env';
import { logger } from "./helpers";

// eslint-disable-next-line no-undef
const Parse = require("parse");
Parse.serverURL = Env.SERVER_URL;
Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);

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

export function saveNewTree({ tree, onSuccess, onError }) {
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

export function updateSavedTree({ tree, onSuccess, onError }) {
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

export function saveImage({ name, type, size, base64 }) {
  return new Promise(
    function (resolve, reject) {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        reject("You must be signed in first");
      }
    
      let uploadedFile = new Parse.File(name, { base64 });
      let PhotoClass = Parse.Object.extend('Photo');
      let photo = new PhotoClass();
      photo.set('photo', uploadedFile);
      photo.set('owner', currentUser.id);
      photo.set('type', type);
      photo.set('size', size);
      photo.save()
      .catch((error) => reject(error))
      .then((results) => resolve(JSON.parse(JSON.stringify(results))))
    }
  );
}

export function listImages() {
  return new Promise(
    function (resolve, reject) {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        reject("You must be signed in first");
      }
      let PhotoClass = Parse.Object.extend('Photo');
      const query = new Parse.Query(PhotoClass);
      query.equalTo("owner", currentUser.id);
      query.find().then((results) => {
        if (typeof document !== 'undefined') {
          if (results) {
            // logger(JSON.parse(JSON.stringify(results)))
            resolve(JSON.parse(JSON.stringify(results)));
          }
        }
      }, (error) => {
        if (typeof document !== 'undefined') {
          reject(error);
        }
      });
    }
  );
}

export function getImage({ id }) {
  return new Promise(
    function (resolve, reject) {
      if (!id) {
        reject('no id')
      }
      let PhotoClass = Parse.Object.extend('Photo');
      const query = new Parse.Query(PhotoClass);
      query.get(id)
      .catch((error) => reject(error))
      .then((object) => {
        if (object) {
          resolve(JSON.parse(JSON.stringify(object)))
        }
      })
    }
  );
}

export function deleteImage({ id }) {
  return new Promise(
    function (resolve, reject) {
      let PhotoClass = Parse.Object.extend('Photo');
      const query = new Parse.Query(PhotoClass);
      query.get(id).then((object) => {
        object.destroy()
        .catch((error) => reject(error))
        .then(() => resolve(`Image ${id} was deleted`))  
      })
    }
  )
}


// export function saveNodeContent({ treeId, nodeId, content }) {
//   logger('API Request (save content)');
//   return new Promise(
//     function (resolve, reject) {

//       const currentUser = Parse.User.current();
//       if (!currentUser) {
//         reject("You must be signed in first");
//       }

//       const ContentClass = Parse.Object.extend('nodeContent');
//       const newContent = new ContentClass();

//       newContent.set('treeId', treeId);
//       newContent.set('nodeId', nodeId.toString());
//       newContent.set('content', content);
//       newContent.set('owner', currentUser.id);

//       newContent.save().then(
//         (result) => {
//           if (typeof document !== 'undefined') {
//             resolve(JSON.parse(JSON.stringify(result)));
//           }
//         },
//         (error) => {
//           if (typeof document !== 'undefined') {
//             reject(error);
//           }
//         }
//       );
//     }
//   )  
// }

// export function updateNodeContent({ contentId, content }) {
//   logger('API Request (update content)');
//   return new Promise(
//     function (resolve, reject) {
//       const ContentClass = Parse.Object.extend('nodeContent');
//       const query = new Parse.Query(ContentClass);
//       query.get(contentId).then((object) => {
//         object.set('content', content);
//         object.save().then((response) => {
//           if (typeof document !== 'undefined') {
//             // logger(JSON.parse(JSON.stringify(response)));
//             resolve(JSON.parse(JSON.stringify(response)));
//           }
//         }, (error) => {
//           if (typeof document !== 'undefined') {
//             reject(error);
//           }
//         });
//       });
//     }
//   )  
// }

// export function loadTreeContent({ treeId }) {
//   logger('API Request (load)');
//   return new Promise(
//     function (resolve, reject) {
//       const ContentClass = Parse.Object.extend('nodeContent');
//       const query = new Parse.Query(ContentClass);
//       query.equalTo("treeId", treeId);
//       query.find().then((results) => {
//         if (typeof document !== 'undefined') {
//           // logger(JSON.parse(JSON.stringify(results)));
//           resolve(JSON.parse(JSON.stringify(results)));
//         }
//       }, (error) => {
//         if (typeof document !== 'undefined') {
//           reject(error);
//         }
//       });
//     }
//   );
// }

// FROM UI

// const saveContentText = (text) => {
//   setSaving(true);
//   saveNodeContent({
//     treeId,
//     nodeId,
//     content: {
//       markdown: text
//     }
//   })
//   .catch((e) => {
//     setSaving(false);
//     message.error(e)}
//   )
//   .then((response) => {
//     setSaving(false);
//     content.setState(response);
//   });
// }

// const updateContentText = (text) => {
//   setSaving(true);
//   updateNodeContent({
//     contentId,
//     content: {
//       markdown: text
//     }
//   })
//   .catch((e) => {
//     setSaving(false);
//     message.error(e)}
//   )
//   .then((response) => {
//     setSaving(false);
//     content.setState(response);
//   });
// }



// APP JS UPDATING

// function refreshContent(newContent) {
//   let updatedContent
//   // new entry 
//   if (!content.find(c => c.nodeId === newContent.nodeId)) {
//     if (newContent.length > 1) {
//       updatedContent = [...content, ...newContent];
//     } else {
//       updatedContent = [...content, newContent];
//     }
//     updateContent(updatedContent);
//     if (mode === "editor") {
//       window.localStorage.setItem("content", JSON.stringify(updatedContent));
//     }
//   } else {
//     // or update?
//     updatedContent = content.map(c => {
//       if (c.nodeId === newContent.nodeId) {
//         return newContent;
//       }
//       return c;
//     });
//     updateContent(updatedContent);
//     if (mode === "editor") {
//       window.localStorage.setItem("content", JSON.stringify(updatedContent));
//     }
//   }
// }

// function resetContent() {
//   updateContent([]);
//   window.localStorage.removeItem("content");
// }