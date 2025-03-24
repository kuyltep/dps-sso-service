import * as bcrypt from 'bcrypt';

export async function generateLoginAndPassword(
  login: string | undefined,
  password: string | undefined,
): Promise<[number, string, string]> {
  const generatedLogin = login ? +login.split('_')[1] + 1 : 1;
  const randomPassword = Array(10)
    .fill(0)
    .map((val, index) => Math.ceil(Math.random() * (index + 1)))
    .join('');
  const salt = await bcrypt.genSalt();
  const employeePassword = password || randomPassword;
  const generatedPassword = await bcrypt.hash(employeePassword, salt);
  return [generatedLogin, generatedPassword, employeePassword];
}
