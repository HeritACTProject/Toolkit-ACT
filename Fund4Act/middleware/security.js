const helmet = require('helmet');

module.exports.init = (app) => {
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'style-src': [
          "'self'",
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
          "'unsafe-inline'",
          "https://accounts.google.com/gsi/style",
        ],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "data:",
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
          "https://accounts.google.com/gsi/client",
        ],
        'default-src': [
          "'self'",
          "data:",
          "https://nominatim.openstreetmap.org",
          "https://accounts.google.com/gsi/",
        ],
        'img-src': [
          "'self'",
          "data:",
          "https://unpkg.com/leaflet@1.9.4/dist/images/",
          "http://a.tile.openstreetmap.org",
          "http://b.tile.openstreetmap.org",
          "http://c.tile.openstreetmap.org",
        ],
      },
    },
  }));
}
