import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JSONAnalysis } from '@/lib/jsonUtils';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Clock,
  Database,
  Layers,
  LayoutGrid,
  ListTree,
  Route,
} from "lucide-react";

interface AnalysisViewProps {
  analysis: JSONAnalysis;
}

export function AnalysisView({ analysis }: AnalysisViewProps) {
  return (
    <Card className='border-none shadow-none'>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <BarChart3 className='w-5 h-5 text-primary' />
          </div>
          <CardTitle>JSON Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='summary' className='w-full'>
          <TabsList className='grid w-full grid-cols-4 gap-2 bg-muted/50 p-1 rounded-lg'>
            <TabsTrigger
              value='summary'
              className='data-[state=active]:bg-background'>
              <Database className='w-4 h-4 mr-2' />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value='structure'
              className='data-[state=active]:bg-background'>
              <Layers className='w-4 h-4 mr-2' />
              Structure
            </TabsTrigger>
            <TabsTrigger
              value='values'
              className='data-[state=active]:bg-background'>
              <LayoutGrid className='w-4 h-4 mr-2' />
              Values
            </TabsTrigger>
            <TabsTrigger
              value='paths'
              className='data-[state=active]:bg-background'>
              <Route className='w-4 h-4 mr-2' />
              Paths
            </TabsTrigger>
          </TabsList>

          <TabsContent value='summary' className='mt-6'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <Card className='bg-muted/30'>
                <CardContent className='pt-6'>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>Size</p>
                    <p className='text-2xl font-bold'>
                      {(analysis.summary.totalSize / 1024).toFixed(2)}
                      <span className='text-sm font-normal text-muted-foreground ml-1'>
                        KB
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-muted/30'>
                <CardContent className='pt-6'>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>Total Keys</p>
                    <p className='text-2xl font-bold'>
                      {analysis.summary.totalKeys}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-muted/30'>
                <CardContent className='pt-6'>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>Max Depth</p>
                    <p className='text-2xl font-bold'>
                      {analysis.summary.maxDepth}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-muted/30'>
                <CardContent className='pt-6'>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>Parse Time</p>
                    <p className='text-2xl font-bold'>
                      {analysis.summary.performance.parseTime.toFixed(2)}
                      <span className='text-sm font-normal text-muted-foreground ml-1'>
                        ms
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className='mt-4 bg-muted/30'>
              <CardContent className='pt-6'>
                <h3 className='text-sm font-medium mb-4 flex items-center gap-2'>
                  <Clock className='w-4 h-4' />
                  Format Details
                </h3>
                <div className='grid gap-2'>
                  <div className='flex items-center justify-between py-1 border-b'>
                    <span className='text-sm text-muted-foreground'>
                      Indentation
                    </span>
                    <Badge variant='outline'>
                      {analysis.summary.format.indentation} spaces
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between py-1 border-b'>
                    <span className='text-sm text-muted-foreground'>
                      Trailing Commas
                    </span>
                    <Badge
                      variant={
                        analysis.summary.format.hasTrailingCommas
                          ? "default"
                          : "secondary"
                      }>
                      {analysis.summary.format.hasTrailingCommas ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between py-1'>
                    <span className='text-sm text-muted-foreground'>
                      Duplicate Keys
                    </span>
                    <Badge
                      variant={
                        analysis.summary.format.hasDuplicateKeys
                          ? "destructive"
                          : "secondary"
                      }>
                      {analysis.summary.format.hasDuplicateKeys ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='structure' className='mt-6'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card className='bg-muted/30'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-base font-medium'>
                    Objects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center py-1 border-b'>
                      <span className='text-sm text-muted-foreground'>
                        Count
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.objects.count}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1 border-b'>
                      <span className='text-sm text-muted-foreground'>
                        Max Nesting
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.objects.maxNesting}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1'>
                      <span className='text-sm text-muted-foreground'>
                        Average Keys
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.objects.averageKeys.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-muted/30'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-base font-medium'>
                    Arrays
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center py-1 border-b'>
                      <span className='text-sm text-muted-foreground'>
                        Count
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.arrays.count}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1 border-b'>
                      <span className='text-sm text-muted-foreground'>
                        Max Length
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.arrays.maxLength}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1'>
                      <span className='text-sm text-muted-foreground'>
                        Average Length
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.arrays.averageLength.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='values' className='mt-6'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card className='bg-muted/30'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-base font-medium'>
                    Strings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center py-1 border-b'>
                      <span className='text-sm text-muted-foreground'>
                        Count
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.values.strings.count}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1 border-b'>
                      <span className='text-sm text-muted-foreground'>
                        Max Length
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.values.strings.maxLength}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1 border-b'>
                      <span className='text-sm text-muted-foreground'>
                        Empty
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.values.strings.empty}
                      </span>
                    </div>
                    <div className='mt-2'>
                      <h4 className='text-sm font-medium mb-2'>
                        Pattern Matches
                      </h4>
                      <div className='flex gap-2 flex-wrap'>
                        <Badge variant='outline' className='bg-muted/50'>
                          {analysis.structure.values.strings.patterns.dates}{" "}
                          dates
                        </Badge>
                        <Badge variant='outline' className='bg-muted/50'>
                          {analysis.structure.values.strings.patterns.emails}{" "}
                          emails
                        </Badge>
                        <Badge variant='outline' className='bg-muted/50'>
                          {analysis.structure.values.strings.patterns.urls} URLs
                        </Badge>
                        <Badge variant='outline' className='bg-muted/50'>
                          {analysis.structure.values.strings.patterns.uuids}{" "}
                          UUIDs
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-muted/30'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-base font-medium'>
                    Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center py-1 border-b'>
                      <span className='text-sm text-muted-foreground'>
                        Total
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.values.numbers.count}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1 border-b'>
                      <span className='text-sm text-muted-foreground'>
                        Integers
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.values.numbers.integers}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1 border-b'>
                      <span className='text-sm text-muted-foreground'>
                        Decimals
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.values.numbers.decimals}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1'>
                      <span className='text-sm text-muted-foreground'>
                        Range
                      </span>
                      <span className='font-medium'>
                        {analysis.structure.values.numbers.min} to{" "}
                        {analysis.structure.values.numbers.max}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='paths' className='mt-6'>
            <div className='space-y-4'>
              <Card className='bg-muted/30'>
                <CardHeader className='pb-2'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-base font-medium'>
                      Longest Path
                    </CardTitle>
                    <Badge variant='outline' className='bg-muted/50'>
                      {analysis.paths.longest.split(".").length} levels
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className='h-[60px] w-full rounded-md border bg-muted/50 p-2'>
                    <code className='text-sm font-mono text-muted-foreground'>
                      {analysis.paths.longest}
                    </code>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className='bg-muted/30'>
                <CardHeader className='pb-2'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-base font-medium'>
                      Deepest Paths
                    </CardTitle>
                    <Badge variant='outline' className='bg-muted/50'>
                      {analysis.paths.deepest.length} paths
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className='h-[200px] w-full rounded-md border bg-muted/50 p-4'>
                    <div className='space-y-2'>
                      {analysis.paths.deepest.map((path, i) => (
                        <div key={i} className='flex items-center gap-2'>
                          <ListTree className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                          <code className='text-sm font-mono text-muted-foreground'>
                            {path}
                          </code>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {analysis.paths.circular.length > 0 && (
                <Card className='bg-muted/30 border-destructive/50'>
                  <CardHeader className='pb-2'>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='text-base font-medium text-destructive'>
                        Circular References
                      </CardTitle>
                      <Badge variant='destructive'>
                        {analysis.paths.circular.length} found
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className='h-[100px] w-full rounded-md border bg-destructive/5 p-4'>
                      <div className='space-y-2'>
                        {analysis.paths.circular.map((path, i) => (
                          <div key={i} className='flex items-center gap-2'>
                            <ListTree className='w-4 h-4 text-destructive flex-shrink-0' />
                            <code className='text-sm font-mono text-destructive'>
                              {path}
                            </code>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}