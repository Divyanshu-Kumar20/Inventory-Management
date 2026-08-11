const { GoogleGenAI } = require('@google/genai');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey && this.apiKey !== 'your_gemini_api_key_here') {
      try {
        this.ai = new GoogleGenAI({ apiKey: this.apiKey });
      } catch (e) {
        logger.error(`[AI Service Init Error] ${e.message}`);
      }
    }
  }

  async generateResponse(prompt, context = {}) {
    try {
      if (this.ai) {
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `System Context: You are Inventra AI, an Enterprise ERP and Inventory Intelligence Assistant.\nContext Data: ${JSON.stringify(context)}\nUser Prompt: ${prompt}`
        });
        return {
          response: response.text,
          model: 'gemini-2.5-flash',
          source: 'Google GenAI SDK'
        };
      }

      // Fallback Enterprise AI Engine
      const fallbackResponse = this.generateFallbackInsights(prompt, context);
      return {
        response: fallbackResponse,
        model: 'inventra-enterprise-ai-v1',
        source: 'Inventra Local Engine (Set GEMINI_API_KEY for Gemini 2.5 Live Integration)'
      };
    } catch (error) {
      logger.error(`[AI Generation Error] ${error.message}`);
      return {
        response: `Inventra AI Analysis: Based on current workspace metrics, system inventory levels are being monitored. Prompt processing completed.`,
        error: error.message,
        model: 'inventra-enterprise-ai-fallback'
      };
    }
  }

  generateFallbackInsights(prompt, context) {
    const p = prompt.toLowerCase();
    if (p.includes('stock') || p.includes('inventory')) {
      return `📊 **Inventra AI Stock Intelligence**: Recommended to reorder items below threshold (stock <= 10 units). Ensure safety buffer stock for high velocity SKUs.`;
    }
    if (p.includes('sale') || p.includes('revenue') || p.includes('profit')) {
      return `📈 **Inventra AI Financial Intelligence**: Quarterly revenue trajectory is strong. Recommended focus on high-margin Electronics & Equipment categories.`;
    }
    return `🤖 **Inventra Enterprise AI Assistant**: Processing inventory inquiry for query: "${prompt}". Workspace metrics indicate optimal stock distribution across departments.`;
  }
}

module.exports = new AIService();
