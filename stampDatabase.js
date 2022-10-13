const Stamp = require('./stamp');
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
// Establishing connection with database
client.connect();

// Selecting the reports to be stamped => reports having a not null hash value but a 'false' verified status
client.query("Select * from public.dim_queuemsgs where (json_hash IS NOT NULL AND verified_status = 'false') order by messagedate desc limit 500;")
    .then(async (res) => {
        // res.rows is an array
        for (let i = 0; i < res.rows.length; i++) {
            let hash = res.rows[i].json_hash;
            // hash value is sent to stamp function of stamp.js file
            let str = await Stamp.stamp(hash);
            console.log("output: ", str);
            try {
                // verified status is set to pending and file path of ots_proof is stored
                const result = await client.query("UPDATE dim_queuemsgs SET verified_status=($1), ots_proof_location=($2) WHERE queuemsgsid=($3);", ["pending", str, res.rows[i].queuemsgsid]);
                console.log("Result:", result);
            } catch (err) {
                console.log(err)

            }
        }
    }
    )
    .catch(err => {
        console.log(err.message);
        
    })
    .then(res => {
        let date = new Date();
        // used to log the last time cron of this program executed in a file named stampDatabase.txt
        fs.writeFile('stampDatabase.txt', 'Cron last executed at'+ date.toString(), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        // closing database connection
        client.end();
    })