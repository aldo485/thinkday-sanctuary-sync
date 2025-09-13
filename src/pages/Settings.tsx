import { useState } from 'react';
import { useThinkDay } from '@/contexts/ThinkDayContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { state, dispatch } = useThinkDay();
  const { toast } = useToast();
  const [newWheelCategory, setNewWheelCategory] = useState('');
  const [newPrompt, setNewPrompt] = useState('');

  const updateWheelCategory = (index: number, value: string) => {
    const newCategories = [...state.settings.wheelCategories];
    newCategories[index] = value;
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { wheelCategories: newCategories }
    });
  };

  const addWheelCategory = () => {
    if (newWheelCategory.trim()) {
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: {
          wheelCategories: [...state.settings.wheelCategories, newWheelCategory.trim()]
        }
      });
      setNewWheelCategory('');
    }
  };

  const removeWheelCategory = (index: number) => {
    const newCategories = state.settings.wheelCategories.filter((_, i) => i !== index);
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { wheelCategories: newCategories }
    });
  };

  const addJournalPrompt = () => {
    if (newPrompt.trim()) {
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: {
          journalPrompts: [...state.settings.journalPrompts, newPrompt.trim()]
        }
      });
      setNewPrompt('');
    }
  };

  const removeJournalPrompt = (index: number) => {
    const newPrompts = state.settings.journalPrompts.filter((_, i) => i !== index);
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { journalPrompts: newPrompts }
    });
  };

  const exportData = () => {
    try {
      const data = JSON.stringify(state, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `think-day-sanctuary-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported successfully",
        description: "Your Think Day Sanctuary data has been backed up.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        dispatch({ type: 'LOAD_STATE', payload: importedData });
        toast({
          title: "Data imported successfully",
          description: "Your Think Day Sanctuary data has been restored.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The file format is invalid or corrupted.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your Think Day Sanctuary experience.</p>
      </header>

      {/* Wheel of Life Categories */}
      <Card className="sanctuary-border">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Customize Wheel of Life</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.settings.wheelCategories.map((category, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={category}
                  onChange={(e) => updateWheelCategory(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeWheelCategory(index)}
                  disabled={state.settings.wheelCategories.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Add new category..."
              value={newWheelCategory}
              onChange={(e) => setNewWheelCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addWheelCategory()}
            />
            <Button onClick={addWheelCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Journal Prompts */}
      <Card className="sanctuary-border">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Customize Journaling Prompts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {state.settings.journalPrompts.map((prompt, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-surface rounded-md">
                <p className="flex-1 text-sm text-foreground">{prompt}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeJournalPrompt(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-prompt">Add new prompt</Label>
            <div className="flex space-x-2">
              <Input
                id="new-prompt"
                placeholder="What question would inspire deep reflection?"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addJournalPrompt()}
              />
              <Button onClick={addJournalPrompt}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="sanctuary-border">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your data is stored only on this browser. You can back it up here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={exportData} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Backup (Export) Data
            </Button>
            
            <div className="flex-1">
              <Label htmlFor="import-file" className="cursor-pointer">
                <Button asChild variant="outline" className="w-full">
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Restore (Import) Data
                  </span>
                </Button>
              </Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-surface p-3 rounded-md">
            <strong>Note:</strong> Importing data will replace all current data. Make sure to backup first if you want to preserve your current sessions.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;