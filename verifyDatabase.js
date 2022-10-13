const Verify = require('./verify');
const fs = require("fs");
const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "reports"
})
client.connect();

client.query("Select * from public.dim_queuemsgs where (json_hash IS NOT NULL AND verified_status = 'pending') order by messagedate desc limit 500;")
    .then(async (res) => {
        for (let i = 0; i < res.rows.length; i++) {
            let hash = res.rows[i].json_hash;
            console.log(hash);
            let ots_proof_location = res.rows[i].ots_proof_location;
            const info = await Verify.verify(hash, ots_proof_location);
            console.log("info: ", info);
            // , function (info) {
            if (info && info != {} && info.bitcoin) {
                if (info.bitcoin.timestamp && info.bitcoin.height) {
                    console.log("HEY");
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
        fs.writeFile('verifyDatabase.txt', 'Cron last executed at'+ date.toString(), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        client.end();
    })