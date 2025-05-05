import { getKnowledgeBase, getKnowledgeCategories } from "@/lib/reference-knowledge"
import { KnowledgeEntryForm } from "@/components/admin/knowledge-entry-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function KnowledgeBasePage() {
  const { data: entries, error } = await getKnowledgeBase()
  const { categories, error: categoriesError } = await getKnowledgeCategories()

  if (error || categoriesError) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Knowledge Base Management</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading knowledge base: {error || categoriesError}
        </div>
      </div>
    )
  }

  // Group entries by category
  const entriesByCategory: Record<string, any[]> = {}
  entries?.forEach((entry) => {
    if (!entriesByCategory[entry.category]) {
      entriesByCategory[entry.category] = []
    }
    entriesByCategory[entry.category].push(entry)
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Knowledge Base Management</h1>

      <div className="mb-8">
        <KnowledgeEntryForm />
      </div>

      <Tabs defaultValue={categories?.[0] || "all"}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories?.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries?.map((entry) => (
              <KnowledgeEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </TabsContent>

        {categories?.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {entriesByCategory[category]?.map((entry) => (
                <KnowledgeEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function KnowledgeEntryCard({ entry }: { entry: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry.title}</CardTitle>
        <CardDescription>
          {entry.category} • {new Date(entry.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: entry.content.substring(0, 150) + "..." }} />
        </div>
        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {entry.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
