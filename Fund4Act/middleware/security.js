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
        ],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
        ],
        'default-src': [
          "https://nominatim.openstreetmap.org",
        ],
        'img-src': [
          "'self'",
          "https://unpkg.com/leaflet@1.9.4/dist/images/",
          "http://a.tile.openstreetmap.org",
          "http://b.tile.openstreetmap.org",
          "http://c.tile.openstreetmap.org",
        ],
      },
    },
  }));
}
