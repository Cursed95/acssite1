// © Lei WebScript - is.gd/leidc
/*-------------- SISTEM AYARLARI --------------*/
var abone = "940931145783189545"
var sistem = {
  botID: "787027609195249725",
  botToken: "Nzg3MDI3NjA5MTk1MjQ5NzI1.GgyNh5.phzFUCD7x0h3UexoclLoeNltt69k4_o4jMqTyQ",
  secret: "hqKYN9wgNRYj4oFrv7EhEMph3jNGldVq",
  callbackURL: "https://angelcodeshare.tech/callback",
  sunucuID: "940915848372170802",
  sunucuDavet: "https://discord.gg/6RnA7NPswp",
  kodLog: "941959516008898560",
  tavsiyeLog: "941959571335938068",
  kodPaylasimci: "940931380106379295",
  kodSilici: "940932656705720360",
  css: abone,
  html: abone,
  aoi: abone,
  bdfd: abone
};
/*-------------- DİĞER AYARLAR --------------*/
var diger = {
  NotFoundHataMesaj: "Sayfa Bulunamadı.",
  RolunYokHataMesaj: "Abone Rolün Yok.",
  embedRenk: "2A2A2B",
EmbedResim: "https://cdn.discordapp.com/icons/786282128584736809/a_00c8f9eca03e6b9c89dc335ad5ee11e4.gif?size=2048"
}
var express = require('express');
var http = require('http');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var handlebars = require("express-handlebars");
var url = require("url");
var session = require("express-session");
var Discord = require("discord.js");
var handlebarshelpers = require("handlebars-helpers")();
var path = require("path");
var passport = require("passport");
var { Strategy } = require("passport-discord");
var bookman = require("bookman");
var client = new Discord.Client();
const disbut = require('discord-buttons');
const rateLimit = require("express-rate-limit");
disbut(client)
const publicIp = require('public-ip');
const db = (global.db = {});

let datas = ["aoijs", "bdfd", "discordjs", "html", "diger", "altyapi"];
for (let daata in datas) {
  db[datas[daata]] = new bookman(datas[daata]);
}

var app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false
  })
);
app.use(cookieParser());
app.engine(
  "hbs",
  handlebars({
    defaultLayout: "ana",
    layoutsDir: `${__dirname}/html/ana/`,
    helpers: handlebarshelpers
  })
);
app.set("views", path.join(__dirname, "html"));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "css"));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
var izin = ["identify", "guilds"];
passport.use(
  new Strategy(
    {
      clientID: sistem.botID,
      clientSecret: sistem.secret,
      callbackURL: sistem.callbackURL,
      scope: izin
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }
  )
);
app.use(
  session({
    secret: "secret-session-thing",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get(
  "/join",
  passport.authenticate("discord", {
    scope: izin
  })
);
app.get(
  "/callback",
  passport.authenticate("discord", {
    failureRedirect: "/error"
  }),
  (req, res) => {
    res.redirect("/");
  }
);
app.get("/quit", (req, res) => {
  req.logOut();
  return res.redirect("/");
});
app.get("/dc", (req, res) => {
  res.redirect(sistem.sunucuDavet);
});
(async () => {console.log(await publicIp.v4())})();
app.get("/", (req, res) => {
  res.render("index", {
    user: req.user,
    ip: publicIp.v4()
  });
});

app.get("/bdfd", (req, res) => {
  var kod = db.bdfd.get("kodlar");
  res.render("bdfd", {
    user: req.user,
    kodlar: kod
  });
});
app.get("/bdfd/:id", (req, res) => {
  if (
    !req.user ||
    !req.login
  )
    return res.redirect("/join" );
 if (
    !req.user ||
    !client.guilds.cache.get(sistem.sunucuID).members.cache.has(req.user.id)
  )
    return res.redirect("/dc" );

  var id = req.params.id;
  let code = db.bdfd.get(`kodlar.${id}`);
    let guild = client.guilds.cache.get(sistem.sunucuID);
    let member = req.user ? guild.members.cache.get(req.user.id) : null;
    if (
      member &&
      (member.roles.cache.has(sistem.bdfd))
    ) {
      res.render("kod", {
        user: req.user,
        kod: code
      });
    } else {
      res.redirect(`/hata?m=${diger.RolunYokHataMesaj}`);
    }
});
app.get("/altyapi", (req, res) => {
  var kod = db.altyapi.get("kodlar");
  res.render("altyapi", {
    user: req.user,
    kodlar: kod
  });
});
app.get("/altyapi/:id", (req, res) => {
  if (
    !req.user ||
    !req.login
  )
    return res.redirect("/join" );
if (
    !req.user ||
    !client.guilds.cache.get(sistem.sunucuID).members.cache.has(req.user.id)
  )
    return res.redirect("/dc");

  var id = req.params.id;
  let code = db.altyapi.get(`kodlar.${id}`);
    let guild = client.guilds.cache.get(sistem.sunucuID);
    let member = req.user ? guild.members.cache.get(req.user.id) : null;
    if (
      member &&
      (member.roles.cache.has(sistem.bdfd))
    ) {
      res.render("kod", {
        user: req.user,
        kod: code
      });
    } else {
      res.redirect(`hata?m=${diger.RolunYokHataMesaj}`);
    }
});
app.get("/aoijs", (req, res) => {
  var kod = db.aoijs.get("kodlar");
  res.render("aoi", {
    user: req.user,
    kodlar: kod
  });
});
app.get("/aoijs/:id", (req, res) => {
  if (
    !req.user ||
    !req.login
  )
    return res.redirect("/join" );

  if (
    !req.user ||
    !client.guilds.cache.get(sistem.sunucuID).members.cache.has(req.user.id)
  )
    return res.redirect("/dc");

  var id = req.params.id;
  let code = db.aoijs.get(`kodlar.${id}`);
    let guild = client.guilds.cache.get(sistem.sunucuID);
    let member = req.user ? guild.members.cache.get(req.user.id) : null;
    if (
      member &&
      (member.roles.cache.has(sistem.aoi))
    ) {
      res.render("kod", {
        user: req.user,
        kod: code
      });
    } else {
      res.redirect(`hata?m=${diger.RolunYokHataMesaj}`);
    }
});
app.get("/discordjs", (req, res) => {
  var kod = db.discordjs.get("kodlar");
  res.render("js", {
    user: req.user,
    kodlar: kod
  });
});
app.get("/discordjs/:id", (req, res) => {
  if (
    !req.user ||
    !req.login
  )
    return res.redirect("/join" );
if (
    !req.user ||
    !client.guilds.cache.get(sistem.sunucuID).members.cache.has(req.user.id)
  )
    return res.redirect("/dc");

  var id = req.params.id;
  let code = db.discordjs.get(`kodlar.${id}`);
    let guild = client.guilds.cache.get(sistem.sunucuID);
    let member = req.user ? guild.members.cache.get(req.user.id) : null;
    if (
      member &&
      (member.roles.cache.has(sistem.bdfd))
    ) {
      res.render("kod", {
        user: req.user,
        kod: code
      });
    } else {
      res.redirect(`hata?m=${diger.RolunYokHataMesaj}`);
    }
});
app.get("/html", (req, res) => {
  var kod = db.html.get("kodlar");
  res.render("html", {
    user: req.user,
    kodlar: kod
  });
});
app.get("/html/:id", (req, res) => {
  if (
    !req.user ||
    !req.login
  )
    return res.redirect("/join" );
if (
    !req.user ||
    !client.guilds.cache.get(sistem.sunucuID).members.cache.has(req.user.id)
  )
    return res.redirect(`/dc`);

  var id = req.params.id;
  let code = db.html.get(`kodlar.${id}`);
    let guild = client.guilds.cache.get(sistem.sunucuID);
    let member = req.user ? guild.members.cache.get(req.user.id) : null;
    if (
      member &&
      (member.roles.cache.has(sistem.html))
    ) {
      res.render("kod", {
        user: req.user,
        kod: code
      });
    } else {
      res.redirect(`hata?m=${diger.RolunYokHataMesaj}`);
    }
});
app.get("/kod-panel", (req, res) => {
  if (
    !req.user ||
    !req.login
  )
    return res.redirect("/join" );

 if (
    !req.user ||
    !client.guilds.cache.get(sistem.sunucuID).members.cache.has(req.user.id)
  )
    return res.redirect("/dc" );
  
    let guild = client.guilds.cache.get(sistem.sunucuID);
    let member = req.user ? guild.members.cache.get(req.user.id) : null;
    if (
      member &&
      (member.roles.cache.has(sistem.kodPaylasimci))
    ) {
      res.render("panel", {
        user: req.user,
      });
    } else {
      res.redirect(`hata?m=${diger.RolunYokHataMesaj}`);
    }
});
const randomString = require("random-string");
app.post("/paylas", (req, res) => {
  var k = req.body.kod
  let obj = {
    id: randomString({ length: 10 }),
    isim: req.body.isim,
    bilgi: req.body.bilgi,
    kod: `\n${k}`,
    rank: req.body.rank,
    dcisim: req.user.username,
    date: new Date(Date.now()).toLocaleDateString()
  };
  db[obj.rank].set(`kodlar.${obj.id}`, obj);
let button = new disbut.MessageButton()
    .setLabel("Koda Bak")
    .setStyle("url")
    .setURL(`https://angelcodeshare.tech/${obj.rank}/${obj.id}`);
  var embed = new Discord.MessageEmbed()
    .setColor(diger.embedRenk)
    .setThumbnail(diger.embedResim)
    .setTimestamp()
    .addField("Kod İsmi",`${obj.isim}`)
    .addField("Kod Açıklaması", `${obj.bilgi}`)
    .addField("Paylaşan", `${obj.dcisim}`)
    .addField("Kod Türü", `${obj.rank}`);
  client.channels.cache.get(sistem.kodLog).send("",{
    component: button,
    embed: embed});
  res.redirect(`/${obj.rank}/${obj.id}`);
});
app.post("/sil", (req, res) => {
  let obj = {
    id: req.body.id,
    rank: req.body.rank
  };
  let guild = client.guilds.cache.get(sistem.sunucuID);
    let member = req.user ? guild.members.cache.get(req.user.id) : null;
    if (
      member &&
      (member.roles.cache.has(sistem.kodSilici))
    ) {
  db[obj.rank].delete(`kodlar.${obj.id}`);
  res.redirect(`/`);
  } else {
      res.redirect(`hata?m=${diger.RolunYokHataMesaj}`);
    }
});
app.post("/edit", (req, res) => {
  var k = req.body.kod
  let obj = {
    id: req.body.id,
    isim: req.body.isim,
    bilgi: req.body.bilgi,
    kod: `\n${k}`,
    rank: req.body.rank,
    dcisim: req.user.username,
    date: new Date(Date.now()).toLocaleDateString()
  };
  db[obj.rank].set(`kodlar.${obj.id}`, obj);
  res.redirect(`/${obj.rank}/${obj.id}`);
});
const cd = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 1,
  message:
    "<h1><code>30 Dakika Sonra Tekrar Dene</code></h1>"
});
app.get("/tavsiye-ver", (req, res) => {
  res.render("tavsiye")
})


app.post("/tavsiye", function(req, res){
  const yazi = req.body.yazi
  const rank = req.body.rank
  let guild = client.guilds.cache.get(sistem.sunucuID);
    let member = req.user ? guild.members.cache.get(req.user.id) : null;
    if (
      member &&
      (member.roles.cache.has(sistem.bdfd))
    ) {
  client.channels.cache.get(sistem.tavsiyeLog).send(
    new Discord.MessageEmbed()
    .setColor(diger.embedRenk)
    .setTimestamp()
    .setThumbnail(diger.embedResim)
    .addField("Tavsiye Veren",`${req.user.username}`)
    .addField("Tavsiye Verdiği Kod Türü", `${rank}`)
    .addField("Tavsiye Mesajı", `${yazi}`));
    res.redirect(`/`);
  } else {
      res.redirect(`hata?m=${diger.RolunYokHataMesaj}`);
    }
});
app.get("/hata", (req, res) => {
  res.render("hata", {
    user: req.user,
    m: req.query.m
  });
});

app.use((req, res) => {
  const err = new Error("Not Found");
  err.status = 404;
  return res.redirect(`/hata?m=${diger.NotFoundHataMesaj}`);
});

client.login(sistem.botToken);

client.on("ready", () => {
  const listener = app.listen(process.env.PORT, function() {
    console.log("Site Aktif!");
  });
});

