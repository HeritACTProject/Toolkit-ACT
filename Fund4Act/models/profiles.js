const { Database } = require("bun:sqlite");
const db = new Database("fund4act.sqlite");

module.exports.init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    display_name TEXT DEFAULT "",
    organisation_name TEXT,
    email TEXT,
    logo_url TEXT,
    website_url TEXT,
    mission TEXT NOT NULL,
    previous_actions TEXT,
    previous_grants TEXT,
    partnerships TEXT,
    constitution_url TEXT,
    climate_action_plan_url TEXT,
    verified INTEGER DEFAULT 0
  )`);
};

module.exports.saveProfileInfo = ({id, displayName}) => {
  return db.run(`INSERT INTO profiles
      (id, display_name)
    VALUES ("${id}", "${organisation_name}")
    ON CONFLICT(id) DO UPDATE SET
      display_name = excluded.display_name;
  `);
};

module.exports.getProfileInfo = (id) => {
  const query = db.query('SELECT display_name FROM profiles WHERE id = $id;');
  return query.get({ $id: id });
}

module.exports.saveOrgInfo = ({id, organisationName, email, logoUrl, websiteUrl, mission, prevActions, prevGrants, partnerships,
  constitutionUrl, climateActionPlanUrl}) => {
  return db.run(`INSERT INTO profiles
      (id, organisation_name, email, logo_url, website_url, mission, previous_actions, previous_grants, partnerships,
      constitution_url, climate_action_plan_url)
    VALUES ("${id}", "${organisationName}", "${email}", "${logoUrl}", "${websiteUrl}", "${mission}", "${prevActions}",
      "${prevGrants}", "${partnerships}", "${constitutionUrl}", "${climateActionPlanUrl}")
    ON CONFLICT(id) DO UPDATE SET
      organisation_name = excluded.organisation_name, email = excluded.email, logo_url = excluded.logo_url, website_url = excluded.website_url,
      mission = excluded.mission, previous_actions = excluded.previous_actions, previous_grants = excluded.previous_grants,
      partnerships = excluded.partnerships, constitution_url = excluded.constitution_url,
      climate_action_plan_url = excluded.climate_action_plan_url;
  `);
};

module.exports.get = (id) => {
  const query = db.query('SELECT * FROM profiles WHERE id = $id;');
  return query.get({ $id: id });
}
