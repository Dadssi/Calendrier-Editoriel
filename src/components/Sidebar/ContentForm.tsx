import { useState, useEffect } from 'react';
import { Content, Platform, Format, Genre, Status, GENRES_CONFIG, FORMATS_CONFIG, PLATFORMS_CONFIG, STATUS_CONFIG } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PlatformIcon } from '@/components/PlatformIcon';
import { X, Save, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentFormProps {
  content?: Content | null;
  selectedDate: string;
  onSave: (content: Omit<Content, 'id'>) => void;
  onUpdate: (id: number, content: Partial<Content>) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const statusColors: Record<Status, string> = {
  todo: 'bg-status-todo',
  prepared: 'bg-status-prepared',
  published: 'bg-status-published',
};

export function ContentForm({
  content,
  selectedDate,
  onSave,
  onUpdate,
  onDelete,
  onClose,
}: ContentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platforms: [] as Platform[],
    format: 'image' as Format,
    genre: 'educatif' as Genre,
    subGenre: '',
    time: '10:00',
    status: 'todo' as Status,
  });

  const isEditing = !!content;

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        description: content.description,
        platforms: content.platforms,
        format: content.format,
        genre: content.genre,
        subGenre: content.subGenre,
        time: content.time,
        status: content.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        platforms: [],
        format: 'image',
        genre: 'educatif',
        subGenre: GENRES_CONFIG.educatif.subGenres[0].value,
        time: '10:00',
        status: 'todo',
      });
    }
  }, [content]);

  const handlePlatformToggle = (platform: Platform) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleGenreChange = (genre: Genre) => {
    setFormData((prev) => ({
      ...prev,
      genre,
      subGenre: GENRES_CONFIG[genre].subGenres[0].value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    if (isEditing && content) {
      onUpdate(content.id, formData);
    } else {
      onSave({
        ...formData,
        date: selectedDate,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="font-semibold text-foreground">
          {isEditing ? 'Modifier le contenu' : 'Nouveau contenu'}
        </h3>
        <Button type="button" variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Titre du contenu"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Description du contenu..."
          rows={3}
        />
      </div>

      {/* Platforms */}
      <div className="space-y-2">
        <Label>Plateformes</Label>
        <div className="flex gap-2">
          {PLATFORMS_CONFIG.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handlePlatformToggle(value)}
              className={cn(
                'p-2 rounded-lg border transition-all',
                formData.platforms.includes(value)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              )}
              title={label}
            >
              <PlatformIcon platform={value} size="md" />
            </button>
          ))}
        </div>
      </div>

      {/* Format & Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Format</Label>
          <Select
            value={formData.format}
            onValueChange={(value: Format) => setFormData((prev) => ({ ...prev, format: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMATS_CONFIG.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Heure</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
          />
        </div>
      </div>

      {/* Genre & SubGenre */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Genre</Label>
          <Select
            value={formData.genre}
            onValueChange={(value: Genre) => handleGenreChange(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(GENRES_CONFIG).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sous-catégorie</Label>
          <Select
            value={formData.subGenre}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, subGenre: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GENRES_CONFIG[formData.genre].subGenres.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label>Statut</Label>
        <div className="flex gap-2">
          {STATUS_CONFIG.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, status: value }))}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg border transition-all text-sm font-medium',
                formData.status === value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', statusColors[value])} />
                {label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border">
        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => content && onDelete(content.id)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        )}
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
