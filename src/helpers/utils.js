
const PROVIDER = 'http://127.0.0.1:8545/';
const Web3 = require('web3');
const client = new Web3(PROVIDER);

const duration = {
    seconds: function (val) {
        return val;
    },
    minutes: function (val) {
        return val * this.seconds(60);
    },
    hours: function (val) {
        return val * this.minutes(60);
    },
    days: function (val) {
        return val * this.hours(24);
    },
    weeks: function (val) {
        return val * this.days(7);
    },
    years: function (val) {
        return val * this.days(365);
    },
};

async function increaseTimeTo(target) {
    try {
        let now = await latestTime();
        if (target < now)
            throw Error(
                `Cannot increase current time(${now}) to a moment in the past(${target})`
            );

        let res = await client.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_mine',
            params: [target],
            id: new Date().getTime()
        }, console.log);
        return res;
    } catch (err) {
        console.log(err);
    }
}

async function latestTime() {
    let block = await client.eth.getBlock("latest");
    console.log('block.timestamp', block.timestamp)
    return block.timestamp;
}

latestTime().then((x) => {

    increaseTimeTo(x + duration.weeks(1));
});