"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface TableRow {
  id: string | number
  [key: string]: any
}

interface DataTableProps {
  data: TableRow[]
}

export function DataTable({ data }: DataTableProps) {
  if (data.length === 0) {
    return (
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Get column headers from first row
  const headers = Object.keys(data[0]).filter((key) => key !== "id")

  return (
    <Card className="mx-4 lg:mx-6">
      <CardHeader>
        <CardTitle>Recent Generations</CardTitle>
        <CardDescription>
          Last 50 tattoo generations from all users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="capitalize">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {headers.map((header) => (
                  <TableCell key={header}>
                    {header === "status" ? (
                      <Badge
                        variant={
                          row[header] === "completed"
                            ? "default"
                            : row[header] === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {row[header]}
                      </Badge>
                    ) : (
                      row[header]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
