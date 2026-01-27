export const TELEGRAM_CONFIG = {
  botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
  chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',
};

export const validateTelegramConfig = (): boolean => {
  if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId) {
    console.error('❌ Telegram configuration missing. Please check your .env file');
    return false;
  }
  
  if (TELEGRAM_CONFIG.botToken === 'your_bot_token_here' || 
      TELEGRAM_CONFIG.chatId === 'your_chat_id_here') {
    console.error('❌ Please replace placeholder values in .env file');
    return false;
  }
  
  console.log('✅ Telegram configuration loaded successfully');
  return true;
};