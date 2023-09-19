"use client";

import type { Database } from "@/lib/schema";
import ShowProfilesDialog from "./show-users-dialog";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function UsersCard({ profiles }: { profiles: Profiles }) {
  return (
    <div className="min-w-72 h-100 static m-4 w-72 flex-none rounded border-2 p-3 shadow ">
      <h3 className="mt-3 text-2xl font-semibold">{profiles.display_name}</h3>
      <h4 className="text-lg font-light italic">{profiles.email}</h4>
      <p className="h-20">{profiles.biography ? profiles.biography.slice(0, 90).trim() + "..." : ""}</p>
      {/* the detailed view */}
      <ShowProfilesDialog key={profiles.id} {...profiles} />
    </div>
  );
}
