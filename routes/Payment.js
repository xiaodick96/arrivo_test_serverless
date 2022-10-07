const express = require('express')
const router = express.Router()
const Billplz = require('billplz')
const axios = require('axios')

const billplz = new Billplz({
    'key': process.env.BILLPLZ_KEY,
    'endpoint': process.env.BILLPLZ_ENDPOINT,
    'sandbox': true
})

router.get('/createpremiumbill/:id', async function(req, res) {

    let { id } = req.params
    let params = {
        id: id
    }
    await axios.get('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/getsingleuser', { params })
        .then(function(payload) {
            createbill(payload.data[0].FullName, payload.data[0].Email, function(callback) {
                req.session.premiumuserid = id
                return res.redirect(callback)
            })
        })
        .catch(function(error) {
            throw error
        })
})

router.get('/finishpay', function(req, res) {
    if (req.query.billplz.paid == 'true') {
        getMethod(async function(methods) {
            let data = [{
                'PaymentID': req.query.billplz.id,
                'Status': req.query.billplz.paid
            }]
            let pushdata = data.push(methods)
            await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/payment/updatepaymentstatus', data, {})
                .then(async function(payload) {
                    let dataid = [{
                        'UserID': req.session.premiumuserid
                    }]
                    await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/user/updateusermembership', dataid, {})
                        .then(function(payload) {
                            return res.redirect('/dev/user/' + req.session.premiumuserid)
                        })
                        .catch(function(error) {
                            throw error
                        })
                })
                .catch(function(error) {
                    throw error
                })
        })
    } else {
        return res.send('your pay is failed')
    }
})

function createbill(user, email, callback) {
    billplz.create_bill({
        'collection_id': 'iifvvmbg',
        'description': 'Testing for Premium Member',
        'email': email,
        'name': user,
        'amount': 135, //RM5.50
        'reference_1_label': "Testing",
        'reference_1': "Arrivo",
        'callback_url': "https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/payment/",
        'redirect_url': "https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/payment/finishpay",
        'due_at': new Date()
    }, async function(err, res) {
        let inputdata = [{
            "PaymentID": res.id,
            "Amount": res.amount
        }]
        data = JSON.stringify(inputdata)
        await axios.post('https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/payment/createpremiumbill', inputdata, {})
            .then(function(payload) {
                paymenturl = res.url
                return callback(paymenturl)
            })
            .catch(function(error) {
                throw error
            })
    })
}

function getMethod(callback) {
    let config = {
        headers: { 'Authorization': 'Basic ' + Buffer.from(process.env.BILLPLZ_KEY).toString('base64') }
    }
    axios.get('https://www.billplz-sandbox.com/api/v3/collections/iifvvmbg/payment_methods', config)
        .then(function(payload) {
            return callback(payload.data)
        })
        .catch(function(error) {
            throw error
        })
}

module.exports = router