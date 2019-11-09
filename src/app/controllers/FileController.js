const File = require('../models/File');

class FileController {
  async store(req, res) {
    await File.create({
      name: 'bla',
      path: 'ble'
    });
    res.json(req.file);
  }
}

export default new FileController();
