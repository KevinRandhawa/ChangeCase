var app = require('./server.js');
var db = app.get('db');

module.exports = {
    respond: (req, res, next) => {
        return res.json({
            "test": "is working"
        })
    },
    addWord: (req, res, next) => {

        console.log('\\A' + req.body.word + '\\Z');
        db.read_word(['\\A' + req.body.word + '\\Z', req.body.userId], function(err, res1) {
            if (err) {
                console.log('read_word error: ', err)
            }
            console.log('READ WORD: ', res1)
            if (res1.length === 0) {

                db.add_word([req.body.word, req.body.userId], function(err, res2) {
                    if (err) {
                        console.log('add_word error: ', err)
                    }
                    console.log('ADDED WORD: ', res2)

                    db.read_all([req.body.userId], function(err, all) {
                        return res.json({
                            "status": req.body.word + " has been added to the database",
                            "list": all
                        })
                    })
                });
            } else {
                db.read_all([req.body.userId], function(err, all) {
                    return res.json({
                        "status": res1[0].word + " is already in the database",
                        "list": all
                    })
                })
            }
        })
    },
    removeWord: (req, res, next) => {
        db.delete_word([req.body.word, req.body.userId], (err, resp) => {
            if (err) {
                console.log('Error at removeWord in Ctrl:', err)
            }
            console.log('Response from delete_word: ', resp)
            db.read_all([req.body.userId], (err, list) => {
                return res.json({
                    list
                })
            })
        })
    }
}
