const OpenTimestamps = require('opentimestamps');
const fs = require("fs");

module.exports = {
    stamp:async function(filehash,cc){
        console.log("hello 123");
        // filehash is the hash of the given file
        otsProof = {};
        //encodedFileHash is the hex value of filehash
        const encodedFileHash = Buffer.from(filehash, 'hex')
        // creates a detached timestamp file with paramters like timestamp, attestations etc
        const detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), encodedFileHash);

        const abc= await OpenTimestamps.stamp(detached);
        // then(() => {
        // detached timestamp file converted to bytestream
        const fileOts = detached.serializeToBytes();
        // store this proof in the database
        console.log("***",fileOts);
        // converting ots proof to string for easy storage in filesystem
        let str = "";
        for (let i = 0; i < fileOts.length; i++) {
            str += (fileOts[i] + " ");
        }
        fs.writeFileSync("/home/ubuntu/Desktop/testJS/proofs/" + filehash + ".txt", str, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        console.log("filehash: " , filehash);
        return "./proofs/" + filehash + ".txt";
        // })
    }
}
