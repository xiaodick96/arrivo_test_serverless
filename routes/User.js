const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/', function(req, res) {
    if (req.session.membership == 'Admin')
        return res.render('user/Add', { viewTitle: 'Add User' })
    else
        return res.redirect('/dev/home')
})

router.post('/add', async function(req, res) {
    if (req.session.membership == 'Admin') {
        let data = JSON.stringify(req.body)
        await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/insertuser', data, {})
            .then(function(payload) {
                if (payload.data.length > 1) {
                    if (payload.data[1].message == 'Success') {
                        if (req.session.membership == 'Admin')
                            return res.redirect('/dev/user/list')
                        else
                            return res.redirect('/dev/home')
                    } else {
                        console.log('SAME USER LAH')
                        return res.redirect('/dev/user')
                    }
                } else {
                    req.session.message = payload.data[0].message
                    return res.redirect('/dev/')
                }
            })
            .catch(function(error) {
                throw error
            })
    } else
        return res.redirect('/dev/home')
})

router.get('/list', async function(req, res) {
    if (req.session.membership == 'Admin') {
        await axios.get('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/getuserlist', {})
            .then(function(payload) {
                if (payload.data.length > 1) {
                    return res.render('user/list', { list: payload.data, admin: true })
                }
            })
            .catch(function(error) {
                throw error
            })
    } else {
        return res.redirect('/dev/home')
    }
})

router.get('/:id', async function(req, res) {
    if (req.session.authlogin) {
        let { id } = req.params;
        let params = {
            id: id
        }
        await axios.get('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/getsingleuser', { params })
            .then(function(payload) {
                if (req.session.membership == 'Admin') {
                    admin = true
                } else {
                    admin = false
                }
                if (payload.data[0].Membership == 'Normal') {
                    normal = true
                } else {
                    normal = false
                }
                res.render('user/profile', { viewTitle: 'User Profile', user: payload.data[0], member: normal, adminrole: admin })
            })
            .catch(function(error) {
                throw error
            })
    } else {
        return res.redirect('/dev/loginpage')
    }
})

router.get('/edit/:id', async function(req, res) {
    let { id } = req.params
    let params = {
        id: id
    }
    await axios.get('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/getsingleuser', { params })
        .then(function(payload) {
            if (req.session.membership == 'Admin')
                res.render('user/Edit', { viewTitle: 'Edit User', user: payload.data[0], admin: true })
            else
                res.render('user/Edit', { viewTitle: 'Edit User', user: payload.data[0], admin: false })
        })
        .catch(function(error) {
            throw error
        })
})

router.post('/edit/:id', async function(req, res) {
    let { id } = req.params
    let params = {
        id: id
    }
    if (req.params.id == req.session.userid || req.session.membership == 'Admin') {
        let data = JSON.stringify(req.body)
        if (req.params.id == req.session.userid) {
            req.session.membership = req.body.Membership
        }
        await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/updateuser', data, { params })
            .then(function(payload) {
                if (payload.data.length > 1) {
                    if (payload.data[1].message == 'Success') {
                        if (req.session.membership == 'Admin')
                            return res.redirect('/dev/user/list')
                        else
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
    } else {
        return res.redirect('/dev/home')
    }
})

router.post('/delete/:id', async function(req, res) {
    let { id } = req.params
    if (req.session.membership == 'Admin') {
        let params = {
            id: id
        }
        await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/destroyuser', {}, { params })
            .then(function(payload) {
                return res.redirect('/dev/user/list')
            })
            .catch(function(error) {
                throw error
            })
    } else {
        return res.redirect('/dev/home')
    }
})

module.exports = router