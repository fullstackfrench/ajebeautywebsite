module.exports = function(app, passport, db) {
  const {ObjectId} = require('mongodb')
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      res.render(req.user.local.userType == 'professional' ?'professional-profile-page.ejs' : 'client-profile-page.ejs', {
            user : req.user
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// professional pages' routes ===============================================================

    app.post('/professionalform', isLoggedIn, (req, res) => {
      req.user.local.businessName = req.body.businessName
      req.user.local.role = req.body.role
      req.user.local.services = ['Silk-press', 'Braids', 'Locs', 'Curly-cuts'].filter(service => req.body[service.toLowerCase().replace('-', '')]).join(', ')
      req.user.save()
        console.log('saved to database')
        res.redirect('/profile')
      })

    app.get('/professionalform', (req, res) => {
      res.render('professional-profile-form.ejs')

    })




    app.put('/profileupdated', (req, res) => {
      console.log('Profile Updated', req.body)
      console.log('req.user', req.user)
      // db.collection('users')
      // .findOneAndUpdate({_id: ObjectId(req.user._id) }, {
      //   $set: {
      //      local: {businessName: req.body.newBusinessName, role: req.body.newRole}
      //   }
      // }, {
      //   sort: {_id: -1},
      //   upsert: true
      // }, (err, result) => {
      //   if (err) return res.send(err)

      //   res.send(result)
      //   console.log('Result from profile updated', result)
      // })
    req.user.local.businessName = req.body.newBusinessName
    req.user.local.role = req.body.newRole
    req.user.save()
    res.send({status: 'okay'})
    })

    

    app.delete('/profile', (req, res) => {
      db.collection('users').findOneAndDelete({_id: ObjectId(req.user._id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    // other routes ===============================================================

    // app.get('/searchresults', (req, res) => {
    //   db.collection('professional-user').save({salonname: req.body.nameofsalon, role: req.body.role}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/professionalprofilepage')
    //   })
    // })

    // app.get('/reviews', (req, res) => {
    //   db.collection('professional-user').save({salonname: req.body.nameofsalon, role: req.body.role}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/professionalprofilepage')
    //   })
    // })


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/professionalform', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
