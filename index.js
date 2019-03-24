const SlackBot = require('slackbots')
const axios = require('axios')
require('dotenv').config();

const bot = new SlackBot({
    token: process.env.SLACKBOTTOKEN,
    name: process.env.SLACKNAME
})

// Start Handler
bot.on('start', () => {
  const params = {
    icon_emoji: ':foodtrucks:'
  };

  bot.postMessageToChannel(
    'almuerbot',
    '¿Listo para pedir tu almuerzo?',
    params
  );
});

//Error Handler
bot.on('error', (err) => console.log(err));

//Message Handler
bot.on('message', data => {
  if(data.type !== 'message') {
      return;
  }
  chatWithUser(data)
});

function chatWithUser(data) {
  if(data.text.includes('Hola')) {
    bot.openIm(data.user)
    bot.postMessage(data.user, 'Hola, ¿Listo para pedir almuerzo?')
  }
  if(data.text.includes('Que hay para hoy')) {
      bot.postMessage(data.user, 'Hola, ¿Listo para pedir almuerzo?')
  }
}

// Responds to Data
function handleMessage(message) {
  if(message.includes('listar menu')) {
    listMenu();
  }
}

// List Menu
function listMenu() {
  axios.get('https://jsonplaceholder.typicode.com/todos/1').then(res => {
      const menu = res.data.title;

      const params = {
      icon_menu: ':foodtrucks:'
      };

  bot.postMessageToChannel('almuerbot', `... Listando almuerzos ... ${menu}`, params);
  });
}
