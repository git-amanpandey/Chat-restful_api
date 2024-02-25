const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
main().then(result=>console.log("Connected with database")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');
};

let allChats = [
    {
    from:"adam",
    to:"bob",
    msg:"hey! im using this chat",
    createdAt: new Date()
    },
    {
        from:"can",
        to:"dan",
        msg:"Welcome Buddy",
        createdAt: new Date()
        },
        {
            from:"evan",
            to:"fab",
            msg:"whatsapp!",
            createdAt: new Date()
            },
            {
                from:"gan",
                to:"harry",
                msg:"hey!are  you coming today in party",
                createdAt: new Date()
                },
                {
                    from:"ian",
                    to:"jan",
                    msg:"lets have fun...!",
                    createdAt: new Date()
                    }
];

Chat.insertMany(allChats).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });