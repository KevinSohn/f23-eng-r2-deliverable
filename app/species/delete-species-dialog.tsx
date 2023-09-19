"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { type Database } from "@/lib/schema";
import { Label } from "@radix-ui/react-dropdown-menu";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
type Species = Database["public"]["Tables"]["species"]["Row"];

export default function DeleteSpeciesDialog({ species }: { species: Species }) {
  const [open, setOpen] = useState<boolean>(false);

  async function deleteEntry() {
    const supabase = createClientComponentClient<Database>();
    console.log(species);
    const { error } = await supabase.from("species").delete().eq("id", species.id);
    if (error) {
      toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }
    window.location.reload();
  }

  return (
    <div className="absolute">
      <Dialog open={open}>
        <DialogTrigger>
          <Button
            className="absolute ml-52 w-10 items-center rounded-full object-right-top"
            onClick={() => setOpen(true)}
            variant={"destructive"}
          >
            ❌
          </Button>
        </DialogTrigger>
        <DialogContent className="w-max ">
          <DialogHeader className="max-w">
            <Label>Are you sure you want to delete this entry?</Label>
            <div className="flex w-full ">
              <Button
                className="w-full"
                variant={"destructive"}
                onClick={() => {
                  deleteEntry();
                }}
              >
                Delete Permanently
              </Button>
              <Button type="button" className="w-full" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
