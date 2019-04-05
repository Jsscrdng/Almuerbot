const SlackBot = require('slackbots')
const axios = require('axios')
const Connection = require('./connection.js')
const executeSQL = require('./executeSQL.js')

const channelName = 'lunch_proj'

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
    channelName,
    '¿Listo para pedir tu almuerzo?',
    params
  );
});

//Error Handler
bot.on('error', (err) => console.log(err));

//Message Handler
bot.on('message', data => {
  console.log(data)
  if(data.type !== 'message') {
      return;
  }
  chatWithUser(data)
});

async function GetDailyMenu() {
  const connection = await Connection()
  const statement = `
        SELECT DESCRIPCION
        FROM CMND
        LEFT JOIN CMNU
        ON CMND.CNS_CMNU = CMNU.CNS_CMNU
        where HORA_FIN_SOL BETWEEN GETDATE() AND GETDATE()+1;
    `

    const response = await executeSQL(connection, statement)
    console.log(response)
    return response.map(object => {
      return object[0].value
    })
}

async function chatWithUser(data) {
  if (data.text.includes('Hola')) {
    bot.postMessageToChannel(channelName, 'Hola, ¿Listo para pedir almuerzo?')
  }
  if (data.text.includes('!menu')) {
      const menu = await GetDailyMenu()
      console.log('Menu: ', menu)
      if (menu.length === 0)
        bot.postMessageToChannel(channelName, 'No hay menús disponibles para mañana')
      else
        bot.postMessageToChannel(channelName, menu.join('\n'))
  }
}
