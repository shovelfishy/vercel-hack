'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CarInfo } from './components_car-info'
import { Loader2 } from 'lucide-react'

export function CarAIAssistant() {
  const [vin, setVin] = useState('')
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      if (response.status === 429) {
        console.error('Rate limit exceeded')
        // Handle rate limiting (e.g., show an error message to the user)
      }
    },
  })

  const handleVinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e, { data: { vin } })
  }

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
              An error occurred. Please try again.
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
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
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
  )
}

