const sha256 = require('sha256');
const { Client } = require('pg');
const fs = require("fs");

// Defining database configs
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "reports"
})
// Establishing connection with local database
client.connect();

// Selecting the reports 
client.query("Select * from public.dim_queuemsgs WHERE json_hash IS NULL order by messagedate desc limit 500;")
    .then(async (res) => {
        for (let i = 0; i < res.rows.length; i++) {
            let hash = sha256(JSON.stringify(res.rows[i].message) + JSON.stringify(res.rows[i].messagedata + JSON.stringify(res.rows[i].queuemsgsid)));
            await client.query("Update public.dim_queuemsgs SET json_hash=($1) WHERE queuemsgsid=($2);", [hash, res.rows[i].queuemsgsid])
                .then(async (result) => {
                    console.log(result);
                })
                .catch(async (error) => {
                    console.log(error);
                })
        }
    })
    .catch(async (err) => {
        console.log(err.message);
    })
    .then(() => {
        let date = new Date();        
        fs.writeFile('createRecordHash.txt', 'Cron last executed at'+ date.toString(), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        client.end();
    })