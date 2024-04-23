import db from "../db/config.js";

class UserModel {
    constructor() { }

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE email = ?;";
            db.query(query, [email], (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data[0]);
                }
            });
        });
    }

    checkUserExists(email) {
        return new Promise((resolve, reject) => {
            const emailQuery = "SELECT uid FROM users WHERE email = ?;";
            db.query(emailQuery, [email], (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.length > 0);
                }
            });
        });
    }

    createUser(name, email, password) {
        return new Promise((resolve, reject) => {
            const insertQuery =
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?);";
            db.query(
                insertQuery,
                [name, email, password],
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                }
            );
        });
    }

}

export default UserModel;