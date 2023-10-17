const { Database } = require("bun:sqlite");
const db = new Database("fund4act.sqlite");

module.exports.init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS organisation (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    logo_url TEXT,
    website_url TEXT,
    mission TEXT NOT NULL,
    previous_projects TEXT,
    previous_grants TEXT,
    partnerships TEXT
  )`);
};

module.exports.save = ({id, name, email, logoUrl, websiteUrl, mission, prevProjects, prevGrants, partnerships}) => {
  return db.run(`INSERT INTO organisation
    (id, name, email, logo_url, website_url, mission, previous_projects, previous_grants, partnerships)
    VALUES ("${id}", "${name}", "${email}", "${logoUrl}", "${websiteUrl}", "${mission}", "${prevProjects}", "${prevGrants}", "${partnerships}")
  `);
};

module.exports.get = () => {
  return db.query('SELECT * FROM organisation').all();
}
