import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { AlertCircle } from 'lucide-react'

interface CarInfoProps {
  content: string
}

export function CarInfo({ content }: CarInfoProps) {
  const [parsedContent, setParsedContent] = useState<any>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const parsed = JSON.parse(content)
      setParsedContent(parsed)
      setParseError(null)
    } catch (error) {
      console.error('Failed to parse content:', error)
      setParseError('Failed to parse the AI response. Please try again.')
    }
  }, [content])

  if (parseError) {
    return (
      <div className="text-red-500 flex items-center">
        <AlertCircle className="mr-2" />
        <p>{parseError}</p>
      </div>
    )
  }

  if (!parsedContent) {
    return <p>{content}</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{parsedContent.carModel || 'Car Information'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">General Info</TabsTrigger>
            <TabsTrigger value="parts">Parts</TabsTrigger>
            <TabsTrigger value="repair">Repair Schemes</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <ul className="list-disc pl-5">
              <li>Year: {parsedContent.year || 'N/A'}</li>
              <li>Make: {parsedContent.make || 'N/A'}</li>
              <li>Model: {parsedContent.model || 'N/A'}</li>
              <li>Engine: {parsedContent.engine || 'N/A'}</li>
            </ul>
          </TabsContent>
          <TabsContent value="parts">
            <ul className="list-disc pl-5">
              {parsedContent.parts?.map((part: any, index: number) => (
                <li key={index}>{part.name}: {part.partNumber}</li>
              )) || <li>No parts information available</li>}
            </ul>
          </TabsContent>
          <TabsContent value="repair">
            {parsedContent.repairSchemes?.map((scheme: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold">{scheme.title}</h3>
                <p>{scheme.description}</p>
                {scheme.imageUrl && (
                  <Image src={scheme.imageUrl} alt={scheme.title} width={300} height={200} className="mt-2" />
                )}
              </div>
            )) || <p>No repair schemes available</p>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

