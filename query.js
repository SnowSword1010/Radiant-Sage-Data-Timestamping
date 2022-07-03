const sha256 = require('sha256');
const {Client} = require('pg');

function createJsonHash(json){
    return sha256(JSON.stringify(json));
}

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "reports"
})
a = client.connect();

client.query("Select * from public.dim_queuemsgs order by messagedate desc limit 100;", function (err, res){
    if(!err){
        // res.rows is an array
        for(let i = 0; i < res.rows.length; i++){
            let msg = res.rows[i].message;
            // console.log(res.rows[i]);
            let hash = createJsonHash(msg);
            client.query("UPDATE dim_queuemsgs SET json_hash=($1) WHERE queuemsgsid=($2);", [hash, res.rows[i].queuemsgsid], function(error, result){
                if(error){
                    console.log(error);
                }
                else{
                    console.log("HI" + i);
                }
            })
        }
        console.log("DONE");
    }
    else{
        console.log(err.message);
    }
    client.end;
});