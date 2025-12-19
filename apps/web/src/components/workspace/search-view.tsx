import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useI18n } from '@/i18n/hooks';
import { useState } from 'react';

export function SearchView() {
    const { t } = useI18n();
    const [query, setQuery] = useState('');

    return (
        <div className="flex flex-col h-full bg-card/30">
            <div className="p-4 border-b border-border">
                <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                    {t('common.search')}
                </h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('workspace.searchFiles')}
                        className="pl-8"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 text-center text-sm text-muted-foreground">
                    {query ? (
                        <p>No results found for "{query}"</p>
                    ) : (
                        <p>Type to search in files...</p>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
