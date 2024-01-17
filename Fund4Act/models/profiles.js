const { Database } = require("bun:sqlite");
const db = new Database("fund4act.sqlite");

module.exports.init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    display_name TEXT DEFAULT "",
    email TEXT,
    logo_url TEXT,
    website_url TEXT,
    mission TEXT,
    previous_actions TEXT,
    previous_grants TEXT,
    partnerships TEXT,
    constitution_url TEXT,
    climate_action_plan_url TEXT,
    verified INTEGER DEFAULT 0,
    slug TEXT NOT_NULL
  )`);
};

module.exports.saveProfileInfo = ({id, displayName, slug}) => {
  return db.run(`INSERT INTO profiles
      (id, display_name, slug)
    VALUES ("${id}", "${displayName}", "${slug}")
    ON CONFLICT(id) DO UPDATE SET
      display_name = excluded.display_name;
  `);
};

module.exports.getProfileInfo = (id) => {
  const query = db.query('SELECT display_name, slug, email FROM profiles WHERE id = $id;');
  return query.get({ $id: id });
}

module.exports.saveOrgInfo = ({id, email, logoUrl, websiteUrl, mission, prevActions, prevGrants, partnerships,
  constitutionUrl, climateActionPlanUrl}) => {
  return db.run(`INSERT INTO profiles
      (id, email, logo_url, website_url, mission, previous_actions, previous_grants, partnerships,
      constitution_url, climate_action_plan_url)
    VALUES ("${id}", "${email}", "${logoUrl}", "${websiteUrl}", "${mission}", "${prevActions}",
      "${prevGrants}", "${partnerships}", "${constitutionUrl}", "${climateActionPlanUrl}")
    ON CONFLICT(id) DO UPDATE SET
      email = excluded.email, logo_url = excluded.logo_url, website_url = excluded.website_url,
      mission = excluded.mission, previous_actions = excluded.previous_actions, previous_grants = excluded.previous_grants,
      partnerships = excluded.partnerships, constitution_url = excluded.constitution_url,
      climate_action_plan_url = excluded.climate_action_plan_url;
  `);
};

module.exports.updateVerifiedById = (id) => {
  return db.run(`INSERT INTO profiles
      (id, verified)
    VALUES ("${id}", 1)
    ON CONFLICT(id) DO UPDATE SET
      verified = excluded.verified;`);
};

module.exports.get = (id) => {
  const query = db.query('SELECT * FROM profiles WHERE id = $id;');
  return query.get({ $id: id });
}

module.exports.getBySlug = (slug) => {
  const query = db.query('SELECT * FROM profiles WHERE slug = $slug;');
  return query.get({ $slug: slug });
}
