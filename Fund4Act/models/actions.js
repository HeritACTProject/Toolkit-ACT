const { Database } = require("bun:sqlite");
const db = new Database("fund4act.sqlite");

module.exports.init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS actions(
    id INTEGER PRIMARY KEY NOT NULL,
    profile_id TEXT NOT NULL,
    name TEXT NOT NULL,
    fundraising_total DECIMAL,
    fundraising_target DECIMAL,
    fundraising_deadline TEXT,
    image_url TEXT,
    address TEXT,
    latitude TEXT,
    longitude TEXT,
    overview TEXT,
    start_date TEXT,
    end_date TEXT,
    category TEXT,
    slug TEXT NOT_NULL,
    beauty_ambition TEXT,
    sustain_ambition TEXT,
    together_ambition TEXT,
    participatory_process_ambition TEXT,
    multi_level_engagement_ambition TEXT,
    transdiciplinary_ambition TEXT
  )`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_action_id
    ON actions (id);
  `);
  db.run(`CREATE INDEX IF NOT EXISTS idx_action_profile_id
    ON actions (profile_id);
  `);
};

module.exports.create = ({profileId, name, total, target, deadline, imageUrl, address, lat, lon, overview, startDate, endDate,
                        category, slug, beautyAmbition, sustainAmbition, togetherAmbition, participProcessAmbition,
                        multiLevelEngagementAmbition, transdiciplinaryAmbition}) => {
  return db.run(`INSERT INTO actions
    (profile_id, name, fundraising_total, fundraising_target, fundraising_deadline, image_url, address, latitude, longitude, overview, start_date, end_date,
      category, slug, beauty_ambition, sustain_ambition, together_ambition, participatory_process_ambition,
      multi_level_engagement_ambition, transdiciplinary_ambition)
    VALUES ("${profileId}", "${name}", "${total}", "${target}", "${deadline}", "${imageUrl}", "${address}","${lat}","${lon}","${overview}",
      "${startDate}", "${endDate}", "${category}", "${slug}", "${beautyAmbition}", "${sustainAmbition}", "${togetherAmbition}",
      "${participProcessAmbition}", "${multiLevelEngagementAmbition}", "${transdiciplinaryAmbition}")
  `);
};

module.exports.updateInfoBySlug = (slug, {profileId, name, address, lat, lon, overview, startDate, endDate, category}) => {
  return db.run(`UPDATE actions SET
    name = "${name}", address = "${address}",
      latitude = "${lat}", longitude = "${lon}", overview = "${overview}",
      start_date = "${startDate}", end_date = "${endDate}", category = "${category}"
    WHERE slug  = "${slug}" AND profile_id = "${profileId}"
  `);
};

module.exports.updateAmbitionsBySlug = (slug, {profileId, beautyAmbition, sustainAmbition, togetherAmbition,
                        participProcessAmbition,multiLevelEngagementAmbition, transdiciplinaryAmbition}) => {
  return db.run(`UPDATE actions SET
      beauty_ambition = "${beautyAmbition}", sustain_ambition= "${sustainAmbition}",
      together_ambition = "${togetherAmbition}",
      participatory_process_ambition = "${participProcessAmbition}",
      multi_level_engagement_ambition = "${multiLevelEngagementAmbition}",
      transdiciplinary_ambition = "${transdiciplinaryAmbition}"
    WHERE slug  = "${slug}" AND profile_id = "${profileId}"
  `);
};

module.exports.updateFundingBySlug = (slug, {profileId, total, target, deadline}) => {
  return db.run(`UPDATE actions SET
    fundraising_total = "${total}", fundraising_target = "${target}",
      fundraising_deadline = "${deadline}"
    WHERE slug  = "${slug}" AND profile_id = "${profileId}"
  `);
};

module.exports.getByProfileId = (pid) => {
  const query = db.query('SELECT * FROM actions WHERE profile_id = $pid;');
  const results = query.all({ $pid: pid});
  return results;
}

module.exports.getPublicByProfileId = (pid) => {
  const query = db.query(`
    SELECT * FROM actions
    WHERE profile_id = $pid
    AND fundraising_deadline IS NOT "undefined";
  `);
  const results = query.all({ $pid: pid});
  return results;
}

module.exports.getByActionSlug = (slug) => {
  const query = db.query(`SELECT *,
  substr("00" || beauty_ambition, -3, 3) AS beautyAmbition,
  substr("00" || sustain_ambition, -3, 3) AS sustainAmbition,
  substr("00" || together_ambition, -3, 3) AS togetherAmbition,
  substr("00" || participatory_process_ambition, -3, 3) AS participProcessAmbition,
  substr("00" || multi_level_engagement_ambition, -3, 3) AS multiLevelEngagementAmbition,
  substr("00" || transdiciplinary_ambition, -3, 3) AS transdiciplinaryAmbition
  FROM actions
  WHERE slug = $slug;`);
  const results = query.get({ $slug: slug });
  return results;
}

module.exports.getXMostUrgent = (x) => {
  const query = db.query(`SELECT * FROM actions
    ORDER BY fundraising_deadline DESC LIMIT $limit;`);
  const results = query.all({ $limit: x });
  return results;
}

module.exports.getAllCoordinatesAndSlugs = () => {
  const query = db.query(`
    SELECT latitude, longitude, slug FROM actions
  `);
  const results = query.all();
  return results;
}

module.exports.getPage = (offset) => {
  const query = db.query(`SELECT id, name, profile_id, slug, fundraising_deadline, fundraising_target FROM actions
    WHERE fundraising_deadline IS NOT "undefined"
    LIMIT 11
    OFFSET "${offset}";
  `);
  const results = query.all();

  const lastValue = results?.at(-1)?.id

  return {results, lastValue};
}
