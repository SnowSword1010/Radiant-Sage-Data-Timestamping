const OpenTimestamps = require('opentimestamps');
const fs = require("fs");
const { doesNotMatch } = require('assert');

function bufferToString(buf) {
    return String.fromCharCode(...new Uint8Array(buf));
    // return String.fromCharCode.apply(null, new Uint8Array(buf));
}

module.exports = {
    stamp: function (filehash, callback) {
        // filehash is the hash of the given file
        otsProof = {};
        let ans = "hey";
        //encodedFileHash is the hex value of filehash
        const encodedFileHash = Buffer.from(filehash, 'hex')
        // creates a detached timestamp file with paramters like timestamp, attestations etc
        const detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), encodedFileHash);


        return OpenTimestamps.stamp(detached).then(() => {
            // detached timestamp file converted to bytestream
            const fileOts = detached.serializeToBytes();
            // store this proof in the database
            console.log("YOOO");
            console.log(fileOts);
            // converting ots proof to string for easy storage in filesystem
            let str = "";
            for (let i = 0; i < fileOts.length; i++) {
                str += (fileOts[i] + " ");
            }
            console.log(str);
            fs.writeFile("./proofs/" + filehash + ".txt", str, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
            callback("./proofs/" + filehash + ".txt");
        })
    }
}
