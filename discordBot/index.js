
require('dotenv').config(); //initialize dotenv
// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment'); // require
const { SlashCommandStringOption } = require('@discordjs/builders');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const getMessageId = ( messageUrl ) => {
	var n = messageUrl.lastIndexOf('/');
	var result = messageUrl.substring(n + 1);

	return result
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName, channelId, guildId } = interaction;

	if (commandName === 'save') {
		let body = {}
		const channel = client.guilds.cache.get(guildId).channels.cache.get( channelId )
		let messageUrl = interaction.options.getString('url')
		let messageId = getMessageId(messageUrl)
		let isReply = false
		let replyChannelId, replyMessageId

		await channel.messages.fetch(messageId)
			.then(message => {
				console.log(message)

				let user = client.guilds.cache.get(guildId).members.cache.get(message.author.id)?.user;

				body.messageId = messageId
				body.messageUrl = messageUrl
				body.date = moment(message.createdTimestamp).toISOString()
				body.content = message.content

				body.authorData = {
					"Username": message.author.username,
					"Avatar": user.displayAvatarURL({size: 64, dynamic: true})
				}

				if(message.type === 'REPLY') {
					isReply = true
					// mentioned user
					let replyUser = client.guilds.cache.get(guildId).members.cache.get(message.mentions.repliedUser.id)?.user;

					body.replyData = {
						"Author": {
							"Username": replyUser.username,
							"Avatar": replyUser.displayAvatarURL({size: 64, dynamic: true})
						}
					}

					replyChannelId = message.reference.channelId
					replyMessageId = message.reference.messageId
				}
			})
			.catch(console.error)


			if(isReply) {
				const replyChannel = client.guilds.cache.get(guildId).channels.cache.get( replyChannelId )
				await replyChannel.messages.fetch( replyMessageId )
					.then(replyMessage => {
						body.replyData["Content"] = replyMessage.content
					})
			}
		
		await fetch('http://localhost:8000/api/save-message', {
				method: 'post',
				body: JSON.stringify(body),
				headers: {'Content-Type': 'application/json'}
			});

		interaction.reply({ content: "Done!", ephemeral: true });
	}
});


//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token