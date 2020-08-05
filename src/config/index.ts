export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  GUTHUB_TOKEN: process.env.GUTHUB_TOKEN,
  GITHUB_USERNAME: process.env.GITHUB_USERNAME,
  GITHUB_REPO: process.env.GITHUB_REPO,
});
