"use client"

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllWorks } from "@/lib/literature-data";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const allWorks = getAllWorks();

  const filteredWorks = useMemo(() => {
    if (!searchQuery.trim()) {
      return allWorks;
    }

    const query = searchQuery.toLowerCase();
    return allWorks.filter((work) => {
      return (
        work.title.toLowerCase().includes(query) ||
        work.author.toLowerCase().includes(query) ||
        work.description.toLowerCase().includes(query) ||
        work.country.toLowerCase().includes(query) ||
        work.region.toLowerCase().includes(query) ||
        work.genre.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, allWorks]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Search Library</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, author, description, region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredWorks.length} {filteredWorks.length === 1 ? 'work' : 'works'} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorks.map((work) => (
          <Link key={work.id} href={`/work/${work.id}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{work.title}</CardTitle>
                  <Badge variant="outline" className="shrink-0">{work.yearPublished}</Badge>
                </div>
                <CardDescription className="font-medium">{work.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {work.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{work.region}</Badge>
                  <Badge variant="secondary" className="text-xs">{work.genre}</Badge>
                  <Badge variant="secondary" className="text-xs">{work.era}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredWorks.length === 0 && searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>No results found</CardTitle>
            <CardDescription>
              Try searching with different keywords or browse by region, era, or genre
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
