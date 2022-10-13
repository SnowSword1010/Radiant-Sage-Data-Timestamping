const Verify = require('./verify');
const fs = require("fs");
const { Client } = require('pg');

// Defining database configs
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "reports"
})

// Establishing connection with database
client.connect();

// Selecting the reports to be verified => reports having a not null hash value and 'pending' verified_status
client.query("Select * from public.dim_queuemsgs where (json_hash IS NOT NULL AND verified_status = 'pending') order by messagedate desc limit 500;")
    .then(async (res) => {
        for (let i = 0; i < res.rows.length; i++) {
            let hash = res.rows[i].json_hash;
            // location of ots proof
            let ots_proof_location = res.rows[i].ots_proof_location;
            // hash value and ots_proof_location is sent to verify method of verify.js file
            const info = await Verify.verify(hash, ots_proof_location);
            // console.log("info: ", info);
            // if info exists, is not an empty object and info.bitcoin exists then it could be said that the record has been verified successfully from opentimestamps calender servers
            if (info && info != {} && info.bitcoin) {
                if (info.bitcoin.timestamp && info.bitcoin.height) {
                    // storing unix timestamp and height info
                    await client.query("UPDATE dim_queuemsgs SET verified_status=($1), timestamp=($2), height=($3) WHERE queuemsgsid=($4);", ['true', info.bitcoin.timestamp.toString(), info.bitcoin.height.toString(), res.rows[i].queuemsgsid])
                        .then(async (result) => {
                            console.log(res.rows[i].json_hash);
                            console.log(info.bitcoin.timestamp);
                            console.log(info.bitcoin.height);
                            console.log("Saved");
                        })
                        .catch(async (error) => {
                            console.log(error);
                        })
                }
            }
        }
    })
    .catch(async (err) => {
        console.log(err);
    })
    .then(() => {
        let date = new Date();
        // used to log the last time cron of this program executed in a file named verifyDatabase.txt
        fs.writeFile('verifyDatabase.txt', 'Cron last executed at'+ date.toString(), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        // closing database connection
        client.end();
    })