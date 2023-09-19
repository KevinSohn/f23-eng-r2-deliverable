"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function ShowProfilesDialog(profiles: Profiles) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <h3 className="mt-3 text-4xl font-semibold">{profiles.display_name}</h3>
          </DialogTitle>
          <DialogDescription>
            <h4 className="text-2xl font-light italic">{profiles.email}</h4>
          </DialogDescription>
          <DialogDescription className="text-xl">{profiles.biography}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
