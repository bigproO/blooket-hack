var keepGoing=true;
var askedAlready=false;


//this will only open according to your 500 stack

async function getName() {
    const response = await fetch('https://api.blooket.com/api/users/verify-token', {
        method: "GET",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9,ru;q=0.8",
        },
        credentials: "include"
    });
    const data = await response.json();

    return data.name;
};

async function addCurrencies() {
    const response = await fetch('https://api.blooket.com/api/users/add-rewards', {
        method: "PUT",
        headers: {
            "referer": "https://www.blooket.com/",
            "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            addedTokens: 500,
            addedXp: 300,
            name: await getName()
        })
    });

    if (response.status == 200) {
        alert(`${tokens} tokens and 300 XP added to your account!`);
    } else {
        alert('An error occured.');
    };

};
// this was first portion adds coins
while (keepGoing==true){
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    (async () => {
        if (askedAlready == false){
         const box = prompt('What box do you want to open? (EXAMPLE: Space)');
         const much = prompt('How much is the box you want to open.');
         const amount = 500/much;
         alert(`opening ${amount}`);
         const response = await fetch('https://api.blooket.com/api/users/verify-token', { credentials: "include" });
         const data = await response.json();
         askedAlready=true;
        }

        (new Promise(async (res, rej) => {
            var blooks = [];

            for (let i = 0; i < amount; i++) {
                await sleep(100);
                fetch('https://api.blooket.com/api/users/unlockblook', {
                    method: "PUT",
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "en-US,en;q=0.9,ru;q=0.8",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        box: box,
                        name: data.name,
                    }),
                }).then(r => { 
                    if (r.status == 200) r.json().then(r => blooks.push(r.unlockedBlook));
                });
            };
            res(blooks);
        })).then(blooks => {
            let count = {};

            blooks.forEach((i) => { count[i] = (count[i] || 0) + 1; });

            alert(`Results:\n` + Object.entries(count).map((x) => `    ${x[1]} ${x[0]}`).join(`\n`));
        });
    })();

    //second portion (opens Boxes)
    async function getName() {
        const response = await fetch('https://api.blooket.com/api/users/verify-token', {
            method: "GET",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9,ru;q=0.8",
            },
            credentials: "include"
        });
        const data = await response.json();

        return data.name;
    };


    async function getBlooks(blooketName) {
        const response = await fetch('https://api.blooket.com/api/users/blooks?name=' + blooketName, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9,ru;q=0.8",
            },
            credentials: "include"
        });
        const data = await response.json();

        return data;
    };
    // third section
    async function sellDupeBlooks() {
        const blooks = await getBlooks(await getName());
        const x = Object.entries(blooks).filter(i => i[1] > 1).map(i => [i[0], i[1] - 1]);

        for (const [blook, val] of x) {
            await fetch('https://api.blooket.com/api/users/sellblook', {
                method: "PUT",
                headers: {
                    "referer": "https://www.blooket.com/",
                    "content-type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    blook: blook,
                    name: await getName(),
                    numSold: val
                }),
            });
        }

        if (x.length > 0) {
            alert('Results:\n' + x.map(x => `    ${x[1]} ${x[0]}`).join('\n'));
        } else {
            alert("No duplicate Blooks found.");
            keepGoing = false;
        };

    };

    sellDupeBlooks();

    //third portion sells dupes
};
