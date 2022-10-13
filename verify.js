const OpenTimestamps = require('opentimestamps');
const fs = require('fs');

module.exports = {
    verify: async function (filehash, ots_proof_location) {
        try {
            // Synchronously reading contents from ots_proof_location => gives encoded value of ots_proof
            const data = fs.readFileSync(ots_proof_location, (err) => {
                if (err) throw err;
            });
            console.log("data: ", data);
            //encodedFileHash is the hex value of filehash
            const encodedFileHash = Buffer.from(filehash, 'hex');
            // console.log("a:" + encodedFileHash);
            // creates a detached timestamp file with paramters like timestamp, attestations etc
            const detached = await OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), encodedFileHash);
            // console.log("b:" + detached);
            // decoding encoded value of ots_proof into myUint8Array variable
            const myArray = data.toString().split(" ");
            let myUint8Array = new Uint8Array(myArray.length - 1);

            for (let i = 0; i < myArray.length - 1; i++) {
                myUint8Array[i] = parseInt(myArray[i]);
            }
            // taking hex value of ots_proof
            const fileOts = Buffer.from(myUint8Array, 'hex');
            // console.log("c:" + fileOts);
            // deserialising ots_proof
            const detachedOts = await OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
            // console.log("d:" + detachedOts);

            // verify
            let options = {};
            // options.ignoreBitcoinNode - Ignore verification with bitcoin node 
            options.ignoreBitcoinNode = true;
            // options.timeout - Adjust the request timeout (default: 1000) 
            options.timeout = 1000;
            // use Opentimestamps.stamp method to verify the detached timestamp file from ots calendar servers
            const verifyResult = await OpenTimestamps.verify(detachedOts, detached, options);
            // console.log(verifyResult);
            // return verifyResult to the caller function
            return verifyResult;
        } catch (error) {
            console.log(error);
        }
        console.log("Bye");
    }
}