const Verify = require('./verify');
const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "reports"
})
a = client.connect();

client.query("Select * from public.dim_queuemsgs order by messagedate desc limit 1;", function (err, res) {
    if (!err) {
        // res.rows is an array
        for (let i = 0; i < res.rows.length; i++) {
            let hash = res.rows[i].json_hash;
            let ots_proof_location = res.rows[i].ots_proof_location;
            let status = res.rows[i].verified_status;
            if (status == "pending") {
                Verify.verify(hash, ots_proof_location, function (str) {
                    // console.log(str);
                    // client.query("UPDATE dim_queuemsgs SET verified_status=($1), ots_proof_location=($2) WHERE queuemsgsid=($3);", ["pending", str, res.rows[i].queuemsgsid], function (error, result) {
                    //     if (error) {
                    //         console.log(error);
                    //     }
                    //     else {
                    //         console.log("HI" + i);
                    //     }
                    // })
                }
                )

            }
        }
        console.log("DONE");
    }
    else {
        console.log(err.message);
    }
    client.end;
});