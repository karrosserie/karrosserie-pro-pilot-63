export interface UserDataComplete {
  type: 'USER_DATA_COMPLETE';
  timestamp: number;
  user: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
  company: {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    zipcode: string;
    phone: string;
    siret: string;
    siren: string;
    tva: string;
    logoUrl: string;
    latitude?: number;
    longitude?: number;
    location_radius?: number;
  };
  role: {
    current: string;
    permissions: {
      isOwner: boolean;
      isCarrossier: boolean;
      isResponsable: boolean;
      canManage: boolean;
      viewOnly: boolean;
      restrictedView: 'employee' | 'manager' | null;
    };
  };
  impersonation: {
    isActive: boolean;
    originalUser: any;
    companyName: string | null;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

export interface ParentMessage {
  type: string;
  [key: string]: any;
}

export interface AppToParentMessage {
  type: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END' | 'TASK_COMPLETE' | 'TASK_START' | 'ERROR';
  timestamp: number;
  data: any;
}

class PostMessageService {
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private allowedOrigins: string[] = ['*']; // Configure based on your needs

  constructor() {
    this.init();
  }

  private init() {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  private handleMessage(event: MessageEvent) {
    console.log('📨 PostMessage: Received message from parent:', {
      origin: event.origin,
      data: event.data,
      timestamp: new Date().toISOString()
    });

    // Security check - configure allowed origins in production
    if (this.allowedOrigins.length > 0 && !this.allowedOrigins.includes('*') && !this.allowedOrigins.includes(event.origin)) {
      console.warn('⚠️ PostMessage: Rejected message from unauthorized origin:', event.origin);
      return;
    }

    try {
      const message = event.data as ParentMessage;
      if (!message.type) {
        console.log('⚠️ PostMessage: Message has no type, ignoring');
        return;
      }

      console.log(`🎯 PostMessage: Processing message type "${message.type}"`);
      
      const listeners = this.listeners.get(message.type) || [];
      console.log(`👂 PostMessage: Found ${listeners.length} listeners for type "${message.type}"`);
      
      listeners.forEach((listener, index) => {
        try {
          console.log(`🔄 PostMessage: Executing listener ${index + 1}/${listeners.length} for type "${message.type}"`);
          listener(message);
        } catch (error) {
          console.error('❌ PostMessage: Error executing listener for message type:', message.type, error);
        }
      });
    } catch (error) {
      console.error('❌ PostMessage: Error processing parent message:', error);
    }
  }

  public subscribe(messageType: string, callback: (data: any) => void) {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, []);
    }
    this.listeners.get(messageType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(messageType);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  public sendToParent(message: AppToParentMessage) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
      }
    } catch (error) {
      console.error('Error sending message to parent:', error);
    }
  }

  public notifyParent(type: AppToParentMessage['type'], data: any) {
    this.sendToParent({
      type,
      timestamp: Date.now(),
      data
    });
  }
}

export const postMessageService = new PostMessageService();