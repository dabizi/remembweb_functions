const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./utility/fbAuth');

const { 
    getAllScreams, 
    postOneScream, 
    getScream, 
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream
} = require('./handlers/screams');

const { 
    signup, 
    login, 
    uploadImage, 
    addUserDetails,
    getAuthenticatedUser
 } = require('./handlers/users');

//Scream route
app.post('/screams', FBAuth, postOneScream);
app.post('/screams/:screamId/comment', FBAuth, commentOnScream);
app.get('/screams', getAllScreams);
app.get('/screams/:screamId', getScream);
app.get('/screams/:screamId/like', FBAuth, likeScream);
app.get('/screams/:screamId/unlike', FBAuth, unlikeScream);
app.delete('/screams/:screamId', FBAuth, deleteScream)

//Users route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser)

exports.api = functions.region('europe-west1').https.onRequest(app);
