const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/', function(req, res) {
    if (req.session.membership == 'Admin')
        return res.render('post/Add', { viewTitle: 'Add Post' })
    else
        return res.redirect('/dev/post/list')
})

router.post('/add', async function(req, res) {
    let data = JSON.stringify(req.body)
    if (req.session.membership == 'Admin') {
        await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/post/insertpost', data, {})
            .then(function(payload) {
                if (payload.data[1].message == 'Success') {
                    return res.redirect('/dev/post/list')
                } else {
                    return res.send("FAILED")
                }
            })
            .catch(function(error) {
                throw error
            })
    } else {
        return res.redirect('/dev/home')

    }
})

router.get('/list', async function(req, res) {
    if (req.session.membership == 'Admin') {
        checkrole = true
    } else {
        checkrole = false
    }
    let params = {
        member: req.session.membership
    }
    await axios.get('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/post/getpostlist', { params })
        .then(function(payload) {
            if (payload.data.length > 1) {
                return res.render('post/list', { list: payload.data, admin: checkrole })
            }
        })
        .catch(function(error) {
            throw error
        })
})

router.get('/detail/:id', async function(req, res) {

    let { id } = req.params
    let params = {
        id: id
    }
    await axios.get('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/post/getsinglepost', { params })
        .then(function(payload) {
            if (req.session.membership == 'Admin')
                return res.render('post/detail', { viewTitle: 'Post Detail', post: payload.data[0], body: payload.data[0].Body, admin: true })
            else
                return res.render('post/detail', { viewTitle: 'Post Detail', post: payload.data[0], body: payload.data[0].Body, admin: false })
        })
        .catch(function(error) {
            throw error
        })
})

router.get('/edit/:id', async function(req, res) {
    let { id } = req.params
    let params = {
        id: id
    }
    await axios.get('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/post/getsinglepost', { params })
        .then(function(payload) {
            if (req.session.membership == 'Admin')
                return res.render('post/Edit', { viewTitle: 'Edit Post', post: payload.data[0], body: payload.data[0].Body })
            else
                return res.redirect('/dev/home')
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
    let data = JSON.stringify(req.body)
    if (req.session.membership == 'Admin') {
        await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/post/updatepost', data, { params })
            .then(function(payload) {
                return res.redirect('/dev/post/list')
            })
            .catch(function(error) {
                throw error
            })
    } else
        return res.redirect('/dev/home')
})

router.post('/delete/:id', async function(req, res) {
    let { id } = req.params
    if (req.session.membership == 'Admin') {
        let params = {
            id: id
        }
        await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/post/destroypost', {}, { params })
            .then(function(payload) {
                return res.redirect('/dev/post/list')
            })
            .catch(function(error) {
                throw error
            })
    } else {
        return res.redirect('/dev/home')
    }
})

module.exports = router