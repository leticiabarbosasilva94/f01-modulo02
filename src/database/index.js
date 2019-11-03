import Sequelize from "sequelize";
import databaseConfig from "../config/database";
import User from "../app/models/User";

const models = [User];

class Databse {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.forEach(model => model.init(this.connection));
  }
}

export default new Databse();
