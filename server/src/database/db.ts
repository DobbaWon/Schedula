import sql from 'mssql/msnodesqlv8';

const config: sql.config = {
  server: 'LAPTOP-71H5ONUA',
  database: 'Schedula',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed!', err);
    throw err;
  });
