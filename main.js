const { Telegraf } = require('telegraf')
const { v4: uuidv4 } = require('uuid');
const shell = require("shelljs")
require("dotenv").config()

const bot = new Telegraf(process.env.BOT_TOKEN)
const ownerID = process.env.OWNER_ID
const baseUrl = process.env.BASE_URL
bot.start((ctx) => ctx.reply('Hi Telegram User'))
bot.help((ctx) => ctx.reply('This is a Video Streamer Bot based on FFMPEG'))
bot.command('stream', async (ctx) => {
    if (ctx.message.from.id == ownerID) {
        let link = ctx.message.text.split(" ")[1]
        let ffmpeg_err = shell.exec("ffmpeg -version", { silent: true }).stderr.trim()
        console.log(ffmpeg_err)
        if (ffmpeg_err !== "") {
            console.log("FFMPEG Not Installed")
        } else {
            let uniqueId = uuidv4()
            await ctx.reply(`Your video is now being Streamed to ${baseUrl}${uniqueId}`)
            shell.exec(`ffmpeg -re -i "${link}" -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -f flv ${baseUrl}${uniqueId}`, { async: true })
        }
    }
})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))