const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  User,
  EmbedBuilder,
  Options,
} = require("discord.js");
const fs = require("fs");
const Distube = require("distube").default;
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { filters, options } = require("../settings/config");

class JUGNU extends Client {
  constructor() {
    super({
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      shards: "auto",
      makeCache: Options.cacheWithLimits({
        ApplicationCommandManager: {
          maxSize: 0,
        },
        BaseGuildEmojiManager: {
          maxSize: 0,
        },
        GuildBanManager: {
          maxSize: 0,
        },
        GuildStickerManager: {
          maxSize: 0,
        },
        GuildScheduledEventManager: {
          maxSize: 0,
        },
        ReactionUserManager: {
          maxSize: 0,
        },
        PresenceManager: {
          maxSize: 0,
        },
        GuildInviteManager: {
          maxSize: 0,
        },
        ReactionManager: {
          maxSize: 0,
        },
        MessageManager: {
          maxSize: 0,
        },
      }),
      failIfNotExists: false,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });

    this.events = new Collection();
    this.cooldowns = new Collection();
    this.mcommands = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.shuffleData = new Collection();
    this.mcategories = fs.readdirSync("./Commands/Message");
    this.scategories = fs.readdirSync("./Commands/Slash");
    this.temp = new Collection();
    this.config = require("../settings/config");
    this.distube = new Distube(this, {
      leaveOnEmpty: false,
      leaveOnFinish: false,
      leaveOnStop: true,
      plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true,
          parallel: true,
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin({
          update: false,
        }),
      ],
      emitNewSongOnly: false,
      savePreviousSongs: true,
      searchSongs: 0,
      customFilters: filters,
    });
  }

  start(token) {
    ["handler", "DistubeEvents", "utils"].forEach((handler) => {
      require(`./${handler}`)(this);
    });
    this.login(token);
  }
  /**
   *
   * @param {User} user
   * @returns
   */
  getFooter(user) {
    let obj = {
      text: `Requested By ${user.tag}`,
      iconURL: user.displayAvatarURL(),
    };
    if (options.embedFooter) {
      return obj;
    } else {
      return {
        text: " ",
        iconURL: " ",
      };
    }
  }

  embed(interaction, data) {
    let user = interaction.user ? interaction.user : interaction.author;
    if (interaction.deferred) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`>>> ${data.substring(0, 3000)}`)
              .setFooter(this.getFooter(user)),
          ],
        })
        .catch((e) => {});
    } else {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`>>> ${data.substring(0, 3000)}`)
              .setFooter(this.getFooter(user)),
          ],
        })
        .catch((e) => {});
    }
  }
}

module.exports = JUGNU;
