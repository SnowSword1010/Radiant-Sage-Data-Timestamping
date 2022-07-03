const OpenTimestamps = require('opentimestamps');
const database = require('./database.json');
const fs = require('fs');

function stringToUint8Array(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}

module.exports = {
    verify: function (filehash, ots_proof_location) {
        fs.readFile(ots_proof_location, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const encodedFileHash = Buffer.from(filehash, 'hex')
            console.log("a:" + encodedFileHash);
            const detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), encodedFileHash);
            console.log("b:" + detached);
            const myArray = data.toString().split(" ");
            let myUint8Array = new Uint8Array(myArray.length - 1);
            for (let i = 0; i < myArray.length - 1; i++) {
                myUint8Array[i] = parseInt(myArray[i]);
            }
            const fileOts = Buffer.from(myUint8Array,'hex');
            console.log("c:" + fileOts);
            const detachedOts = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
            console.log("d:" + detachedOts);

            // verify
            let options = {};
            // options.ignoreBitcoinNode - Ignore verification with bitcoin node 
            options.ignoreBitcoinNode = true;
            // options.timeout - Adjust the request timeout (default: 1000) 
            options.timeout = 5000;
            OpenTimestamps.verify(detachedOts, detached, options).then(verifyResult => {
                // return an object containing timestamp and height for every attestation if verified, undefined otherwise.
                a = verifyResult;
                console.log(verifyResult);
                console.log(a);
                // prints:
                // { bitcoin: { timestamp: 1521545768, height: 514371 },
                //   litecoin: { timestamp: 1521540398, height: 1388467 } }

            });
        });
    }
}