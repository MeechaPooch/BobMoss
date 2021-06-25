import { token, speakRoleId, serverId, announcementsChannelId, generalChannelId } from './secrets.js'

import Discord from 'discord.js'
const client = new Discord.Client();
let serverGuild = new Discord.Guild();

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
        serverGuild = await (await client.guilds.fetch(serverId))
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

    client.on('message', async message => {
        if (message.channel.id == announcementsChannelId) {
            const general = await serverGuild.channels.cache.get((generalChannelId));
            // general.send('poopee')
            const embedd = getMessageEmbed(message.content, message.member.nickname, message.author.displayAvatarURL({ dynamic: true }), message.member.displayColor,message.attachments);
            // console.log(embedd)
            general.send(embedd)
        }
    })


    client.login(token);
}

let intros = [
    "Eyyyya-eyy!!! Itza me! Da funky announcements man! I gots one right hot of the press! Heare it is-- dont be getting too goombly and gombly up in me doe-- yous knows what i mean.",
    "ARG ima be STEALIN a SWASHBUCLKIN' ANNOUNCEMENT! Here me cap'ain it be",
    "New announcement! Discuss it or whatever your freakish children do these days",
    'According to all known laws of BRUH, there is a BRUH announcement. BRUH BRUH BRUH',
    'Meow you can only read this announcement if ur 69% cat or more rrraaaawwrrrrr',
    `Candles, Spyglasses, Glowsauid? You want it? It's yours, my friend. As long as you have enough copper. Sorry, Link. I can't give credit! Come back when you've... MMMMMMM... Read this announcement!`,
    `We're no strangers to love You know the rules and so do I A full commitment's what I'm thinking of You wouldn't get this from any other announcement`,
    'Somebody once told me that i have herpes',
    `babe, i'm breaking up with you. it's not you, you were poggers. it's me, i'm omegalul. im sorry if this is pepehands but it has to be done, i've just been **not reading the announcements** and feeling pepega weirdchamp for months, it's time to end it, no kapp`,
    'Me after reading this announcement: *single*: [:x:] |  *taken*: [:x:]  | *gamer*: [ :white_check_mark: ]',
    'This message is joe and mama approved',
    "And now, we're gonna, paint a, happy little announcement :3"
]

function getMessageEmbed(message, name, avatarURL, userColor, files) {
    return {
        "content": intros[Math.floor(Math.random() * intros.length)],
        "tts": false,
        embed: {
            "description": message,
            "color": userColor,
            "author": {
                "name": name,
                "url": "https://scratch.mit.edu/users/ilhp10",
                "icon_url": avatarURL
            }
        },
        files
    }
}



await setup();
startSaving();