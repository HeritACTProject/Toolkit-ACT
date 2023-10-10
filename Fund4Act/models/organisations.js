const { Database } = require("bun:sqlite");
const db = new Database("fund4act.sqlite");

module.exports.init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS organisation (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    registered_office_address TEXT NOT NULL,
    imageURL TEXT,
    primary_point_of_contact_name TEXT NOT NULL,
    primary_point_of_contact_role TEXT NOT NULL,
    primary_point_of_contact_email TEXT NOT NULL,
    primary_point_of_contact_phone TEXT NOT NULL,
    secondary_point_of_contact_name TEXT,
    secondary_point_of_contact_role TEXT,
    secondary_point_of_contact_email TEXT,
    secondary_point_of_contact_phone TEXT,
    registration_number TEXT,
    mission TEXT NOT NULL,
    constitution TEXT NOT NULL,
    registered_bank_account TEXT NOT NULL,
    previous_projects TEXT,
    previous_grants TEXT,
    partnerships_and_collaborators TEXT,
    climate_action_plan TEXT
  )`);
};

module.exports.save = async () => {
  await db.run(`INSERT INTO organisation
    (id, name, registered_office_address, primary_point_of_contact_name, primary_point_of_contact_role, primary_point_of_contact_email, primary_point_of_contact_phone,
    mission, constitution, registered_bank_account)
    VALUES ("1235", "sprout", "french", "jesse", "big boss", "bigboss@sprout.site", "90343433", "important stuff and save the world", "do no evil", "its just resting in my bank account")
  `);
};

module.exports.get = () => {
  return db.query('SELECT * FROM organisation').all();
}
