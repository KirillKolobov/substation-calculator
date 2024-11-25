interface OllamaResponse {
  response: string;
  done: boolean;
}

const OLLAMA_HOST = 'http://localhost:11434';
const DEFAULT_MODEL = 'tinyllama';

export const checkOllamaServer = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const generateChapterContent = async (chapterName: string, context: string): Promise<string> => {
  try {
    // Проверяем доступность сервера
    const isServerAvailable = await checkOllamaServer();
    if (!isServerAvailable) {
      throw new Error(
        'Сервер Ollama недоступен. Для использования генерации текста:\n\n' +
        '1. Откройте PowerShell от имени администратора\n' +
        '2. Выполните команду: ollama serve\n' +
        '3. В другом окне PowerShell выполните: ollama pull tinyllama\n\n' +
        'Если команда ollama не найдена:\n' +
        '1. Добавьте путь C:\\Program Files\\Ollama в системные переменные PATH\n' +
        '2. Перезапустите PowerShell и повторите шаги выше'
      );
    }

    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt: `Ты опытный инженер-проектировщик. Напиши содержание главы "${chapterName}" для проекта реконструкции электрических ячеек.
                Контекст проекта: ${context}
                Пожалуйста, используй технический стиль, будь конкретным и структурированным.
                Используй форматирование текста (жирный, курсив, списки) через HTML-теги.
                Ограничь ответ 2000 символами.`,
        options: {
          num_ctx: 1024,         // Оптимизировано для TinyLlama
          temperature: 0.7,      // Баланс между креативностью и точностью
          num_thread: 4,         // Оптимально для большинства CPU
          top_k: 20,            // Ограничиваем выборку для быстрых ответов
          top_p: 0.9,           // Хороший баланс разнообразия
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error?.includes('not found')) {
        throw new Error(
          'Модель TinyLlama не установлена. Выполните команду:\n' +
          'ollama pull tinyllama\n\n' +
          'Если команда не работает, убедитесь что:\n' +
          '1. Сервер Ollama запущен (команда: ollama serve)\n' +
          '2. У вас есть доступ к интернету\n' +
          '3. Достаточно места на диске (нужно около 3GB)'
        );
      }
      throw new Error(`Ошибка сервера Ollama: ${JSON.stringify(errorData)}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};
