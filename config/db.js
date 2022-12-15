import { connect } from "mongoose";

const connectwithDb = () => {
  connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(console.log("DB GOT CONNECTED"))
    .catch((error) => {
      console.log(`DB CONNECTION ISSUE`);
      console.log(error);
      process.exit(1);
    });
};

export default connectwithDb;
