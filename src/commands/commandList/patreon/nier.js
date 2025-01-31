/*
 * OwO Bot for Discord
 * Copyright (C) 2022 Christopher Thai
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
  */

const CommandInterface = require('../../CommandInterface.js');

const emoji = "<:nierchip:956489707829743636>";
const owner = "282666590565171210";
const data = "nier2";

module.exports = new CommandInterface({

	alias:["nier"],

	args:"{@user}",

	desc: "Plug-in Chips are items that you can acquire for Skills. Enjoy it. This command was created by ?" + owner + "?",

	example:[],

	related:[],

	permissions:["sendMessages"],

	group:["patreon"],

	cooldown:15000,

	execute: async function(p){
		if(p.args.length==0){
			display(p);
			p.setCooldown(5);
		}else{
			let user = p.getMention(p.args[0]);
			if(!user){
				user = await p.fetch.getMember(p.msg.channel.guild,p.args[0]);
				if(!user){
					p.errorMsg(", Invalid syntax! Please tag a user!",3000);
					p.setCooldown(5);
					return;
				}
			}
			if(user.id==p.msg.author.id){
				p.errorMsg(", You cannot give it yourself!!",3000);
				p.setCooldown(5);
				return;
			}
			give(p,user);
		}
	}
});

async function display(p){
	let count = await p.redis.hget("data_"+p.msg.author.id, data);
	if(!count) count = 0;

	p.replyMsg(emoji, ", you currently have "+count+" "+emoji+" **Plug-in chip**!");
}

async function give(p, user){
	if(p.msg.author.id!=owner){
		let result = await p.redis.hincrby("data_"+p.msg.author.id, data, -1);

		// Error checking
		if(result==null||result<0){
			if(result<0) p.redis.hincrby("data_"+p.msg.author.id, data, 1);
			p.errorMsg(", you do not have any **Plug-in chips** to give! >:c",3000);
			p.setCooldown(5);
			return;
		}
	}

	await p.redis.hincrby("data_"+user.id, data, 1);
	p.send(`${emoji} **| ${user.username}**, you have been given 1 **Plug-in chip**.`);
}
