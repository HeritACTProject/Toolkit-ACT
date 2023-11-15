const { Database } = require("bun:sqlite");
const db = new Database("fund4act.sqlite");

module.exports.init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS actions(
    id INTEGER PRIMARY KEY NOT NULL,
    org_id TEXT NOT NULL,
    name TEXT NOT NULL,
    fundraising_target DECIMAL NOT NULL,
    fundraising_deadline TEXT NOT NULL,
    image_url TEXT,
    address TEXT,
    latitude TEXT,
    longitude TEXT,
    overview TEXT,
    start_date TEXT,
    end_date TEXT,
    category TEXT,
    target_audience TEXT,
    slug TEXT NOT_NULL
  )`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_action_id
    ON actions (id);
  `);
  db.run(`CREATE INDEX IF NOT EXISTS idx_action_org_id
    ON actions (org_id);
  `);
};

module.exports.create = ({orgId, name, target, deadline, imageUrl, address, lat, lon, overview, startDate, endDate,
                        category, audience, slug}) => {
  return db.run(`INSERT INTO actions
    (org_id, name, fundraising_target, fundraising_deadline, image_url, address, latitude, longitude, overview, start_date, end_date,
      category, target_audience, slug)
    VALUES ("${orgId}", "${name}", "${target}", "${deadline}", "${imageUrl}", "${address}","${lat}","${lon}","${overview}",
      "${startDate}", "${endDate}", "${category}", "${audience}", "${slug}")
  `);
};

module.exports.update = ({id, name, target, deadline, imageUrl, overview, startDate, endDate,
                        category, audience}) => {
  return db.run(`UPDATE actions SET
    name = "${name}", fundraising_target = "${target}",
      fundraising_deadline = "${deadline}", image_url = "${imageUrl}", overview = "${overview}",
      start_date = "${startDate}", end_date = "${endDate}", category = "${category}",
      target_audience = "${audience}"
    WHERE id = "${id}"
  `);
};

module.exports.getByProfileId = (oid) => {
  const query = db.query('SELECT * FROM actions WHERE org_id = $oid;');
  const results = query.all({ $oid: oid });
  return results;
}

module.exports.getByActionSlug = (slug) => {
  const query = db.query('SELECT * FROM actions WHERE slug = $slug;');
  const results = query.get({ $slug: slug });
  return results;
}

module.exports.getXMostUrgent = (x) => {
  const query = db.query(`SELECT * FROM actions WHERE fundraising_deadline >= date('now')
    ORDER BY fundraising_deadline DESC LIMIT $limit;`);
  const results = query.all({ $limit: x });
  return results;
}

module.exports.getAllCoordinatesAndSlugs = () => {
  const query = db.query(`SELECT latitude, longitude, slug FROM actions`);
const results = query.all();
return results;
}
