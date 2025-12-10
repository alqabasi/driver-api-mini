
import fs from 'fs';
import path from 'path';

const loadMessages = (language: string) => {
  // const filePath = path.join(__dirname, `../feedback/${language}.json`);
  const filePath = path.join(process.cwd(), 'src/feedback', `${language}.json`); // for relative path production
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading language file for ${language}:`, error);
    return {};
  }
};

const messages: Record<string, any> = {
  ar: loadMessages('ar'),
};

export const getFeedback = (key: string, lang: string = 'ar') => {
  const keys = key.split('.');
  
  let result = messages[lang];
  if (result === undefined) return key;

  for (const k of keys) {
    result = result[k];
    if (result === undefined) {
      return key;
    }
  }
  return result;
};
