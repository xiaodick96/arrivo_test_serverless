const awsServerlessExpress = require('aws-serverless-express')
const app = require('./index')
const server = awsServerlessExpress.createServer(app)
const mysql = require('mysql2')
const crypto = require('crypto')
const { param } = require('./index')

const con = mysql.createConnection({
    host: process.env.RDB_DB_HOST,
    port: process.env.RDB_DB_PORT,
    user: process.env.RDB_DB_USER,
    password: process.env.RDB_DB_PASSWORD,
    database: process.env.RDB_DB_DATABASE
})

con.connect(function(err) {
    if (err) {
        throw err
    } else {
        console.log('Database is connected successfully')
    }
})

require('dotenv').config()

exports.createserver = (event, context) => {
    return awsServerlessExpress.proxy(server, event, context)
}

//post method: search database by username and password
exports.acceptlogindata = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)

            const hash = crypto
                .createHash('sha256')
                .update(body.Password)
                .digest('hex')

            let sql = `SELECT * from User where Username = ` + con.escape(body.Username) + ` and Password = ` + con.escape(hash) + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    resolve(data)
                }
            })
        })
        let pushdata = {}
        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//get method: search database by email
exports.getuserbyemail = async(event) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let params = event.queryStringParameters.email

            let checksql = `SELECT * FROM User WHERE Email = ` + con.escape(params) + `;`
            con.query(checksql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    resolve(data)
                }
            })
        })
        let pushdata = {}
        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//get method: search database by username
exports.getuserbyusername = async(event) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let params = event.queryStringParameters.username

            let checksql = `SELECT * FROM User WHERE Username = ` + con.escape(params) + `;`
            con.query(checksql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    resolve(data)
                }
            })
        })
        let pushdata = {}
        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: insert auth user to database
exports.addnewauthuser = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)

            const hash = crypto
                .createHash('sha256')
                .update(body.Password)
                .digest('hex')

            let checksql = `SELECT * FROM User WHERE Username = ` + con.escape(body.Username) + `;`
            con.query(checksql, function(err, check) {
                if (err) {
                    throw err
                } else {
                    if (check.length > 0) {
                        let msg = [{
                            "alert": "Username exist"
                        }]
                        resolve(msg)
                    } else {
                        let sql = `INSERT INTO User SET Username = ` + con.escape(body.Username) + `, Password = ` + con.escape(hash) + `, Email = ` + con.escape(body.Email) + `, Membership = 'Normal';`
                        con.query(sql, function(err, data) {
                            if (err) {
                                throw err
                            } else {
                                let saveid = data.insertId
                                let passdata = [{
                                    "insertID": saveid
                                }]
                                resolve(passdata)
                            }
                        })
                    }
                }
            })
        })
        let pushdata = {}

        if (data.length > 0) {
            if (data[0].alert) {
                pushdata = {
                    "message": "Username exist"
                }
            } else {
                pushdata = {
                    "message": "Success"
                }
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//get method: get user list from database
exports.getuserlist = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let sql = `SELECT * from User;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    resolve(data)
                }
            })
        })
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//get method: get user from database
exports.getsingleuser = async(event, context) => {
    try {
        let params = event.queryStringParameters.id
        const data = await new Promise((resolve, reject) => {
            let sql = `SELECT * from User WHERE UserID = ` + params + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    resolve(data)
                }
            })
        })
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: edit user from database
exports.updateuser = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)
            let params = event.queryStringParameters.id

            if (body.Password) {
                const hash = crypto
                    .createHash('sha256')
                    .update(body.Password)
                    .digest('hex')
                let sql = `UPDATE User SET Username = ` + con.escape(body.Username) + `, Password = ` + con.escape(hash) + `, Email = ` + con.escape(body.Email) + `, FullName = ` + con.escape(body.FullName) + `, Membership = ` + con.escape(body.Membership) + `, UpdatedAt = ` + con.escape(new Date()) + ` WHERE UserID = ` + params + `;`
                con.query(sql, function(err, data) {
                    if (err) {
                        throw err
                    } else {
                        let msg = [{
                            "alert": "Edited"
                        }]
                        resolve(msg)
                    }
                })
            } else {
                let sql = `UPDATE User SET Username = ` + con.escape(body.Username) + `, Email = ` + con.escape(body.Email) + `, FullName = ` + con.escape(body.FullName) + `, Membership = ` + con.escape(body.Membership) + `, UpdatedAt = ` + con.escape(new Date()) + ` WHERE UserID = ` + params + `;`
                con.query(sql, function(err, data) {
                    if (err) {
                        throw err
                    } else {
                        let msg = [{
                            "alert": "Edited"
                        }]
                        resolve(msg)
                    }
                })
            }
        })
        let pushdata = {}

        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: edit user from database
exports.updateusermembership = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)
            let sql = `UPDATE User SET Membership = 'Premium', UpdatedAt = ` + con.escape(new Date()) + ` WHERE UserID = ` + body[0].UserID + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    let msg = [{
                        "alert": "Edited"
                    }]
                    resolve(msg)
                }
            })
        })
        let pushdata = {}

        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: insert user to database
exports.insertuser = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)

            const hash = crypto
                .createHash('sha256')
                .update(body.Password)
                .digest('hex')

            let checksql = `SELECT * FROM User WHERE Username = ` + con.escape(body.Username) + `;`
            con.query(checksql, function(err, check) {
                if (err) {
                    throw err
                } else {
                    if (check.length > 0) {
                        let msg = [{
                            "alert": "Username / Email Exist"
                        }]
                        resolve(msg)
                    } else {
                        let sql = `INSERT INTO User SET Username = ` + con.escape(body.Username) + `, Password = ` + con.escape(hash) + `, Email = ` + con.escape(body.Email) + `, Membership = 'Normal', FullName = ` + con.escape(body.FullName) + `;`
                        con.query(sql, function(err, data) {
                            if (err) {
                                throw err
                            } else {
                                let saveid = data.insertId
                                let passdata = [{
                                    "insertID": saveid
                                }]
                                resolve(passdata)
                            }
                        })
                    }
                }
            })
        })
        let pushdata = {}

        if (data.length > 0) {
            if (data[0].alert) {
                pushdata = {
                    "message": "Username / Email Exist"
                }
            } else {
                pushdata = {
                    "message": "Success"
                }
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: destroy user from database
exports.destroyuser = async(event, context) => {
    try {
        let params = event.queryStringParameters.id
        const data = await new Promise((resolve, reject) => {
            let sql = `DELETE FROM User WHERE UserID = ` + params + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    let msg = [{
                        "alert": "Deleted"
                    }]
                    resolve(msg)
                }
            })
        })
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: insert post to database
exports.insertpost = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)
            let sql = `INSERT INTO Post SET Title = ` + con.escape(body.Title) + `, Body = ` + con.escape(body.Body) + `, CategoryID = ` + con.escape(body.CategoryID) + `, Status = ` + con.escape(body.Status) + `, Label = ` + con.escape(body.Label) + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    let saveid = data.insertId
                    let passdata = [{
                        "insertID": saveid
                    }]
                    resolve(passdata)
                }
            })
        })
        let pushdata = {}

        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//get method: get post list from database
exports.getpostlist = async(event, context) => {
    try {
        let params = event.queryStringParameters.member
        const data = await new Promise((resolve, reject) => {
            if (params == 'Admin' || params == 'Premium') {
                let sql = `SELECT * from Post;`
                con.query(sql, function(err, data) {
                    if (err) {
                        throw err
                    } else {
                        resolve(data)
                    }
                })
            } else {
                let sql = `SELECT * from Post WHERE Label = 'Normal';`
                con.query(sql, function(err, data) {
                    if (err) {
                        throw err
                    } else {
                        resolve(data)
                    }
                })

            }
        })
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//get method: get post from database
exports.getsinglepost = async(event, context) => {
    try {
        let params = event.queryStringParameters.id
        const data = await new Promise((resolve, reject) => {
            let sql = `SELECT * from Post WHERE PostID = ` + params + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    resolve(data)
                }
            })
        })
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: edit post from database
exports.updatepost = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)
            let params = event.queryStringParameters.id
            let sql = `UPDATE Post SET Title = ` + con.escape(body.Title) + `, Body = ` + con.escape(body.Body) + `, CategoryID = ` + body.CategoryID + `, Status = ` + con.escape(body.Status) + `, Label = ` + con.escape(body.Label) + `, UpdatedAt = ` + con.escape(new Date()) + ` WHERE PostID = ` + params + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    let msg = [{
                        "alert": "Edited"
                    }]
                    resolve(msg)
                }
            })
        })
        let pushdata = {}

        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: destroy post from database
exports.destroypost = async(event, context) => {
    try {
        let params = event.queryStringParameters.id
        const data = await new Promise((resolve, reject) => {
            let sql = `DELETE FROM Post WHERE PostID = ` + params + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    let msg = [{
                        "alert": "Deleted"
                    }]
                    resolve(msg)
                }
            })
        })
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: insert category to database
exports.insertcategory = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)
            let sql = `INSERT INTO Category SET Name = ` + con.escape(body.Name) + `, Description = ` + con.escape(body.Description) + `, Activated = ` + con.escape(body.Activated) + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    let saveid = data.insertId
                    let passdata = [{
                        "insertID": saveid
                    }]
                    resolve(passdata)
                }
            })
        })
        let pushdata = {}

        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//get method: get category list from database
exports.getcategorylist = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let sql = `SELECT * from Category;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    resolve(data)
                }
            })
        })
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//get method: get category from database
exports.getsinglecategory = async(event, context) => {
    try {
        let params = event.queryStringParameters.id
        const data = await new Promise((resolve, reject) => {
            let sql = `SELECT * from Category WHERE CategoryID = ` + params + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    resolve(data)
                }
            })
        })
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: edit category from database
exports.updatecategory = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)
            let params = event.queryStringParameters.id
            let sql = `UPDATE Category SET Name = ` + con.escape(body.Name) + `, Description = ` + con.escape(body.Description) + `, Activated = ` + con.escape(body.Activated) + `, UpdatedAt = ` + con.escape(new Date()) + ` WHERE CategoryID = ` + params + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    let msg = [{
                        "alert": "Edited"
                    }]
                    resolve(msg)
                }
            })
        })
        let pushdata = {}

        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: destroy category from database
exports.destroycategory = async(event, context) => {
    try {
        let params = event.queryStringParameters.id
        const data = await new Promise((resolve, reject) => {
            let sql = `DELETE FROM Category WHERE CategoryID = ` + params + `;`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    let msg = [{
                        "alert": "Deleted"
                    }]
                    resolve(msg)
                }
            })
        })
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: create payment to database
exports.createpremiumbill = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)
            let price = ''
            if ((body[0].Amount % 100) == 0) {
                price = 'RM' + (body[0].Amount / 100) + '.00'
            } else {
                price = 'RM' + (body[0].Amount / 100)
                if (price.length != 6) {
                    price = price + '0'
                }
            }
            let sql = `INSERT INTO Payment SET PaymentID = ` + con.escape(body[0].PaymentID) + `, Amount = ` + con.escape(price) + `, Status = 'due';`
            con.query(sql, function(err, data) {
                if (err) {
                    throw err
                } else {
                    let saveid = data.insertId
                    let passdata = [{
                        "insertID": saveid
                    }]
                    resolve(passdata)
                }
            })
        })
        let pushdata = {}

        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}

//post method: update payment status to database
exports.updatepaymentstatus = async(event, context) => {
    try {
        const data = await new Promise((resolve, reject) => {
            let body = JSON.parse(event.body)
            if (body[0].Status == 'true') {
                let payment_methods = JSON.stringify(body[1].payment_methods)
                let status = 'paid'
                let sql = `UPDATE Payment SET Status = ` + con.escape(status) + `, PaymentMethod = ` + con.escape(payment_methods) + `, UpdatedAt = ` + con.escape(new Date()) + ` WHERE PaymentID = ` + con.escape(body[0].PaymentID) + `;`
                con.query(sql, function(err, data) {
                    if (err) {
                        throw err
                    } else {
                        let msg = [{
                            "alert": "Edited"
                        }]
                        resolve(msg)
                    }
                })
            } else {
                let sql = `UPDATE Payment SET UpdatedAt = ` + con.escape(new Date()) + ` WHERE PaymentID = ` + con.escape(body[0].PaymentID) + `;`
                con.query(sql, function(err, data) {
                    if (err) {
                        throw err
                    } else {
                        let msg = [{
                            "alert": "Edited"
                        }]
                        resolve(msg)
                    }
                })
            }

        })
        let pushdata = {}

        if (data.length > 0) {
            pushdata = {
                "message": "Success"
            }
        } else {
            pushdata = {
                "message": "Failed"
            }
        }
        let finaldata = data.push(pushdata)
        let response = {
            statusCode: 200,
            body: JSON.stringify(data),
        }
        return response
    } catch (err) {
        return {
            statusCode: 404,
            message: 'Login Failed'
        }
    }
}