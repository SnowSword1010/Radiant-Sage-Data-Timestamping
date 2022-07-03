const OpenTimestamps = require('opentimestamps');
const Stamp = require('./stamp')
const Verify = require('./verify.js')
// const file = Buffer.from('5468652074696d657374616d70206f6e20746869732066696c6520697320696e636f6d706c6574652c20616e642063616e2062652075706772616465642e0a','hex');
// const detached = OpenTimestamps.DetachedTimestampFile.fromBytes(new OpenTimestamps.Ops.OpSHA256(), file);
// OpenTimestamps.stamp(detached).then( ()=>{
//   const fileOts = detached.serializeToBytes();
// });

// 46dd032e15b189b256ab9e1681d6a67a2295237975499ae837a9f9f2aaef8bc1
// 46dd032e15b189b256ab9e1681d6a67a2295237975499ae837a9f9f2aaef8bc1

var sha256File = require('sha256-file');
// sync (no callback)

// console.log(sha256File('README.md')); // '345eec8796c03e90b9185e4ae3fc12c1e8ebafa540f7c7821fb5da7a54edc704'

// async/streamed (if using callback)

sha256File('chander.txt', function (error, sum) {
    if (error) return console.log(error);
    // console.log(sum)
    Verify.verify(sum) 
    // Stamp.stamp(sum)
    return null
    // stamp
    const hash = Buffer.from(sum, 'hex');
    const detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hash);
    OpenTimestamps.stamp(detached).then(() => {
        const fileOts = detached.serializeToBytes();
        console.log(fileOts)
        // fileOts becomes a byte array that represents the ots proof
        const detached1 = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
        console.log(typeof(detached1))
        // verify
        let options = {};

        // options.ignoreBitcoinNode - Ignore verification with bitcoin node 
        options.ignoreBitcoinNode = true;
        // options.timeout - Adjust the request timeout (default: 1000) 
        options.timeout = 5000;
        OpenTimestamps.verify(detached1, detached, options).then(verifyResult => {
            // return an object containing timestamp and height for every attestation if verified, undefined otherwise.
            console.log(verifyResult);
            // prints:
            // { bitcoin: { timestamp: 1521545768, height: 514371 },
            //   litecoin: { timestamp: 1521540398, height: 1388467 } }

        });
    });
    // sha256File('README.md.ots', function (error, sum2) {
    //     if (error) return console.log(error);
    //     console.log(sum2)
    //     const hash = Buffer.from(sum, 'hex');
    //     const hashOts = Buffer.from(sum2, 'hex');
    //     const detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hash);
    //     const detachedOts = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hashOts);
    //     // verify
    //     let options = {};

    //     // options.ignoreBitcoinNode - Ignore verification with bitcoin node 
    //     options.ignoreBitcoinNode = true;
    //     // options.timeout - Adjust the request timeout (default: 1000) 
    //     options.timeout = 5000;
    //     OpenTimestamps.verify(detachedOts, detached, options).then(verifyResult => {
    //         // return an object containing timestamp and height for every attestation if verified, undefined otherwise.
    //         console.log(verifyResult);
    //         // prints:
    //         // { bitcoin: { timestamp: 1521545768, height: 514371 },
    //         //   litecoin: { timestamp: 1521540398, height: 1388467 } }

    //     });
    // })

})

// sha256File('README.md.ots', function (error, sum) {
//     if (error) return console.log(error);
//     console.log(sum) // '345eec8796c03e90b9185e4ae3fc12c1e8ebafa540f7c7821fb5da7a54edc704'
//   })



// verify
// const file = Buffer.from('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'hex');
// const fileOts = Buffer.from('46dd032e15b189b256ab9e1681d6a67a2295237975499ae837a9f9f2aaef8bc1', 'hex');
// const detached = OpenTimestamps.DetachedTimestampFile.fromBytes(new OpenTimestamps.Ops.OpSHA256(), file);
// const detachedOts = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
// let options = {};

// // options.ignoreBitcoinNode - Ignore verification with bitcoin node 
// options.ignoreBitcoinNode = true;
// // options.timeout - Adjust the request timeout (default: 1000) 
// options.timeout = 5000;
// OpenTimestamps.verify(detachedOts, detached, options).then(verifyResult => {
//     // return an object containing timestamp and height for every attestation if verified, undefined otherwise.
//     console.log(verifyResult);
//     // prints:
//     // { bitcoin: { timestamp: 1521545768, height: 514371 },
//     //   litecoin: { timestamp: 1521540398, height: 1388467 } }

// });