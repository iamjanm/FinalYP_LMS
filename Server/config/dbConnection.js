import mongoose from "mongoose";

/**
 * @Connects to MongoDB database
 */
mongoose.set('strictQuery', false);

const connectionToDB = async () => {

    try {
        const { connection } = await mongoose.connect(
            process.env.MONGODB_URL || `mongodb://localhost:27017/my_database`
        )

        if (connection) {
            console.log(`Connected to MongoDB sucessfullyy`);
        }

    } catch (e) {
        console.log(
            "failed to connect please try again "
        );
        process.exit(1);
    }
}
export default connectionToDB;