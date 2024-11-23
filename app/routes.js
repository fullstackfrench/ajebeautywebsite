module.exports = function(app, passport, db) {

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
      req.user.local.businessName = req.body.businessname
      req.user.local.role = req.body.role
      req.user.local.services = ['silkpress', 'braids', 'locs', 'curlycuts'].filter(service => req.body[service]).join(', ')
      req.user.save()
        console.log('saved to database')
        res.redirect('/profile')
      })

    app.get('/professionalform', (req, res) => {
      res.render('professional-profile-form.ejs')

    })




    app.put('/editpage', (req, res) => {
      db.collection('professional-user')
      .findOneAndUpdate({salonname: req.body.nameofsalon, role: req.body.role}, {
        $set: {
          salonname: req.body.newnameofsalon, role: req.body.newrole
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    

    app.delete('/messages', (req, res) => {
      db.collection('professional-user').findOneAndDelete({salonname: req.body.nameofsalon, role: req.body.role}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    // other routes ===============================================================

    app.get('/searchresults', (req, res) => {
      db.collection('professional-user').save({salonname: req.body.nameofsalon, role: req.body.role}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/professionalprofilepage')
      })
    })

    app.get('/reviews', (req, res) => {
      db.collection('professional-user').save({salonname: req.body.nameofsalon, role: req.body.role}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/professionalprofilepage')
      })
    })


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
