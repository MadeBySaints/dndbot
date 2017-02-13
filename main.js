/*
File: main.js
Author: MadeBySaints
Created: 01/20/2017
Description: Main Bot File
version: 0.0.1
*/

const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const bot = new Commando.Client();
const prefix = Commando.commandPrefix = '//';


//define database connection settings
const mysql = require('mysql');
var connection = mysql.createPool( {
    host: '127.0.0.1',
    port: '3306',
    user: 'dndbot',
    password: 'password',
    database: 'dndbot'
});
connection.on('enqueue', function() {
    console.log('Waiting for available connection slot')
});
connection.on('acquire', function(connection) {
    console.log('Success! Connected to database on thread ID %d.', connection.threadId)
});
connection.on('connection', function(connection) {
    connection.query('SET SESSION auto_increment_increment=1')
});
connection.on('release', function(connection) {
    console.log('Connection thread %d released.', connection.threadId)
});
//to call this use a connection.query


//STARTUP FUNCTIONS
//sets the name of the game the bot is playing.
bot.on('ready', () => {
    bot.user.setGame('//help for commands');
    console.log("Dungeons And Discords bot online and ready! Serving " + bot.guilds.size + " Servers!");
    connection.getConnection(function(err) {//connect to database
        if (err) {
            console.error('ERROR CONNECTING TO DATABASE: ' + err.stack);
            connection.end(function(err) {//terminates connection on error
                return;
            })
        };
    });
});

//MESSAGE FUNCTIONS
bot.on("message", (message) => {
    if(message.author.bot) return;
        else if(message.channel.id != 1234567890/*channelId*/) return;//this is the bot testing channel for your preferred channel.
        else if(message.content === prefix + 'ping') {
            var isGameCommand = 'no';
            var umid = message.author.id.toString() + message.content + isGameCommand;
            //short term unique message id; should be valid long enough to not clash with other users
            message.channel.sendMessage('`Pong!`');
        }
        else if(message.content === prefix + 'buy') {
            var isGameCommand = 'yes';
            var umid = message.author.id.toString() + message.content + isGameCommand;
            message.channel.sendMessage(umid);
        }
        //new player registration command.
        //this section is not complete yet, and must be fully linked to the database
        //best to comment it all out unless you know what to do to handle it.
        else if(message.content === prefix + 'register') {
            connection.query('INSERT INTO tablename SET ?', {ColumnName: message.author.id}, function (error, results, fields) {
                if (error) throw error;
                console.log(results.insertId);
            });
            message.channel.sendMessage('undefined')
            //add check database to see if player exists, if already exist, use return;
        }
        else if(message.content === prefix + 'go') {
            var isGameCommand = 'yes';
            message.channel.sendMessage('You go!')
        }
        else if(message.content === prefix + "bp") {
            var isGameCommand = 'yes';
            message.channel.sendMessage('Backpack contents: ')
        }
        else if(message.content === prefix + "shop") {
            var isGameCommand = 'yes';
            //add stuff here
            message.channel.sendMessage('```Shop Inventory:```' + '\n' + '`Potion`' + '\n' + '`Ring`')
        }
        else if(message.content === prefix + "str") {
            var isGameCommand = 'yes';
            message.channel.sendMessage('currently undefined')
        }
        else if(message.content === prefix + "def") {
            var isGameCommand = 'yes';
            message.channel.sendMessage('currently undefined')
        }
        else if(message.content === prefix + "luk") {
            var isGameCommand = 'yes';
            message.channel.sendMessage('currently undefined')
        }
        else if(message.content === prefix + "dice") {
            var isGameCommand = 'no';
            var x = Math.floor(Math.random() * 6) + 1;
            message.reply('You rolled a ' + x)
        }
        else if(message.content === prefix + "help") {
            var isGameCommand = 'yes';
            message.reply('Current commands available:' + '\n' +
                '```//help - ' + 'Shows a list of commands.' + '\n' + '\n' +
                '//ping - ' + 'Pings the server.' + '\n' + '\n' +
                '//register - ' + 'Registers you, and enables you to use game commands such as "//go".' + '\n' + '\n' +
                '//go - ' + 'Used to advance battle and adventure. This is the main command.' + '\n' + '\n' +
                '//bp - ' + 'Opens your backpack. Backpack can hold up to 8 items currently.' + '\n' + '\n' +
                '//shop - ' + 'Shows the list of buyable items.' + '\n' + '\n' +
                '//str, //def, //luk - ' + 'Assigns available AP to one of these attributes.' + '\n' + '\n' +
                '//dice - ' + 'Rolls a 6-sided die```')
        }
        else if(message.content === prefix + "use") {
            var isGameCommand = 'yes';
            message.channel.sendMessage('currently undefined')
        }
        else if(message.content === prefix + "servers") {
            var isGameCommand = 'no';
            message.channel.sendMessage('DnDBot is used by ' + bot.guilds.size + ' servers! :D');
            console.log(message.author.username + ' called //servers')
            //this console log is not permanent
        }
        else if(message.content === prefix + "dStats") {
            var isGameCommand = 'yes';
            message.channel.sendMessage('currently undefined')
        }
    if(isGameCommand === 'yes'){
        console.log('game command ' + message.content + ' used');
    }
});

bot.login('Your Bot Token Goes Here');
