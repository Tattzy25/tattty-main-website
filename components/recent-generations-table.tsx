import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentGeneration {
  id: string
  userId: string
  status: string
  modelUsed: string | null
  timeTaken: number | null
  createdAt: Date
}

interface RecentGenerationsTableProps {
  data: RecentGeneration[]
}

export function RecentGenerationsTable({ data }: RecentGenerationsTableProps) {
  const formatTime = (seconds: number | null) => {
    if (!seconds) return "N/A"
    return `${seconds.toFixed(1)}s`
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Generations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Time Taken</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((generation) => (
              <TableRow key={generation.id}>
                <TableCell className="font-mono text-xs">
                  {generation.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {generation.userId.slice(0, 8)}...
                </TableCell>
                <TableCell>{getStatusBadge(generation.status)}</TableCell>
                <TableCell>{generation.modelUsed || "N/A"}</TableCell>
                <TableCell>{formatTime(generation.timeTaken)}</TableCell>
                <TableCell>
                  {new Date(generation.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
