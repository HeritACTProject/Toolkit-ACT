const { Database } = require("bun:sqlite");
const db = new Database("fund4act.sqlite");

module.exports.init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS actions(
    id INTEGER PRIMARY KEY NOT NULL,
    profile_id TEXT NOT NULL,
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
    slug TEXT NOT_NULL,
    beauty_ambition INTEGER,
    sustain_ambition INTEGER,
    together_ambition INTEGER,
    participatory_process_ambition INTEGER,
    multi_level_engagement_ambition INTEGER,
    transdiciplinary_ambition INTEGER
  )`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_action_id
    ON actions (id);
  `);
  db.run(`CREATE INDEX IF NOT EXISTS idx_action_profile_id
    ON actions (profile_id);
  `);
};

module.exports.create = ({profileId, name, target, deadline, imageUrl, address, lat, lon, overview, startDate, endDate,
                        category, slug, beautyAmbition, sustainAmbition, togetherAmbition, participProcessAmbition, 
                        multiLevelEngagementAmbition, transdiciplinaryAmbition}) => {
  return db.run(`INSERT INTO actions
    (profile_id, name, fundraising_target, fundraising_deadline, image_url, address, latitude, longitude, overview, start_date, end_date,
      category, slug, beauty_ambition, sustain_ambition, together_ambition, participatory_process_ambition,
      multi_level_engagement_ambition, transdiciplinary_ambition)
    VALUES ("${profileId}", "${name}", "${target}", "${deadline}", "${imageUrl}", "${address}","${lat}","${lon}","${overview}",
      "${startDate}", "${endDate}", "${category}", "${slug}", "${beautyAmbition}", "${sustainAmbition}", "${togetherAmbition}", 
      "${participProcessAmbition}", "${multiLevelEngagementAmbition}", "${transdiciplinaryAmbition}")
  `);
};

module.exports.update = ({id, name, target, deadline, imageUrl, overview, startDate, endDate,
                        category}) => {
  return db.run(`UPDATE actions SET
    name = "${name}", fundraising_target = "${target}",
      fundraising_deadline = "${deadline}", image_url = "${imageUrl}", overview = "${overview}",
      start_date = "${startDate}", end_date = "${endDate}", category = "${category}", 
      beauty_ambition = "${beautyAmbition}", sustain_ambition= "${sustainAmbition}", 
      together_ambition = "${togetherAmbition}", 
      participatory_process_ambition = "${participProcessAmbition}", 
      multi_level_engagement_ambition = "${multiLevelEngagementAmbition}", 
      transdiciplinary_ambition = "${transdiciplinaryAmbition}"
    WHERE id = "${id}"
  `);
};

module.exports.getByProfileId = (pid) => {
  const query = db.query('SELECT * FROM actions WHERE profile_id = $pid;');
  const results = query.all({ $pid: pid});
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
