import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 在ES模块中获取当前目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 要验证的JSON文件路径
const jsonFilePath = join(__dirname, 'vite-questions.json');

// 读取并验证JSON文件
let data = null;
let errorPosition = -1;
let errorContext = '';

try {
  // 读取文件内容
  const fileContent = readFileSync(jsonFilePath, 'utf8');
  
  // 尝试解析JSON
  try {
    data = JSON.parse(fileContent);
    console.log('✅ JSON文件语法正确！');
  } catch (parseError) {
    // 获取错误位置
    if (parseError.message.includes('position')) {
      errorPosition = parseInt(parseError.message.match(/position (\d+)/)[1]);
      
      // 获取错误位置前后的上下文（各50个字符）
      const start = Math.max(0, errorPosition - 50);
      const end = Math.min(fileContent.length, errorPosition + 50);
      errorContext = fileContent.substring(start, end);
      
      console.error(`❌ JSON语法错误在位置 ${errorPosition}:`);
      console.error(`错误信息: ${parseError.message}`);
      console.error(`附近内容: ${errorContext}`);
    } else {
      console.error(`❌ JSON解析错误: ${parseError.message}`);
    }
    
    // 退出并返回错误代码
    process.exit(1);
  }
} catch (fileError) {
  console.error(`❌ 无法读取文件: ${fileError.message}`);
  process.exit(1);
}