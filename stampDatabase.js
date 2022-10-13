const Stamp = require('./stamp');
const { Client } = require('pg');
const fs = require("fs");

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "reports"
})
client.connect();

client.query("Select * from public.dim_queuemsgs where (json_hash IS NOT NULL AND verified_status = 'false') order by messagedate desc limit 500;")
    .then(async (res) => {
        // res.rows is an array
        for (let i = 0; i < res.rows.length; i++) {
            let hash = res.rows[i].json_hash;
            console.log(hash);
            let str = await Stamp.stamp(hash);
            console.log("output: ", str);
            try {
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
        fs.writeFile('stampDatabase.txt', 'Cron last executed at'+ date.toString(), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        client.end();
        console.log("Disconnecting");

    })