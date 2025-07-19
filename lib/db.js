import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  }
});

db.connect().then(function (response) {
  console.log("Database Connected");
}).catch(function (error) {
  console.log(error);
});

export default async function executeQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    // await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}