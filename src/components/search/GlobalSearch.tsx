import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'patient' | 'appointment' | 'medication' | 'health-metric' | 'alert' | 'document';
  category: string;
  relevance: number;
  data?: any;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Margaret Johnson - Patient Record',
    description: 'Age 78, Diabetes Type 2, Last visit: 2 days ago',
    type: 'patient',
    category: 'Patients',
    relevance: 95,
    data: { status: 'active', lastVisit: '2024-01-09' }
  },
  {
    id: '2',
    title: 'Blood Pressure Reading - High',
    description: '165/95 mmHg recorded this morning, requires attention',
    type: 'health-metric',
    category: 'Health Metrics',
    relevance: 90,
    data: { value: '165/95', status: 'high', timestamp: '2024-01-11 08:30' }
  },
  {
    id: '3',
    title: 'Metformin - Medication Alert',
    description: 'Missed dose yesterday, adherence at 85%',
    type: 'medication',
    category: 'Medications',
    relevance: 88,
    data: { adherence: 85, lastTaken: '2024-01-09' }
  },
  {
    id: '4',
    title: 'Cardiology Follow-up',
    description: 'Appointment with Dr. Smith scheduled for tomorrow 2:00 PM',
    type: 'appointment',
    category: 'Appointments',
    relevance: 85,
    data: { doctor: 'Dr. Smith', time: '14:00', date: '2024-01-12' }
  }
];

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = mockSearchResults.filter(result => {
          const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              result.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter = filterType === 'all' || result.type === filterType;
          return matchesQuery && matchesFilter;
        });
        setResults(filtered.sort((a, b) => b.relevance - a.relevance));
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [searchQuery, filterType]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'patient': return '👤';
      case 'appointment': return '📅';
      case 'medication': return '💊';
      case 'health-metric': return '❤️';
      case 'alert': return '⚠️';
      case 'document': return '📄';
      default: return '📋';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'patient': return 'bg-blue-100 text-blue-800';
      case 'appointment': return 'bg-green-100 text-green-800';
      case 'medication': return 'bg-purple-100 text-purple-800';
      case 'health-metric': return 'bg-red-100 text-red-800';
      case 'alert': return 'bg-yellow-100 text-yellow-800';
      case 'document': return 'bg-gray-100 text-gray-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-accessible-xl">Global Search</DialogTitle>
          <DialogDescription className="text-accessible-base">
            Search across patients, appointments, medications, and health records
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="space-y-4">
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for patients, appointments, medications..."
                className="pl-10 pr-10 h-12 text-accessible-base"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 h-12">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="patient">Patients</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="medication">Medications</SelectItem>
                <SelectItem value="health-metric">Health Metrics</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {isSearching && (
              <Card>
                <CardContent className="p-4">
                  <div className="text-center text-muted-foreground">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    Searching...
                  </div>
                </CardContent>
              </Card>
            )}

            {!isSearching && searchQuery && results.length === 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-accessible-base">No results found for "{searchQuery}"</p>
                    <p className="text-accessible-sm">Try adjusting your search terms or filters</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-smooth cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xl">{getTypeIcon(result.type)}</span>
                        <h3 className="text-accessible-lg font-medium">{result.title}</h3>
                        <Badge className={getTypeColor(result.type)}>
                          {result.category}
                        </Badge>
                      </div>
                      <p className="text-accessible-base text-muted-foreground mb-2">
                        {result.description}
                      </p>
                      
                      {/* Additional Data Display */}
                      {result.data && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(result.data).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {String(value)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-accessible-sm text-muted-foreground">
                        {result.relevance}% match
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          {searchQuery && results.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-accessible-sm text-muted-foreground mb-3">Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Export Results
                </Button>
                <Button variant="outline" size="sm">
                  Create Report
                </Button>
                <Button variant="outline" size="sm">
                  Set Alert
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};