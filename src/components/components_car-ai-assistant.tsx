'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CarInfo } from './components_car-info';
import { Loader2 } from 'lucide-react';

export function CarAIAssistant() {
  const [vin, setVin] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callGoogleGenerativeAPI = async (vin: string, userQuery: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare the query
      const payload = {
        data: {
          vin,
          userQuery,
        },
      };

      // Make the API request
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.text();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: userQuery },
        { role: 'assistant', content: data },
      ]);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userQuery = `My VIN number is ${vin}. What are my vehicle specifications?`;
    callGoogleGenerativeAPI(vin, userQuery);
  };

  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    callGoogleGenerativeAPI(vin, input);
    setInput(''); // Clear the input field
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Car AI Assistant</CardTitle>
        <CardDescription>Enter your car's VIN to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVinSubmit} className="flex space-x-2 mb-4">
          <Input
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="Enter VIN"
            className="flex-grow"
            aria-label="Vehicle Identification Number"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
          </Button>
        </form>
        <ScrollArea className="h-[400px] w-full pr-4">
          {error && (
            <div className="text-red-500 mb-4">
              An error occurred: {error}
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'}`}>
              {message.role === 'assistant' ? <CarInfo content={message.content} /> : <p>{message.content}</p>}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleMessageSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your car..."
            className="flex-grow"
            aria-label="Ask a question about your car"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send'}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
