const { db } = require('../utility/admin');

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

//WIP
/*
exports.getUserLikes = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          userData.user = doc.data();
          return db
            .collection('screams')
            .where('userHandle', '==', req.params.handle)
            .orderBy('createdAt', 'desc')
            .get();
        } else {
          return res.status(404).json({ errror: 'User not found' });
        }
      })
      .then((data) => {
        userData.screams = [];
        data.forEach((doc) => {
          userData.screams.push({
            body: doc.data().body,
            subject: doc.data().subject,
            theme: doc.data().theme,
            source: doc.data().source,
            answer: doc.data().answer,
            keywords: doc.data().keywords,
            createdAt: doc.data().createdAt,
            userHandle: doc.data().userHandle,
            userImage: doc.data().userImage,
            likeCount: doc.data().likeCount,
            commentCount: doc.data().commentCount,
            screamId: doc.id
          });
        });
        return res.json(userData);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };*/