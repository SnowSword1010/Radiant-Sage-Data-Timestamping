const OpenTimestamps = require('opentimestamps');
const fs = require('fs');

module.exports = {
    verify: async function (filehash, ots_proof_location) {
        try {
            const data = fs.readFileSync(ots_proof_location, (err) => {
                if (err) throw err;
            });
            console.log("data: ", data);
            const encodedFileHash = Buffer.from(filehash, 'hex');
            // console.log("a:" + encodedFileHash);
            const detached = await OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), encodedFileHash);
            // console.log("b:" + detached);
            const myArray = data.toString().split(" ");
            let myUint8Array = new Uint8Array(myArray.length - 1);

            for (let i = 0; i < myArray.length - 1; i++) {
                myUint8Array[i] = parseInt(myArray[i]);
            }

            const fileOts = Buffer.from(myUint8Array, 'hex');
            // console.log("c:" + fileOts);
            const detachedOts = await OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
            // console.log("d:" + detachedOts);

            // verify
            let options = {};
            // options.ignoreBitcoinNode - Ignore verification with bitcoin node 
            options.ignoreBitcoinNode = true;
            // options.timeout - Adjust the request timeout (default: 1000) 
            options.timeout = 1000;

            const verifyResult = await OpenTimestamps.verify(detachedOts, detached, options);
            console.log(verifyResult);
            return verifyResult;
        } catch (error) {
            console.log(error);
        }

        // fs.readFile(ots_proof_location, async (err, data) => {
        //     if (err) {
        //         console.error(err);
        //         return {};
        //     }
        //     try {
        // const encodedFileHash = Buffer.from(filehash, 'hex');
        // // console.log("a:" + encodedFileHash);
        // const detached = await OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), encodedFileHash);
        // // console.log("b:" + detached);
        // const myArray = data.toString().split(" ");
        // let myUint8Array = new Uint8Array(myArray.length - 1);

        // for (let i = 0; i < myArray.length - 1; i++) {
        //     myUint8Array[i] = parseInt(myArray[i]);
        // }

        // const fileOts = Buffer.from(myUint8Array, 'hex');
        // // console.log("c:" + fileOts);
        // const detachedOts = await OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
        // // console.log("d:" + detachedOts);

        // // verify
        // let options = {};
        // // options.ignoreBitcoinNode - Ignore verification with bitcoin node 
        // options.ignoreBitcoinNode = true;
        // // options.timeout - Adjust the request timeout (default: 1000) 
        // options.timeout = 1000;

        // const verifyResult = await OpenTimestamps.verify(detachedOts, detached, options);
        // console.log(verifyResult);
        // return verifyResult;
        // .then(verifyResult => {
        // return an object containing timestamp and height for every attestation if verified, undefined otherwise.
        // a = verifyResult;
        // callback(verifyResult);
        // prints:
        // { bitcoin: { timestamp: 1521545768, height: 514371 },
        //   litecoin: { timestamp: 1521540398, height: 1388467 } }
        // })
        // .catch(err => {

        // callback(err);
        // })
        // }
        // catch (errrr) {
        //     console.log(errrr);
        // }

        console.log("Bye");
        // });
    }
}