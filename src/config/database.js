module.exports = {
  dialect: 'mariadb',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  },
  dialectOptions: {
    timezone: process.env.TZ
  },
  timezone: process.env.TZ
};
