module.exports = {
  dialect: 'mariadb',
  host: 'localhost',
  username: 'root',
  password: 'senha',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  },
  dialectOptions: {
    timezone: 'America/Sao_Paulo'
  },
  timezone: 'America/Sao_Paulo'
};
