import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyA1tdVMhj6cugkj8dqaL7zxRNSO517gzHc",
    authDomain: "likeminded-3a43e.firebaseapp.com",
    databaseURL: "https://likeminded-3a43e.firebaseio.com",
    projectId: "likeminded-3a43e",
    storageBucket: "likeminded-3a43e.appspot.com",
    messagingSenderId: "522837032577"
};
firebase.initializeApp(config);

export const ref = firebase.database().ref()
export const auth = firebase.auth
export const provider = new firebase.auth.FacebookAuthProvider(); 