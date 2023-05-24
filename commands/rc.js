const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll_check')
        .setDescription('Roll COC skill check')
        .addNumberOption(option => option
            .setName('skill_level')
            .setDescription('技能等級')
            .setRequired(true))
        .addStringOption(option => option
            .setName('skill_name')
            .setDescription('技能名稱'))
        .addBooleanOption(option => option
            .setName('bonus')
            .setDescription('是否有獎勵骰'))
        .addBooleanOption(option => option
            .setName('penalty')
            .setDescription('是否有懲罰骰')),

    async execute(interaction) {
        const skillLevel = interaction.options.getNumber('skill_level');
        const skillName = interaction.options.getString('skill_name');
        const bonus = interaction.options.getBoolean('bonus');
        const penalty = interaction.options.getBoolean('penalty');

        let roll = Math.floor(Math.random() * 100) + 1;
        let roll_tens = Math.floor(roll / 10);
        let roll_ones = roll % 10;
        let roll_

        if (bonus) {
            let bonusRoll = Math.floor(Math.random() * 10);
            roll_tens = Math.min(roll_tens, bonusRoll);
            roll_ = bonusRoll
        }

        if (penalty) {
            let penaltyRoll = Math.floor(Math.random() * 10);
            roll_tens = Math.max(roll_tens, penaltyRoll);
            roll_ = penaltyRoll
        }

        roll = roll_tens * 10 + roll_ones;

        let result;
        if (roll > skillLevel) {
            result = (roll >= 96) ? '大失敗' : '失敗';
        } else {
            if (roll <= 5) {
                result = '大成功';
            } else if (roll <= skillLevel / 5) {
                result = '極限成功';
            } else if (roll <= skillLevel / 2) {
                result = '困難成功';
            } else {
                result = '成功';
            }
        }

        let rollMessage = `🎲${interaction.user.tag}進行了${skillName ? skillName : ''}檢定(技能值 ${skillLevel}): ${roll}, 結果: ${result}`;
        if (bonus) {
            rollMessage += `\n(包含獎勵骰: ${roll_})`;
        }
        if (penalty) {
            rollMessage += `\n(包含懲罰骰: ${roll_})`;
        }

        await interaction.reply(rollMessage);
    }
};
