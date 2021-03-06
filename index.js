const botconfig = require("./botconfig.json"),
    Discord = require("discord.js"),
    fs = require("fs"),
    mongoose = require("mongoose"),
    checkPerm = require("./utils/permissions.js");
    bot = new Discord.Client();
let Settings = require("./models/settings.js");
bot.commands = new Discord.Collection();
bot.login(process.env.BOT_TOKEN)
mongoose.connect(`mongodb://${process.env.usermongodb}:${process.env.passmongodb}@mosbot-shard-00-00-wfckx.mongodb.net:27017/account?ssl=true&replicaSet=MosBot-shard-0&authSource=admin&retryWrites=true`, {useNewUrlParser: true});
process.on('unhandledRejection', error => {
    console.error(`ERROR: \n${error.stack}`);
    let errorembed = new Discord.RichEmbed()
    .setColor(`RED`)
    .setTitle(`ERROR`)
    .setDescription(error.stack)
    try{bot.channels.get("490726893864222731").send(errorembed)}catch(e){}
});

bot.on("ready", async () => {
    bot.guilds.forEach(guild => {
    Settings.findOne({serverID: guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (!settings) {
        const newSettings = new Settings({
          serverName: guild.name,
          serverID: guild.id,
          prefix: "",
          logchannel: "",
          adminrole: "",
          autorole: { enabled: false, role: ""},
          userjoin: { enabled: false, message: "", channel: "", dm: false },
          userleave: { enabled: false, message: "", channel: "", dm: false },
          userlevel: { enabled: false, message: "", channel: "", dm: false },
        });

        newSettings.save().catch(err => console.log(err));
      }
    });
  });
    
    console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
    console.log(`Ready. 👌`);
    require("./utils/playing.js")(bot);
});
bot.on("guildMemberAdd", async member => {
    let botembed = new Discord.RichEmbed()
        .setColor("#1CFF00")
        .setAuthor('Member Joined', member.user.displayAvatarURL)
        .setFooter(`ID: ${member.id}`)
        .setTimestamp()
        .setDescription(`${member} ${member.user.tag}`)
        .setThumbnail(member.user.displayAvatarURL)
    Settings.findOne({serverID: member.guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (settings) {
       if (settings.logchannel == "") return;
       let modlogs = member.guild.channels.get(settings.logchannel);
       if (!modlogs) return;
       modlogs.send(botembed); 
      }
    });
});
bot.on("guildMemberAdd", async member => {
    let serverSize = member.guild.memberCount;
    let botCount = member.guild.members.filter(m => m.user.bot).size;
    let humanCount = serverSize - botCount;
    let welcome = member.guild.channels.find(c => c.name === '👋welcome👋')
    if (!welcome) return;
    let welcomeembed = new Discord.RichEmbed()
    .setColor(`RANDOM`)
    .setDescription(`Welcome to **${member.guild.name}** ${member}!!! So glad that you are here! :smile:<:Hype:446237019283259422>:wave:<a:Cheer:446237254499958795>`)
    .addField(`Total Users`, `${humanCount}`, true)
    .setAuthor(member.user.tag, member.user.displayAvatarURL)
    welcome.send(welcomeembed);
});
bot.on("guildMemberRemove", async member => {
   let botembed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setAuthor('Member Left', member.user.displayAvatarURL)
        .setFooter(`ID: ${member.id}`)
        .setTimestamp()
        .setDescription(`${member} ${member.user.tag}`)
        .setThumbnail(member.user.displayAvatarURL)
    Settings.findOne({serverID: member.guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (settings) {
       if (settings.logchannel == "") return;
       let modlogs = member.guild.channels.get(settings.logchannel);
       if (!modlogs) return;
       modlogs.send(botembed); 
      }
    });
});
bot.on(`guildBanAdd`, (guild, user) => {
    let botembed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setAuthor('Member Banned', user.displayAvatarURL)
        .setFooter(`ID: ${user.id}`)
        .setTimestamp()
        .setDescription(`${user} ${user.tag}`)
        .setThumbnail(user.avatarURL)
    Settings.findOne({serverID: guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (settings) {
       if (settings.logchannel == "") return;
       let modlogs = guild.channels.get(settings.logchannel);
       if (!modlogs) return;
       modlogs.send(botembed); 
      }
    });
});
bot.on(`guildBanRemove`, (guild, user) => {
    let botembed = new Discord.RichEmbed()
        .setColor("#12FF00")
        .setAuthor('Member Unbanned', user.displayAvatarURL)
        .setFooter(`ID: ${user.id}`)
        .setTimestamp()
        .setDescription(`${user} ${user.tag}`)
        .setThumbnail(user.displayAvatarURL)
    Settings.findOne({serverID: guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (settings) {
       if (settings.logchannel == "") return;
       let modlogs = guild.channels.get(settings.logchannel);
       if (!modlogs) return;
       modlogs.send(botembed); 
      }
    });
});
bot.on(`channelCreate`, async channel => {
    if(channel.type === "dm") return;
    let guild = channel.guild;
    let botembed = new Discord.RichEmbed()
        .setColor("#FF000")
        .setAuthor('Channel Created', channel.guild.iconURL)
        .setFooter(`ID: ${channel.id}`)
        .setTimestamp()
        .setDescription(`_ _►Name<#${channel.id}> (**${channel.name}**) \n ►Type **${channel.type}** \n ►ID **${channel.id}**`)
    Settings.findOne({serverID: channel.guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (settings) {
       if (settings.logchannel == "") return;
       let modlogs = channel.guild.channels.get(settings.logchannel);
       if (!modlogs) return;
       modlogs.send(botembed); 
      }
    });
});
bot.on(`channelDelete`, channel => {
    let guild = channel.guild;
    let botembed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setAuthor('Channel Deleted', channel.guild.iconURL)
        .setFooter(`ID: ${channel.id}`)
        .setTimestamp()
        .setDescription(`_ _►Name **${channel.name}**\n ►Type **${channel.type}**\n ►ID ${channel.id}\n ►Position ${channel.position}`)
    Settings.findOne({serverID: channel.guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (settings) {
       if (settings.logchannel == "") return;
       let modlogs = channel.guild.channels.get(settings.logchannel);
       if (!modlogs) return;
       modlogs.send(botembed); 
      }
    });
});
bot.on('guildCreate', async (guild) => {
    
    //===================================================================
    // Guild Create message
      let serverSize = guild.memberCount;
    let botCount = guild.members.filter(m => m.user.bot).size;
    let humanCount = serverSize - botCount;
    let verifLevels = ["None", "Low\nmust have verified\nemail on account", "Medium - must be registered on Discord for longer than 5 minutes", "High -  (╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes", "Very High - ┻━┻ミヽ(ಠ益ಠ)ﾉ彡┻━┻ - must have a verified phone number"];
    let region = {
        "brazil": "Brazil",
        "eu-central": "Central Europe",
        "singapore": "Singapore",
        "us-central": "U.S. Central",
        "sydney": "Sydney",
        "us-east": "U.S. East",
        "us-south": "U.S. South",
        "us-west": "U.S. West",
        "eu-west": "Western Europe",
        "vip-us-east": "VIP U.S. East",
        "london": "London",
        "amsterdam": "Amsterdam",
        "hongkong": "Hong Kong"
    };
    const newserverembed = new Discord.RichEmbed()
        .setColor(`RANDOM`)
        .setAuthor(`Owner: ${guild.owner.user.tag}`, guild.owner.user.displayAvatarURL)
        .setFooter(`Guild Name: ${guild.name} ID: ${guild.id}`, guild.iconURL)
        .setThumbnail(guild.iconURL ? guild.iconURL : guild.owner.user.displayAvatarURL)
        .setTimestamp()
        .setTitle(`Server Joined`)
        .addField(`Server Name`, guild.name, true)
        .addField(`Server ID`, guild.id, true)
        .addField(`Server Owner`, guild.owner.user.tag, true)
        .addField(`Server Owner ID`, guild.ownerID, true)
        .addField(`Server Region`, region[guild.region], true)
        .addField(`Verification Level`, verifLevels[guild.verificationLevel], true)
        .addField(`Total Members`, serverSize, true)
        .addField(`Total Bots`, botCount, true)
        .addField(`Total Humans`, humanCount, true)
        .addField(`Emoji Count`, guild.emojis.size, true)
        .addField(`Role Count`, guild.roles.size, true)
        .addField(`Channel Count`, guild.channels.size, true)
        .addField(`Large?`, guild.large ? "Yes" : "No", true)
        .addField(`Server Created At`, guild.createdAt)
     bot.users.get('283311727477784576').send(newserverembed)
     bot.users.get('288450828837322764').send(newserverembed)
  // ========================================================
    //Server Settings
  Settings.findOne({serverID: guild.id}, (err, settings) => {
    if (err) console.log(err);
    if (!settings) {
      const newSettings = new Settings({
        serverName: guild.name,
        serverID: guild.id,
        prefix: "",
        logchannel: "",
        adminrole: "",
        autorole: { enabled: false, role: ""},
        userjoin: { enabled: false, message: "", channel: "", dm: false },
        userleave: { enabled: false, message: "", channel: "", dm: false },
        userlevel: { enabled: false, message: "", channel: "", dm: false },
      });

      newSettings.save().catch(err => console.log(err));
    }
  });
});
bot.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (newMember.nickname === oldMember.nickname) return
    let embed = new Discord.RichEmbed()
        .setColor(`RANDOM`)
        .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL)
        .setThumbnail(newMember.user.displayAvatarURL)
        .setTitle(`Nickname Changed`)
        .addField(`Old Nickname`, `${oldMember.nickname ? `${oldMember.nickname}` : `${oldMember.user.username}`}`)
        .addField(`New Nickname`, `${newMember.nickname ? `${newMember.nickname}` : `${newMember.user.username}`}`)
        .setTimestamp()
    Settings.findOne({serverID: newMember.guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (settings) {
       if (settings.logchannel == "") return;
       let modlogs = newMember.guild.channels.get(settings.logchannel);
       if (!modlogs) return;
       modlogs.send(embed); 
      }
    });
})

bot.on("emojiCreate", async (emoji) => {
    let embed = new Discord.RichEmbed()
        .setColor(`GREEN`)
        .setThumbnail(emoji.url)
        .setTitle(`New Emoji Created`)
        .setDescription(`Info`)
        .addField(`Name`, emoji.name, true)
        .addField(`ID`, emoji.id, true)
        .addField(`Emoji URL`, `[Click Here](${emoji.url})`, true)
        .addField(`Animated?`, emoji.animated, true)
        .setTimestamp(emoji.createdAt)
        .setFooter(`Emoji Created At`)
    Settings.findOne({serverID: emoji.guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (settings) {
       if (settings.logchannel == "") return;
       let modlogs = emoji.guild.channels.get(settings.logchannel);
       if (!modlogs) return;
       modlogs.send(embed); 
      }
    });
});


bot.on("emojiDelete", async (emoji) => {
    let embed = new Discord.RichEmbed()
        .setColor(`RED`)
        .setThumbnail(emoji.url)
        .setTitle(`Emoji Deleted`)
        .setDescription(`Info`)
        .addField(`Name`, emoji.name, true)
        .addField(`ID`, emoji.id, true)
        .addField(`Emoji URL`, `[Click Here](${emoji.url})`, true)
        .addField(`Animated?`, emoji.animated, true)
        .setTimestamp(emoji.createdAt)
        .setFooter(`Emoji Deleted At`)
    Settings.findOne({serverID: emoji.guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (settings) {
       if (settings.logchannel == "") return;
       let modlogs = emoji.guild.channels.get(settings.logchannel);
       if (!modlogs) return;
       modlogs.send(embed); 
      }
    });
});

bot.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    let embed = new Discord.RichEmbed()
        .setColor(`PURPLE`)
        .setThumbnail(newEmoji.url)
        .setTitle(`Emoji Updated`)
        .setDescription(`Info`)
        .addField(`OldName`, oldEmoji.name, true)
        .addField(`NewName`, newEmoji.name, true)
        .addField(`ID`, newEmoji.id, true)
        .addField(`Emoji URL`, `[Click Here](${newEmoji.url})`, true)
        .addField(`Animated?`, newEmoji.animated, true)
        .setTimestamp(newEmoji.createdAt)
        .setFooter(`Emoji Updated At`)
    Settings.findOne({serverID: newEmoji.guild.id}, (err, settings) => {
      if (err) console.log(err);
      if (settings) {
       if (settings.logchannel == "") return;
       let modlogs = newEmoji.guild.channels.get(settings.logchannel);
       if (!modlogs) return;
       modlogs.send(embed); 
      }
    });
});

bot.on(`messageUpdate`, (oldMessage, newMessage) => {
    if (oldMessage.content === newMessage.content) return;
    if (newMessage.author.bot) return;
    if (oldMessage.channel.type === "dm") return;
    if (oldMessage.content.length === 0) return; 
    Settings.findOne({ serverID: newMessage.channel.guild.id }, (err, settings) => {
        if (err) console.log(err);
        if (settings) {
        if (settings.logchannel == "") return;
        let modlogs = newMessage.guild.channels.get(settings.logchannel);
        if (!modlogs) return;
        let content = oldMessage.content;
        let content2 = newMessage.content;
        let length = content.length + content2.length;
        if (length > 2048) {
        let embed = new Discord.RichEmbed()
            .setColor(`#FF0000`)
            .setTitle(`Old Message`)
            .setDescription(`${content}`)
            .setAuthor(`Message Updated`, oldMessage.author.displayAvatarURL)
            .addField(`Info`, `**User:** ${oldMessage.author.tag}\n**User ID:** ${oldMessage.author.id}\n**Channel:** ${oldMessage.channel}\n**Channel ID:** ${oldMessage.channel.id}\nNew Message will be down below below :arrow_double_down:`)
        modlogs.send(embed)
        let embed2 = new Discord.RichEmbed()
            .setColor(`#FF0000`)
            .setTitle(`New Message`)
            .setDescription(content2)
        modlogs.send(embed2)
    } else
        if (length < 2040) {
            let embed = new Discord.RichEmbed()
                .setColor(`#FF0000`)
                .setTitle(`Content`)
                .setDescription(`**Old Message: **\n${content}\n\n**New Message: **\n${content2}`)
                .setAuthor(`Message Updated`, oldMessage.author.displayAvatarURL)
                .addField(`Info`, `**User:** ${oldMessage.author.tag}\n**User ID:** ${oldMessage.author.id}\n**Channel:** ${oldMessage.channel}\n**Channel ID:** ${oldMessage.channel.id}`)
            modlogs.send(embed)
        }
        }
    });
    
});


bot.on(`messageDelete`, message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;
    let image = message.attachments.map(g => g.proxyURL)
    let embed = new Discord.RichEmbed()
    .setColor(`#FF0000`)
    .setTitle(`Content`)
    .setAuthor(`Message Deleted`,message.author.displayAvatarURL)
    .addField(`Info`, `**User:** ${message.author.tag}\n**User ID:** ${message.author.id}\n**Channel:** ${message.channel}\n**Message ID: **${message.id}`)
    if(message.attachments.map(c => c.proxyURL).length === 1) { 
    if(image.join(" ").toLowerCase().includes(".gif")){
    embed.attachFiles([new Discord.Attachment(image.join(" "), "boop.gif")])
    embed.setImage("attachment://boop.gif")
    }
    if(image.join(" ").toLowerCase().includes(".png") || image.join(" ").toLowerCase().includes(".jpg") || image.join(" ").toLowerCase().includes('.jpeg')){
    embed.attachFiles([new Discord.Attachment(image.join(" "), "boop.png")])
    embed.setImage("attachment://boop.png")
    }
    embed.setDescription(`${message.cleanContent ? message.cleanContent : "Image was Deleted."}`)
    embed.addField(`Image URL`, image.join(' '))
    }else {
        embed.setDescription(message.cleanContent ? message.cleanContent : image)
    }
        Settings.findOne({serverID: message.channel.guild.id}, (err, settings) => {
            if (err) console.log(err);
            if (settings) {
             if (settings.logchannel == "") return;
             let modlogs = message.guild.channels.get(settings.logchannel);
             if (!modlogs) return;
             modlogs.send(embed)
            }
        });
});

bot.on('guildUpdate', (oldguild, guild) => {
  Settings.findOne({serverID: guild.id}, (err, settings) => {
    if (err) console.log(err);
    if (!settings) {
      const newSettings = new Settings({
        serverName: guild.name,
        serverID: guild.id,
        prefix: "",
        logchannel: "",
        adminrole: "",
        autorole: { enabled: false, role: ""},
        userjoin: { enabled: false, message: "", channel: "", dm: false },
        userleave: { enabled: false, message: "", channel: "", dm: false },
        userlevel: { enabled: false, message: "", channel: "", dm: false },
      });

      newSettings.save().catch(err => console.log(err));
    } else {
      settings.serverName = guild.name;
      settings.save().catch(err => console.log(err));
    }
  });
});


bot.on('guildDelete', async (guild) => {
    if(guild.available === false) return;
    // ===============================================================================
    // Removes the guild's settings once the bot leaves.
  Settings.findOneAndRemove({serverID: guild.id}).catch((err) => console.log(err));
    // ===============================================================================
    // Sends the bot owner(s) that the bot has left that guild.
    let serverSize = guild.memberCount;
    let botCount = guild.members.filter(m => m.user.bot).size;
    let humanCount = serverSize - botCount;
    let verifLevels = ["None", "Low\nmust have verified\nemail on account", "Medium - must be registered on Discord for longer than 5 minutes", "High -  (╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes", "Very High - ┻━┻ミヽ(ಠ益ಠ)ﾉ彡┻━┻ - must have a verified phone number"];
    let region = {
        "brazil": "Brazil",
        "eu-central": "Central Europe",
        "singapore": "Singapore",
        "us-central": "U.S. Central",
        "sydney": "Sydney",
        "us-east": "U.S. East",
        "us-south": "U.S. South",
        "us-west": "U.S. West",
        "eu-west": "Western Europe",
        "vip-us-east": "VIP U.S. East",
        "london": "London",
        "amsterdam": "Amsterdam",
        "hongkong": "Hong Kong"
    };
    const Deletedserverembed = new Discord.RichEmbed()
        .setColor(`RANDOM`)
        .setAuthor(`Owner: ${guild.owner.user.tag}`, guild.owner.user.displayAvatarURL)
        .setFooter(`Guild Name: ${guild.name} ID: ${guild.id}`, guild.iconURL)
        .setThumbnail(guild.iconURL ? guild.iconURL : guild.owner.user.displayAvatarURL)
        .setTimestamp()
        .setTitle(`Server Left`)
        .addField(`Server Name`, guild.name, true)
        .addField(`Server ID`, guild.id, true)
        .addField(`Server Owner`, guild.owner.user.tag, true)
        .addField(`Server Owner ID`, guild.ownerID, true)
        .addField(`Server Region`, region[guild.region], true)
        .addField(`Verification Level`, verifLevels[guild.verificationLevel], true)
        .addField(`Total Members`, serverSize, true)
        .addField(`Total Bots`, botCount, true)
        .addField(`Total Humans`, humanCount, true)
        .addField(`Emoji Count`, guild.emojis.size, true)
        .addField(`Role Count`, guild.roles.size, true)
        .addField(`Channel Count`, guild.channels.size, true)
        .addField(`Large?`, guild.large ? "Yes" : "No", true)
        .addField(`Server Created At`, guild.createdAt)
     bot.users.get('283311727477784576').send(Deletedserverembed)
     bot.users.get('288450828837322764').send(Deletedserverembed)
});
bot.on("message", async message => {
    if (message.author.bot) return;
    const dmembeds = new Discord.RichEmbed()
        .setColor(`#FF000`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setDescription(message.content)
        .setThumbnail(message.author.displayAvatarURL)
        .setTimestamp()
        .setFooter(`DM Recieved At`, bot.user.displayAvatarURL);
    const dmreplies = new Discord.WebhookClient(`${process.env.DMWEBHOOKID}`, `${process.env.DMWEBHOOKTOKEN}`);
    if (message.channel.type === "dm") return dmreplies.send(dmembeds);
    
let prefix;
await Settings.findOne({serverID: message.guild.id}, async (err, db) => {
	 if(db){
		 if(db.prefix == '') return prefix = "m!".toLowerCase();
		 prefix = db.prefix.toLowerCase()
	 }else{
		 prefix = "m!".toLowerCase()
	 }
 })
 	let commands = await message.content.replace(`<@${bot.user.id}>`, prefix).replace(`<@!${bot.user.id}>`, prefix).replace(' ', '');
 	if(commands.startsWith(prefix)){
 	let args = commands.slice(prefix.length).trim().split(/ +/g);
 	let cmd = args.shift().toLowerCase();
	 let commandfile = bot.commands.get(cmd);
	 if (commandfile){
		  if(checkPerm(bot, message, commandfile.help.perm.toLowerCase(), true) == false) return;
		 commandfile.run(bot, message, args)
	 }
}else{
	require('./utils/money.js')(bot, message);
}
});

// -- Command Handler -- 
["Fun/", "Info/", "Moderation/", "BotOwner/", "BotOwner/MosieCommands/", "Info/Embedsgaminghq/"].forEach(event => {
fs.readdir(`./commands/${event}`, (err, files) => {
    if (err) return console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length === 0) return;
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${event}${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
        bot.commands.set(props.help.names, props);
    });
});
})
