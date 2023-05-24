const {SlashCommandBuilder} = require('discord.js')

function rollDice(numDice, numSides) {
    let total = 0;
    for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * numSides) + 1;
        total += roll;
    }
    return total;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('san_check')
        .setDescription('PC San Check')
        .addNumberOption(option => option.setName('san_number').setDescription('PC San number').setRequired(true))
        .addNumberOption(option => option.setName('loss_check_dice').setDescription('loss of dice').setRequired(true))
        .addNumberOption(option => option.setName('loss_check_dice_side').setDescription('loss of dice side').setRequired(true))
        .addNumberOption(option => option.setName('success_check_dice').setDescription('Success of dice'))
        .addNumberOption(option => option.setName('success_check_dice_side').setDescription('Success of dice side')),

    async execute(interaction) {
        const pcsan = interaction.options.getNumber('san_number')
        let sdice = interaction.options.getNumber('success_check_dice') || 0
        let sdiceside = interaction.options.getNumber('success_check_dice_side') || 0
        const ldice = interaction.options.getNumber('loss_check_dice')
        const ldiceside = interaction.options.getNumber('loss_check_dice_side')

        const sancheck = Math.floor(Math.random() * 100) + 1;

        const isFumble = sancheck >= 96 && sancheck > pcsan;
        const isBigSuccess = sancheck <= 5 && sancheck <= pcsan;
        const isLoss = sancheck > pcsan && sancheck < 96;
        const isSuccess = sancheck <= pcsan && sancheck < 96;

        let total = 0;
        let resultMessage = '';

        if (isSuccess || isLoss) {
            total = rollDice(isSuccess ? sdice : ldice, isSuccess ? sdiceside : ldiceside);
            resultMessage = isSuccess ? '成功' : '失敗';
        } else if (isBigSuccess || isFumble) {
            total = isSuccess ? sdice : ldiceside;
            resultMessage = isBigSuccess ? '大成功' : '大失敗';
        }

        const sanend = pcsan - total;
        interaction.reply(`${interaction.member}SAN值檢定${resultMessage}(${sancheck})，SAN值為"${sanend}":(${pcsan}-${total})`);

        if (total >= 5) {
            interaction.channel.send("酷誒，看來有人要瘋囉～誒嘿");
        }
    }
}
