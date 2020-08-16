import inquirer from "inquirer";
export const emailPassPrompt = async () => {
  const answers = await inquirer.prompt([
    { type: "input", name: "email", message: "Enter your email" },
    { type: "password", name: "pass", message: "Enter your password" },
  ]);
  return answers;
};
export const emailPrompt = async () => {
  const answer: { email: string } = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter your email",
      validate: (email) => {
        if (!email || email === "") return "Please enter your email";
        return true;
      },
    },
  ]);
  return answer;
};
export const emailLinkOrPassPrompt = async (): Promise<
  "emailLink" | "emailPass"
> => {
  const answers: {
    signInMethod: Array<"emailLink" | "emailPass">;
  } = await inquirer.prompt({
    type: "checkbox",
    name: "signInMethod",
    message: "Which method you prefer to sign in??",
    choices: [
      { value: "emailLink", name: "Sign in with email link " },
      { value: "emailPass", name: "Sign in with email and password" },
    ],
    validate: (answer) => {
      if (answer.length < 1) return "You should select atleast one answer";
      if (answer.length > 1) return "You should select only one answer";
      else return true;
    },
  });
  return answers.signInMethod[0];
};
