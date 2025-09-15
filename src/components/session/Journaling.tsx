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
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Prompts Column */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Choose a Prompt
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {journalPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant={selectedPrompt === prompt ? "default" : "outline"}
                    className="w-full text-left h-auto p-3 justify-start"
                    onClick={() => handlePromptSelect(prompt)}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span className="text-xs leading-relaxed">{prompt}</span>
                      {isPromptAnswered(prompt) && (
                        <CheckCircle className="h-3 w-3 text-green-500 ml-2 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Response Column */}
            <div className="space-y-3">
              {selectedPrompt ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Edit3 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium text-muted-foreground">Your Response</h3>
                  </div>
                  <Card className="border-primary/20">
                    <CardHeader className="pb-3">
                      <p className="text-xs text-muted-foreground font-medium italic">
                        "{selectedPrompt}"
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Take your time to reflect and write your thoughts..."
                        className="min-h-[200px] resize-none"
                      />
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPrompt('');
                            setResponse('');
                          }}
                        >
                          Clear
                        </Button>
                        <Button
                          onClick={handleSaveEntry}
                          disabled={!response.trim()}
                          className="bg-sanctuary-gradient"
                          size="sm"
                        >
                          Save Entry
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-center">
                  <div className="space-y-2">
                    <Edit3 className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Select a prompt to begin journaling
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {currentEntries.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Completed Entries ({currentEntries.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentEntries.map((entry, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10"
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