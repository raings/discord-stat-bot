const moment = require("moment");
const Discord = require("discord.js")
require("moment-duration-format");
const conf = require("../configs/config.json");
const messageUserChannel = require("../schemas/messageUserChannel");
const voiceUserChannel = require("../schemas/voiceUserChannel");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const voiceUserParent = require("../schemas/voiceUserParent");
const coin = require("../schemas/coin");
const taggeds = require("../schemas/taggeds");

const messageGuild = require("../schemas/messageGuild");
const messageGuildChannel = require("../schemas/messageGuildChannel");
const voiceGuild = require("../schemas/voiceGuild");
const voiceGuildChannel = require("../schemas/voiceGuildChannel");


module.exports = {
	conf: {
	  aliases: [],
	  name: "me",
	  help: "me"
	},

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {Array<string>} args
	 * @param {MessageEmbed} embed
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args) => {
       

       
        let yardım = new Discord.MessageEmbed().setColor(message.member.displayHexColor).setFooter(moment(Date.now()).format("LLL")).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
        const category = async (parentsArray) => {
			const data = await voiceUserParent.find({ guildID: message.guild.id, userID: message.author.id });
			const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
			let voiceStat = 0;
			for (var i = 0; i <= voiceUserParentData.length; i++) {
				voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
			}
			return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
		};

        const filter = (reaction, user) => {
            return ["⌚","💰","🔊"].includes(reaction.emoji.name) && user.id === message.author.id && reaction.users.remove(message.author.id);
          };

          const messageChannelData = await messageGuildChannel.find({ guildID: message.guild.id }).sort({ channelData: -1 });
          const voiceChannelData = await voiceGuildChannel.find({ guildID: message.guild.id }).sort({ channelData: -1 });
          const messageUsersData = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
          const voiceUsersData = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
          const messageGuildData = await messageGuild.findOne({ guildID: message.guild.id });
          const voiceGuildData = await voiceGuild.findOne({ guildID: message.guild.id });
      


          
          let coinSum = 0;
      
          const messageChannels = messageChannelData.splice(0, 5).map((x, index) => `\`${index+1}.\` <#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join(`\n`);
          const voiceChannels = voiceChannelData.splice(0, 5).map((x, index) => `\`${index+1}.\` <#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika] s [saniye]")}\``).join(`\n`);
          const messageUsers = messageUsersData.splice(0, 5).map((x, index) => `\`${index+1}.\` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``).join(`\n`);
          const voiceUsers = voiceUsersData.splice(0, 5).map((x, index) => `\`${index+1}.\` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika] s [saniye]")}\``).join(`\n`);


		const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: message.author.id }).sort({ channelData: -1 });
		const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: message.author.id }).sort({ channelData: -1 });
		const voiceLength = Active2 ? Active2.length : 0;
		let voiceTop;
		let messageTop;
		Active1.length > 0 ? messageTop = Active1.splice(0, 5).map(x => `<#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Veri bulunmuyor.";
		Active2.length > 0 ? voiceTop = Active2.splice(0, 5).map(x => `<#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika] s [saniye]")}\``).join("\n") : voiceTop = "Veri bulunmuyor.";

		const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: message.author.id });
		const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: message.author.id });

		const messageDaily = messageData ? messageData.dailyStat : 0;
		const messageWeekly = messageData ? messageData.weeklyStat : 0;

		const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika] s [saniye]");
		const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika] s [saniye]");


		const filteredParents = message.guild.channels.cache.filter((x) =>
			x.type === "category" &&
			!conf.publicParents.includes(x.id) &&
			!conf.registerParents.includes(x.id) &&
			!conf.solvingParents.includes(x.id) &&
			!conf.privateParents.includes(x.id) &&
			!conf.aloneParents.includes(x.id) &&
			!conf.funParents.includes(x.id)
		);

        const coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });


        const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];
        const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: message.author.id });

               const coinStatus = conf.staffs.some(x => message.member.roles.cache.has(x)) ? `    <a:yildiz2:968621208033693697> **Kullanıcı Durumu**:

**Puan Durumu** ${taggedData ? `\nTag aldırdığı üye sayısı: \`${taggedData.taggeds.length}\`` : ""}
        - Puanınız: \`${coinData ? coinData.coin : 0}\`, Gereken: \`${maxValue.coin}\` 
        ${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 8)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`
        ${client.ranks[client.ranks.indexOf(maxValue)-1] ? `**───────────────** 
        **Terfi Durumu:** 
        ${maxValue !== client.ranks[client.ranks.length-1] ? `Şu an <@&${client.ranks[client.ranks.indexOf(maxValue)-1].role}> rolündesiniz. <@&${maxValue.role}> rolüne ulaşmak için \`${maxValue.coin-coinData.coin}\` coin gerekiyor!` : "Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz."}` : `**───────────────** 
        **Terfi Durumu:** 
        <@&${maxValue.role}> rolüne ulaşmak için \`${maxValue.coin - (coinData ? coinData.coin : 0)}\` coin gerekiyor!
        `}` : "";
        let color, description;
        if (message.member.lastMessageID) {
          let lastSeen = Date.now() - message.member.lastMessage.createdTimestamp;
          let seconds = lastSeen / 1;
          let days = parseInt(seconds / 86400);
          seconds = seconds % 86400;
          let hours = parseInt(seconds / 3600);
          seconds = seconds % 3600;
          let minutes = parseInt(seconds / 60);
          seconds = parseInt(seconds % 60);
    
          lastSeen = `${seconds} Saniye`;
          if (days) {
            lastSeen = `${days} Gün ${hours} Saat ${minutes} Dakika ${seconds} Saniye`;
          } else if (hours) {
            lastSeen = `${hours} Saat ${minutes} Dakika ${seconds} Saniye`;
          } else if (minutes) {
            lastSeen = `${minutes} Dakika /${seconds} Saniye`;
          }
        
		yardım.setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }));
		yardım.setDescription(`
    ${message.author.toString()} (${message.member.roles.highest}) mesaj ve ses verileri
  
    ${coinStatus}

    :loud_sound: **Ses Bilgileri:**
    \`\`\`css
● Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika] s [saniye]")}\`

● Public Odalar: \`${await category(conf.publicParents)}\`
● Kayıt Odaları: \`${await category(conf.registerParents)}\`
● Sorun Çözme & Terapi: \`${await category(conf.solvingParents)}\`
● Private Odalar: \`${await category(conf.privateParents)}\`
● Game Odalar: \`${await category(conf.aloneParents)}\`
● Oyun & Eğlence Odaları: \`${await category(conf.funParents)}\`

● Diğer: \`${await category(filteredParents.map(x => x.id))}\`\`\`\`


    
   📝 **Metin Bilgileri**   
    \`\`\`css
● Toplam Mesaj: ${Number(messageWeekly).toLocaleString()}\`\`\`
        
**Son Görülme:** \`${lastSeen}\`

    `);
        };
    var menü = await message.channel.send(yardım)
    const collector = menü.createReactionCollector(filter, { time: 99999 });
    let emojiler = ["⌚","💰","🔊"]
    menü.react(emojiler[0])
    menü.react(emojiler[1])
    menü.react(emojiler[2])
    collector.on('collect', (reaction, user) => {
        if(reaction.emoji.name == "💰") {
            const Advanced = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setDescription(`     
        **➥ Sesli Kanal Bilgileri: (\`Toplam ${voiceLength} kanal\`)**
        ${voiceTop}

        **➥ Mesaj Bilgileri: (\`Toplam ${messageData ? messageData.topStat : 0} mesaj\`)**
        ${messageTop}


`)
Advanced.addField("Ses Verileri:", `
\`•\` Haftalık Ses: \`${voiceWeekly}\`
\`•\` Günlük Ses: \`${voiceDaily}\`
`, true);
Advanced.addField("Mesaj Verileri:", `
\`•\` Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
\`•\` Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
`, true);
        menü.edit(Advanced)
    }
    if(reaction.emoji.name == "⌚") {
        menü.edit(yardım)
         }
});

collector.on('collect', (reaction, user) => {
    if(reaction.emoji.name == "🔊") {
        const sd = new Discord.MessageEmbed()
    .setColor("BLACK")
    .setDescription(`     
    ${message.guild.name} sunucusunun toplam verileri
    **───────────────**
    
    **➥ Ses Bilgileri: (\`Toplam ${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("H [saat], m [dakika] s [saniye]")}\`)**
    ${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}
    
    **➥ Ses Kanal Bilgileri:**
    ${voiceChannels.length > 0 ? voiceChannels : "Veri Bulunmuyor."}
    
    **───────────────**
    
    **➥ Mesaj Bilgileri: (\`Toplam ${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()} mesaj\`)**
    ${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}
    
    **➥ Mesaj Kanal Bilgileri:**
    ${messageChannels.length > 0 ? messageChannels : "Veri Bulunmuyor."}
`)

    menü.edit(sd)
}
if(reaction.emoji.name == "⌚") {
    menü.edit(yardım)
     }
});
}

};



function progressBar(value, maxValue, size) {
    const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
    const emptyProgress = size - progress > 0 ? size - progress : 0;
    
    const progressText = "<a:bar2:925699169677611058>".repeat(progress);
    const emptyProgressText = "<:bo2:925699169669230632>".repeat(emptyProgress);
    
    return emptyProgress > 0 ? `<a:bar1:925699169480482826>${progressText}${emptyProgressText}<:bo3:925699169941864518>` : `<a:bar1:925699169480482826>${progressText}${emptyProgressText}<a:bar3:925699169618903060>`;
    };
