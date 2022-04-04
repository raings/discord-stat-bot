const { Client, Collection } = require("discord.js");
const client = (global.client = new Client());
const settings = require("./src/configs/settings.json");
const config = require("./src/configs/config.json");
const fs = require("fs")
const logs = require("discord-logs");

client.commands = new Collection();
client.aliases = new Collection();
client.invites = new Collection();
client.wait = require("util").promisify(setTimeout);
client.cooldown = new Map();
client.ranks = [{ role: "923564102243196997", coin: 10 }, { role: "923564102280962120", coin: 20 }];


require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");


client
  .login(settings.token)
  .then(() => console.log("[BOT] Bot connected!"))
  .catch(() => console.log("[BOT] Bot can't connected!"));

 


  
 