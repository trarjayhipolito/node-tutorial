exports.DbConnectionError = function (req, res) {
    var resp = {status: '500', Trees: [], message: 'Unable to connect in database.'}
    res.send(resp)
  }
  