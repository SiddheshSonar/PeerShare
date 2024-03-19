const NTP = require('ntp-time').Client;
const client = new NTP('localhost', 1200, { timeout: 5000 });

let time = new Date();

async function sync() {
	try {

		const t = await client.syncTime();
        time = t.time;
        console.log("Clock Synced")
	} catch (err) {
		console.log(err);
	}
}

// sync clock after every 30s
setInterval(sync, 30 * 1000);

setInterval(() => {
    console.log(time.toLocaleString(
        'en-US',
        {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }
    ));
    time = new Date(time.getTime() + 1000);
}, 1000);
