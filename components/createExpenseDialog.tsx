import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaPlus } from "react-icons/fa6"
 
export function CreateExpenseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
            <FaPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-20px)] rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create expense</DialogTitle>
          <DialogDescription>
            Fill the fields below to add an expense to the trip.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="grid grid-rows-1 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="row-span-1" />
          </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}