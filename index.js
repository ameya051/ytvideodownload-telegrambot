const TelegramBot = require("node-telegram-bot-api");
const ytdl = require("ytdl-core");
const dotenv = require("dotenv");

dotenv.config();

// Telegram bot token obtained from BotFather
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Command to handle video download requests
bot.onText(/\/download/, async (msg) => {
  const chatId = msg.chat.id;
  const videoUrl = msg.text.replace("/download", "").trim();

  try {
    // Download the video using ytdl-core
    const videoInfo = await ytdl.getInfo(videoUrl);
    const videoTitle = videoInfo.videoDetails.title;
    const videoFormats = ytdl.filterFormats(videoInfo.formats, "videoandaudio");
    const highestQualityFormat = ytdl.chooseFormat(videoFormats, {
      quality: "highest",
    });

    // Send the video as a download link
    bot.sendMessage(
      chatId,
      `Download: ${videoTitle}\n${highestQualityFormat.url}`
    );
  } catch (error) {
    console.error("Error downloading video:", error);
    bot.sendMessage(chatId, "Sorry, there was an error downloading the video.");
  }
});

// Welcome message
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Hello, welcome to your Telegram bot! Send /download followed by a YouTube video URL to download the video."
  );
});
