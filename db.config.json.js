import dotenv from 'dotenv'
dotenv.config();

const { env } = process;
const config = {
    db: {
        host: env["DB_HOST"],
        database: env["DB_DATABASE"],
        user: env["DB_USER"],
        password: env["DB_PASSWORD"]
    }
}

export default config