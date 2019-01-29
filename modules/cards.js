module.exports = {
  init: function(app, tools, losDB) {
    app.get('/cards/getAll', function(req, res) {
      losDB
        .collection('Cards')
        .find({})
        .toArray(function(err, result) {
          if (err != null) {
            tools.sendError(res, 'Error reaching mongo');
          } else {
            tools.sendData(res, result, req, losDB, false);
          }
        });
    });
    var fs = require('fs')
    let rawdata = fs.readFileSync('./modules/champion.json');
    var champions = JSON.parse(rawdata);

    app.get('/cards/init', function (req, res) {

      for (let card of champions) {
        losDB
          .collection('Cards')
          .findOne({ key: card.key }, function(err, document) {
            if (err) {
              tools.sendError(res, 'Error during reaching MongoDB : ' + err);
            } else if (document) {
              // tools.sendError(res, 'User already exists');
              console.log(`${card.key} already exist in the db.`);
            } else {
              // console.log(card);
              losDB
                .collection('Cards')
                .insertOne(card, function(err, resp) {
                  if (err !== null) {
                    return tools.sendError(
                      res,
                      'Error during inserting a user : ' + err
                    );
                  }
                });
            }
          });
      }
      tools.sendData(res, "ok", req, losDB, false);
      console.log("ok")
    });
  }
};
