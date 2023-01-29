import dotenv  from "dotenv";
dotenv.config()

let dbURI = "mongodb://localhost:27017/thaiegghead";
if (process.env.NODE_ENV === "production") {
  dbURI = process.env.MONGO_URI; // production DB server
}
export const config = {
  database: dbURI,
  userMongoClient: true,
  connectOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
};
