const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/', function(req, res) {
    if (req.session.login) {
        return res.redirect('/dev/home')
    } else if (req.oidc.isAuthenticated()) {
        return res.redirect('/dev/home')
    } else {
        return res.render('home/login')
    }
})

router.get('/newUserfromAuth0', function(req, res) {
    return res.render('home/auth0newuser', { viewTitle: 'Welcome to our webiste!', email: req.oidc.user.name })
})

router.post('/addnewauthuser', async function(req, res) {
    let data = JSON.stringify(req.body)
    await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/addnewauthuser', data, {})
        .then(function(payload) {
            if (payload.data.length > 1) {
                if (payload.data[1].message == 'Success') {
                    req.session.userid = payload.data[0].insertId
                    return res.redirect('/dev/user/edit/' + req.session.userid)
                } else {
                    req.session.message = payload.data[1].message
                    return res.redirect('/dev/newUserfromAuth0')
                }
            } else {
                return res.redirect('/dev/')
            }
        })
        .catch(function(error) {
            throw error
        })
})

router.post('/loginform', async function(req, res) {
    let data = JSON.stringify(req.body)
    await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/login', data, {})
        .then(function(payload) {
            if (payload.data.length > 1) {
                if (payload.data[1].message == 'Success') {
                    req.session.message = payload.data[1].message
                    req.session.login = true
                    req.session.authlogin = true
                    req.session.user = payload.data[0].Username
                    req.session.userid = payload.data[0].UserID
                    req.session.membership = payload.data[0].Membership
                    return res.redirect('/dev/home')
                }
            } else {
                req.session.message = payload.data[0].message
                return res.redirect('/dev/')
            }
        })
        .catch(function(error) {
            throw error
        })
})

router.get('/home', async function(req, res) {
    if (req.session.message == 'Failed') {
        return res.redirect('/dev/')
    } else {
        if (req.oidc.isAuthenticated() || req.session.login) {
            if (!req.session.authlogin) {
                let params = {
                    email: req.oidc.user.name
                }
                await axios.get('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/getuserbyemail', { params })
                    .then(function(payload) {
                        if (payload.data.length > 1) {
                            req.session.authlogin = true
                            req.session.user = payload.data[0].Username
                            req.session.membership = payload.data[0].Membership
                            req.session.userid = payload.data[0].UserID
                            res.redirect('/dev/home')
                        } else {
                            return res.render('home/auth0newuser', { viewTitle: 'Welcome to our webiste!', email: req.oidc.user.name })
                        }
                    })
                    .catch(function(error) {
                        throw error
                    })
            } else {
                let params = {
                    username: req.session.user
                }
                await axios.get('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/getuserbyusername', { params })
                    .then(function(payload) {
                        if (payload.data.length > 1) {
                            req.session.membership = payload.data[0].Membership
                            if (req.session.membership == 'Admin') {
                                member = true
                            } else {
                                member = false
                            }
                            if (req.oidc.isAuthenticated()) {
                                auth0 = true
                            } else {
                                auth0 = false
                            }
                            return res.render('home/index', { user: payload.data[0].FullName, status: auth0, admin: member, id: payload.data[0].UserID })
                        }
                    })
                    .catch(function(error) {
                        throw error
                    })
            }
        } else {
            return res.redirect('/dev/')
        }
    }

})

router.post('/logout', function(req, res) {
    req.session.destroy()
    return res.redirect('/dev/')
})

module.exports = router