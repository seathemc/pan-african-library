"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2, BookOpen } from "lucide-react";

interface WorkResult {
  id: number;
  title: string;
  author: string;
  yearPublished: number;
  region: string;
  genre: string;
  era: string;
  description: string;
}

const REGIONS = [
  "West Africa",
  "East Africa",
  "Southern Africa",
  "North Africa",
  "Central Africa",
  "Caribbean",
  "Diaspora",
] as const;

type Region = (typeof REGIONS)[number];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const [results, setResults] = useState<WorkResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch results when debounced query changes (and no region filter active)
  useEffect(() => {
    if (activeRegion) return;

    if (!debouncedQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setHasSearched(true);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setHasSearched(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery.trim())}&limit=30`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setResults(Array.isArray(data.results) ? data.results : []);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, activeRegion]);

  // Fetch results when region filter changes
  useEffect(() => {
    if (!activeRegion) return;

    let cancelled = false;
    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

    fetch(`/api/works?region=${encodeURIComponent(activeRegion)}&limit=50`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setResults(Array.isArray(data.works) ? data.works : []);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeRegion]);

  function handleRegionToggle(region: Region) {
    setActiveRegion((prev) => (prev === region ? null : region));
    // Clear search when switching to region filter
    setSearchQuery("");
    setDebouncedQuery("");
  }

  const showStartTyping = !activeRegion && !debouncedQuery.trim();
  const showKeepTyping =
    !activeRegion && debouncedQuery.trim().length === 1;
  const showNoResults =
    hasSearched && !isLoading && results.length === 0 && !showKeepTyping;

  const resultCount = results.length;
  const resultLabel = resultCount === 1 ? "work" : "works";

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header + Search input */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Search Library</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, author, description, region..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Clear region filter when typing
              if (activeRegion) setActiveRegion(null);
            }}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Region filter pills */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter by region</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((region) => (
              <Button
                key={region}
                variant={activeRegion === region ? "default" : "outline"}
                size="sm"
                onClick={() => handleRegionToggle(region)}
                className="h-7 text-xs"
              >
                {region}
              </Button>
            ))}
          </div>
        </div>

        {/* Result count / status line */}
        {hasSearched && !isLoading && !showKeepTyping && (
          <p className="text-sm text-muted-foreground">
            {activeRegion
              ? `${resultCount} ${resultLabel} in ${activeRegion}`
              : `${resultCount} ${resultLabel} found`}
          </p>
        )}
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Keep typing hint */}
      {!isLoading && showKeepTyping && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">Keep typing&hellip;</p>
          <p className="text-sm text-muted-foreground/70">
            Enter at least 2 characters to search
          </p>
        </div>
      )}

      {/* Start typing empty state */}
      {!isLoading && showStartTyping && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">
            Search the Pan-African Library
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-sm">
            Type a title, author name, or keyword to search across the full
            library, or choose a region filter above.
          </p>
        </div>
      )}

      {/* No results empty state */}
      {!isLoading && showNoResults && (
        <Card>
          <CardHeader>
            <CardTitle>No results found</CardTitle>
            <CardDescription>
              {activeRegion
                ? `No works found for the region "${activeRegion}". Try a different region or search by title/author.`
                : "Try different keywords, or browse by region using the filter pills above."}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Results grid */}
      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((work) => (
            <Link key={work.id} href={`/work/${work.id}`}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {work.title}
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0">
                      {work.yearPublished}
                    </Badge>
                  </div>
                  <CardDescription className="font-medium">
                    {work.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {work.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {work.region}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {work.genre}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {work.era}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
