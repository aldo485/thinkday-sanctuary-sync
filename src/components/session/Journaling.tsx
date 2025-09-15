import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useThinkDay } from '@/contexts/ThinkDayContext';
import { CheckCircle, Edit3 } from 'lucide-react';

const Journaling = () => {
  const { state, dispatch } = useThinkDay();
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const journalPrompts = state.settings.journalPrompts;
  const currentEntries = state.currentSession?.journalEntries || [];

  const handlePromptSelect = (prompt: string) => {
    // Check if we already have a response for this prompt
    const existingEntry = currentEntries.find(entry => entry.prompt === prompt);
    setSelectedPrompt(prompt);
    setResponse(existingEntry?.response || '');
  };

  const handleSaveEntry = () => {
    if (!selectedPrompt || !response.trim()) return;
    
    dispatch({
      type: 'ADD_JOURNAL_ENTRY',
      payload: {
        prompt: selectedPrompt,
        response: response.trim(),
      },
    });
    
    // Clear the form
    setSelectedPrompt('');
    setResponse('');
  };

  const isPromptAnswered = (prompt: string) => {
    return currentEntries.some(entry => entry.prompt === prompt);
  };

  return (
    <div className="space-y-6">
      <Card className="sanctuary-border">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-primary">Journaling Prompts</CardTitle>
          <p className="text-muted-foreground">
            Select questions that call to you today, then start journaling.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 mb-6">
            {journalPrompts.map((prompt, index) => (
              <div key={index} className="relative">
                <Button
                  variant={selectedPrompt === prompt ? "default" : "outline"}
                  className="w-full text-left h-auto p-4 justify-start"
                  onClick={() => handlePromptSelect(prompt)}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="text-sm leading-relaxed">{prompt}</span>
                    {isPromptAnswered(prompt) && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </Button>
              </div>
            ))}
          </div>

          {selectedPrompt && (
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Your Response
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  "{selectedPrompt}"
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Take your time to reflect and write your thoughts..."
                  className="min-h-[150px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPrompt('');
                      setResponse('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEntry}
                    disabled={!response.trim()}
                    className="bg-sanctuary-gradient"
                  >
                    Save Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentEntries.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Completed Entries ({currentEntries.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentEntries.map((entry, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handlePromptSelect(entry.prompt)}
                  >
                    Entry {index + 1}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Journaling;