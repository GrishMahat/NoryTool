import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JSONAnalysis } from '@/lib/jsonUtils';

interface AnalysisViewProps {
  analysis: JSONAnalysis;
}

export function AnalysisView({ analysis }: AnalysisViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>JSON Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="values">Values</TabsTrigger>
            <TabsTrigger value="paths">Paths</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Size</h3>
                <p className="text-2xl font-bold">
                  {(analysis.summary.totalSize / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Total Keys</h3>
                <p className="text-2xl font-bold">{analysis.summary.totalKeys}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Max Depth</h3>
                <p className="text-2xl font-bold">{analysis.summary.maxDepth}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Format</h3>
                <ul className="text-sm">
                  <li>Indentation: {analysis.summary.format.indentation} spaces</li>
                  <li>Trailing Commas: {analysis.summary.format.hasTrailingCommas ? 'Yes' : 'No'}</li>
                  <li>Duplicate Keys: {analysis.summary.format.hasDuplicateKeys ? 'Yes' : 'No'}</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Objects</h3>
                <ul className="space-y-2">
                  <li>Count: {analysis.structure.objects.count}</li>
                  <li>Max Nesting: {analysis.structure.objects.maxNesting}</li>
                  <li>Avg Keys: {analysis.structure.objects.averageKeys.toFixed(2)}</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Arrays</h3>
                <ul className="space-y-2">
                  <li>Count: {analysis.structure.arrays.count}</li>
                  <li>Max Length: {analysis.structure.arrays.maxLength}</li>
                  <li>Avg Length: {analysis.structure.arrays.averageLength.toFixed(2)}</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="values" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Strings</h3>
                <ul className="space-y-2">
                  <li>Count: {analysis.structure.values.strings.count}</li>
                  <li>Max Length: {analysis.structure.values.strings.maxLength}</li>
                  <li>Empty: {analysis.structure.values.strings.empty}</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Numbers</h3>
                <ul className="space-y-2">
                  <li>Count: {analysis.structure.values.numbers.count}</li>
                  <li>Integers: {analysis.structure.values.numbers.integers}</li>
                  <li>Decimals: {analysis.structure.values.numbers.decimals}</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="paths" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Longest Path</h3>
                <p className="text-sm font-mono mt-1">{analysis.paths.longest}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Deepest Paths</h3>
                <ul className="space-y-1 mt-1">
                  {analysis.paths.deepest.map((path, i) => (
                    <li key={i} className="text-sm font-mono">{path}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 