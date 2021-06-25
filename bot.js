import {token,speakRoleId,serverId} from './secrets.js'

import Discord from 'discord.js'
const client = new Discord.Client();
let serverGuild = null;

import fs from 'fs'
const members = JSON.parse(fs.readFileSync('members.json'))

async function sleep(millis) {
    return new Promise(res => setTimeout(res, millis))
}

async function startSaving() {
    while (true) {
        await sleep(3 * 1000);
        fs.writeFileSync('members.json', JSON.stringify(members));
    }
}

async function setup() {

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        serverGuild = await client.guilds.fetch(serverId)
    });

    client.on('guildMemberAdd', async peepoop => {
        console.log(`${peepoop.displayName} joined`)

        if (members[peepoop.id]) {
            console.log(`DID NOT give ${peepoop.displayName} role`)
        } else {
            await peepoop.roles.add(await serverGuild.roles.fetch(speakRoleId))
            console.log(`gave ${peepoop.displayName} role`)
        }
    });

    client.on('guildMemberRemove', poopee => {
        console.log(`${poopee.displayName} left`)
        members[poopee.id] = !poopee.roles.cache.find(r => r.id == speakRoleId);
        console.log('are they SHUSHED? ' + members[poopee.id])
    })


    client.login(token);
}



await setup();
startSaving();