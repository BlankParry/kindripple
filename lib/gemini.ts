const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// For demo purposes, we'll use a mock API key
// In production, this should be stored securely in environment variables
const DEMO_API_KEY = 'demo-key-for-development';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatContext {
  userRole: 'restaurant' | 'ngo' | 'volunteer' | 'admin';
  currentScreen?: string;
  userName?: string;
}

// Mock responses for demo purposes
const getMockResponse = (message: string, context: ChatContext): string => {
  const lowerMessage = message.toLowerCase();
  
  // Role-specific responses
  if (context.userRole === 'restaurant') {
    if (lowerMessage.includes('donation') || lowerMessage.includes('food')) {
      return "As a restaurant, you can create food donations by going to the Create tab. Make sure to include details like quantity, expiry time, and pickup instructions. This helps NGOs and volunteers coordinate pickups efficiently!";
    }
    if (lowerMessage.includes('pickup') || lowerMessage.includes('collect')) {
      return "Once you create a donation, NGOs can claim it and assign volunteers for pickup. You'll receive notifications when someone claims your donation and when it's collected. You can track the status in your Tasks tab.";
    }
  }
  
  if (context.userRole === 'ngo') {
    if (lowerMessage.includes('claim') || lowerMessage.includes('donation')) {
      return "You can browse available donations on the Home tab and claim ones that match your needs. After claiming, you can assign volunteers to handle the pickup and delivery. The system will notify all parties about status updates.";
    }
    if (lowerMessage.includes('volunteer') || lowerMessage.includes('assign')) {
      return "To assign volunteers, go to your claimed donations and tap 'Assign Volunteer'. You can choose from available volunteers in your network. They'll receive notifications about their assignments automatically.";
    }
  }
  
  if (context.userRole === 'volunteer') {
    if (lowerMessage.includes('task') || lowerMessage.includes('delivery')) {
      return "Your assigned tasks appear in the Tasks tab. Each task includes pickup and delivery locations with navigation support. Update the status as you progress - this keeps everyone informed about the delivery progress.";
    }
    if (lowerMessage.includes('available') || lowerMessage.includes('assignment')) {
      return "NGOs can assign you to deliveries based on your availability. Make sure to keep your profile updated with your current availability status. You'll receive notifications when new tasks are assigned to you.";
    }
  }
  
  // General responses
  if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
    return `Hi ${context.userName || 'there'}! I'm Ripple, your KindRipple assistant. I can help you with questions about food donations, deliveries, and using the app. What would you like to know?`;
  }
  
  if (lowerMessage.includes('notification')) {
    return "You can manage your notification preferences in the Account tab under Settings. You can control notifications for food listings, volunteer assignments, and delivery updates.";
  }
  
  if (lowerMessage.includes('impact') || lowerMessage.includes('metric')) {
    return "Check out the Impact tab to see your contribution to reducing food waste! You can view metrics like meals saved, CO2 reduced, and your overall impact on the community.";
  }
  
  // Default response
  return "I'm here to help you with KindRipple! You can ask me about creating donations, managing tasks, understanding the app features, or anything else related to food waste reduction. What would you like to know?";
};

export async function askRipple(message: string, context: ChatContext): Promise<string> {
  try {
    // For demo purposes, we'll use mock responses
    // In production, this would make an actual API call to Gemini
    
    if (DEMO_API_KEY === 'demo-key-for-development') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      return getMockResponse(message, context);
    }
    
    // Real Gemini API call (for when API key is available)
    const systemPrompt = `You are Ripple, a helpful assistant for KindRipple, a food waste reduction app. 
    
User context:
- Role: ${context.userRole}
- Current screen: ${context.currentScreen || 'unknown'}
- Name: ${context.userName || 'User'}

KindRipple helps:
- Restaurants donate surplus food
- NGOs claim and distribute food
- Volunteers handle pickups and deliveries
- Track impact metrics (meals saved, CO2 reduced)

Provide helpful, concise responses about using the app, food donation processes, or general assistance. Be friendly and encouraging about reducing food waste.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${DEMO_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser message: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback to mock response
    return getMockResponse(message, context);
  }
}

// Streaming response simulation for better UX
export async function* askRippleStream(message: string, context: ChatContext): AsyncGenerator<string, void, unknown> {
  const fullResponse = await askRipple(message, context);
  const words = fullResponse.split(' ');
  
  let currentText = '';
  for (const word of words) {
    currentText += (currentText ? ' ' : '') + word;
    yield currentText;
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
  }
}