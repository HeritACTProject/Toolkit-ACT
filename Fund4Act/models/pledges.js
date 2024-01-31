const { Database } = require("bun:sqlite");
const db = new Database("fund4act.sqlite");

module.exports.init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS pledges(
    id INTEGER PRIMARY KEY NOT NULL,
    proj_slug TEXT NOT NULL,
    donor_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    date TEXT NOT NULL
  )`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_pledge_proj_slug
    ON pledges (proj_slug);
  `);
};

module.exports.create = ({proj_slug, donor_id, amount}) => {
  return db.run(`INSERT INTO pledges
    ( proj_slug, donor_id, amount, date)
    VALUES ("${proj_slug}", "${donor_id}", "${amount}", date('now'))
  `);
};

module.exports.getByActionSlug = (slug) => {
  const query = db.query(`SELECT * FROM pledges WHERE proj_slug = $slug
    ORDER BY date DESC, amount DESC;`);
  const results = query.all({ $slug: slug });
  return results;
}

module.exports.getByActionSlugWithDonorInfo = (slug) => {
  const query = db.query(`SELECT amount, date, profiles.display_name AS donor_name,
    donor_id, profiles.slug AS donor_slug FROM pledges INNER JOIN profiles ON pledges.donor_id = profiles.id WHERE proj_slug = $slug
    ORDER BY date DESC, amount DESC;`);
  const results = query.all({ $slug: slug });
  return results;
}

module.exports.getXMostRecentByActionSlug = (slug, x) => {
  const query = db.query(`SELECT * FROM pledges WHERE proj_slug = $slug
    ORDER BY date DESC LIMIT $limit;`);
  const results = query.all({ $slug: slug, $limit: x });
  return results;
}

module.exports.getByDonorId = (donor_id) => {
  const query = db.query(`SELECT amount, date, actions.name AS action_name,
    proj_slug FROM pledges INNER JOIN actions ON pledges.proj_slug = actions.slug WHERE donor_id = $donor_id
    ORDER BY date DESC, amount DESC;
    LIMIT 3`);
  const results = query.all({ $donor_id: donor_id });
  return results;
}

module.exports.getPage = (offset) => {
  const query = db.query(`SELECT pledges.id AS pledge_id, amount, date, profiles.display_name AS donor_name,
  donor_id, profiles.slug AS donor_slug FROM pledges INNER JOIN profiles ON pledges.donor_id = profiles.id
    LIMIT 11
    OFFSET ${offset};
  `);
  const results = query.all();

  const lastValue = results?.at(-1)?.pledge_id

  return {results, lastValue};
}

module.exports.getPageForAction = (offset, actionSlug) => {
  const query = db.query(`SELECT pledges.id AS pledge_id, amount, date, profiles.display_name AS donor_name,
  donor_id, profiles.slug AS donor_slug FROM pledges INNER JOIN profiles ON pledges.donor_id = profiles.id
    WHERE proj_slug = "${actionSlug}"
    LIMIT 11
    OFFSET ${offset};
  `);
  const results = query.all();

  const lastValue = results?.at(-1)?.pledge_id

  return {results, lastValue};
}
