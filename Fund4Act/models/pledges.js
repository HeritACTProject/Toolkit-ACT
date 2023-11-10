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
  console.log("hello");
  return db.run(`INSERT INTO pledges
    ( proj_slug, donor_id, amount, date)
    VALUES ("${proj_slug}", "${donor_id}", "${amount}", date('now'))
  `);
};

module.exports.getByProjectSlug = (slug) => {
  const query = db.query(`SELECT * FROM pledges WHERE proj_slug = $slug
    ORDER BY date DESC, amount DESC;`);
  const results = query.all({ $slug: slug });
  return results;
}

module.exports.getByProjectSlugWithDonorInfo = (slug) => {
  const query = db.query(`SELECT amount, date, organisations.name AS donor_name, donor_id FROM pledges INNER JOIN organisations ON pledges.donor_id = organisations.id WHERE proj_slug = $slug
    ORDER BY date DESC, amount DESC;`);
  const results = query.all({ $slug: slug });
  return results;
}

module.exports.getXMostRecentByProjectSlug = (slug, x) => {
  const query = db.query(`SELECT * FROM pledges WHERE proj_slug = $slug
    ORDER BY date DESC LIMIT $limit;`);
  const results = query.all({ $slug: slug, $limit: x });
  return results;
}

module.exports.getByDonorId = (donor_id) => {
  const query = db.query(`SELECT amount, date, projects.name AS project_name, proj_slug FROM pledges INNER JOIN projects ON pledges.proj_slug = projects.slug WHERE donor_id = $donor_id
    ORDER BY date DESC, amount DESC;`);
  const results = query.all({ $donor_id: donor_id });
  return results;
}
