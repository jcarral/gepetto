const inquirer = require('inquirer');

const validationFn = message => value => {
    if (!message || !message.length || value.length) {
      return true;
    } else {
      return message;
    }
}

class Action {

  constructor(questions) {
    this.answers = {};
    this.questions = questions.map(q => {
      const currentValidateFn = validationFn(q.validateMessage);
      return {
        ...q,
        validate: currentValidateFn
      }
    });
  }

  async ask() {
    const answers = await inquirer.prompt(this.questions);
    this.answers = answers;
    return answers;
  }

  setChoices(questionKey, choices) {
    let tmpQuestions = this.questions.map(q => {
      if(q.name === questionKey) {
        q.choices = choices;
      }
      return q;
    })
    this.questions = tmpQuestions;
  }

}

module.exports = Action;
