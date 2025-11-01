
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wind, BookOpen } from "lucide-react"

export default function QuickAccess() {
  return (
    <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
        <CardDescription>Start an activity to support your well-being.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="outline" size="lg" className="justify-start h-20 text-left hover:bg-accent/50">
            <Wind className="mr-4 h-6 w-6 text-accent-foreground/80" />
            <div>
                <p className="font-semibold">Guided Meditations</p>
                <p className="text-sm font-normal text-muted-foreground">Find calm and focus</p>
            </div>
          </Button>
          <Button variant="outline" size="lg" className="justify-start h-20 text-left hover:bg-accent/50">
            <BookOpen className="mr-4 h-6 w-6 text-accent-foreground/80" />
            <div>
                <p className="font-semibold">Journaling Prompts</p>
                <p className="text-sm font-normal text-muted-foreground">Reflect and grow</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
