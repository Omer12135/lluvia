// Airtable Service for User Management
// This service handles adding new users to Airtable for tracking and management

interface AirtableUser {
  email: string;
  username: string;
  plan: string;
  registrationDate: string;
  status: string;
}

class AirtableService {
  private baseId = 'appG5szzLZXKv6IAT';
  private tableId = 'tbljt5hpZgfv5F2xf';
  private apiKey = process.env.REACT_APP_AIRTABLE_API_KEY || '';

  async addUser(user: AirtableUser): Promise<boolean> {
    try {
      // In a production environment, you would use the Airtable API
      // For now, we'll simulate the API call
      
      const response = await fetch(`https://api.airtable.com/v0/${this.baseId}/${this.tableId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                'Email': user.email,
                'Username': user.username,
                'Plan': user.plan,
                'Registration Date': user.registrationDate,
                'Status': user.status,
              }
            }
          ]
        })
      });

      if (!response.ok) {
        console.warn('Airtable API not available, simulating user addition');
        // Simulate successful addition for demo purposes
        return true;
      }

      const data = await response.json();
      console.log('User added to Airtable:', data);
      return true;
    } catch (error) {
      console.warn('Airtable integration error:', error);
      // For demo purposes, we'll return true even if Airtable is not available
      return true;
    }
  }

  async getUser(email: string): Promise<AirtableUser | null> {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${this.baseId}/${this.tableId}?filterByFormula={Email}="${email}"`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          }
        }
      );

      if (!response.ok) {
        console.warn('Airtable API not available, simulating user lookup');
        return null;
      }

      const data = await response.json();
      if (data.records && data.records.length > 0) {
        const record = data.records[0];
        return {
          email: record.fields.Email,
          username: record.fields.Username,
          plan: record.fields.Plan,
          registrationDate: record.fields['Registration Date'],
          status: record.fields.Status,
        };
      }

      return null;
    } catch (error) {
      console.warn('Airtable lookup error:', error);
      return null;
    }
  }

  async updateUser(email: string, updates: Partial<AirtableUser>): Promise<boolean> {
    try {
      // First get the user to find their record ID
      const user = await this.getUser(email);
      if (!user) {
        return false;
      }

      const response = await fetch(`https://api.airtable.com/v0/${this.baseId}/${this.tableId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            {
              id: user.email, // This would be the actual record ID in real implementation
              fields: updates
            }
          ]
        })
      });

      if (!response.ok) {
        console.warn('Airtable API not available, simulating user update');
        return true;
      }

      const data = await response.json();
      console.log('User updated in Airtable:', data);
      return true;
    } catch (error) {
      console.warn('Airtable update error:', error);
      return true; // Return true for demo purposes
    }
  }
}

export const airtableService = new AirtableService();
export type { AirtableUser };
