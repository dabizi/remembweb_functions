const { db } = require('../utility/admin');

// Give all Likes that exists
exports.getAllLikes = (req, res) => {
    db
    .collection('likes')
    .orderBy('testedAt', 'desc')
    .get()
    .then(data => {
        let likes = [];
        data.forEach(doc => {
            likes.push({
                likeId: doc.id,
                screamId: doc.data().id,
                level: doc.data().level,
                testedAt: doc.data().testedAt,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
            });
        });
        return res.json(likes);
    })
    .catch(err => console.error(err));
};

//Get a specific Like
exports.getLike = (req, res) => {
    let likeData = {};
    db.doc(`/likes/${req.params.likeId}`).get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Like not found'})
        }
        likeData = doc.data();
        likeData.likeId = doc.id;
        return res.json(likeData);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    });
};


exports.successTest = (req, res) => {
    db.doc(`/likes/${req.params.likeId}`).get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Like not found'})
        }
        let level = doc.data().level;
        let dayToAdd = Math.pow(2, level - 1);
        if (level < 8){
            level++;
        }
        const nextTest = new Date()
        nextTest.setDate(nextTest.getDate() + dayToAdd);
        const testedAt = nextTest.toISOString();
        return (db.doc(`/likes/${req.params.likeId}`).update({ level, testedAt }));
    })
    .then(() => {
        return res.json({ message: 'Successfully updated level'});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    });
};

exports.failureTest = (req, res) => {
    db.doc(`/likes/${req.params.likeId}`).get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Like not found'})
        }
        let level = 1;
        const testedAt = new Date().toISOString();
        return (db.doc(`/likes/${req.params.likeId}`).update({ level, testedAt }));
    })
    .then(() => {
        return res.json({ message: 'Successfully failed level'});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    });
};

//Send back the user and all of its likes
exports.getUserLikes = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          userData.user = doc.data();
          return  db
          .collection('likes')
          .where('userHandle', '==', req.user.handle)
          .orderBy('testedAt', 'asc')
          .get()
        } else {
            return res.status(404).json({ errror: 'User not found' });
          }
        })
      .then((data) => {
        userData.likes = [];
        data.forEach((doc) => {
          userData.likes.push({
            level: doc.data().level,
            testedAt: doc.data().testedAt,
            createdAt: doc.data().createdAt,
            screamId: doc.data().screamId,
            likeId: doc.id
          });
        });
        return res.json(userData);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };

  exports.getLikesDatePassed = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          userData.user = doc.data();
          return  db
          .collection('likes')
          .where('userHandle', '==', req.user.handle)
          .orderBy('testedAt', 'asc')
          .get()
        } else {
            return res.status(404).json({ errror: 'User not found' });
          }
        })
      .then((data) => {
        userData.toTest = [];
        let now = new Date();
        data.forEach((doc) => {
            //WIP 
            let date = new Date(doc.data().testedAt);
            if (date < now)
            {
          userData.toTest.push({
            level: doc.data().level,
            testedAt: doc.data().testedAt,
            createdAt: doc.data().createdAt,
            screamId: doc.data().screamId,
            likeId: doc.id
          });
        }
        });
        return res.json(userData);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };