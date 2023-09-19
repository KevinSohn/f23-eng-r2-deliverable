"use client";

import type { Database } from "@/lib/schema";
import Image from "next/image";
import DeleteSpeciesDialog from "./delete-species-dialog";
import EditSpeciesDialog from "./edit-species-dialog";
import ShowSpeciesDialog from "./show-species-dialog";
type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard(props: { species: Species; userId: string }) {
  let edit;
  let deleteButton;

  if (props.userId == props.species.author) {
    edit = <EditSpeciesDialog key={props.species.id} user={props.userId} species={props.species} />;
    deleteButton = <DeleteSpeciesDialog species={props.species} />;
  } else {
    edit = <div></div>;
    deleteButton = <div></div>;
  }
  return (
    <div className="min-w-72 h-100 static m-4 w-72 flex-none rounded border-2 p-3 shadow ">
      {props.species.image && (
        <div className="relative h-40 w-full">
          <Image src={props.species.image} alt={props.species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      {edit}
      {deleteButton}
      <h3 className="mt-3 text-2xl font-semibold">{props.species.common_name}</h3>
      <h4 className="text-lg font-light italic">{props.species.scientific_name}</h4>
      <p className="h-20">{props.species.description ? props.species.description.slice(0, 90).trim() + "..." : ""}</p>
      {/* the detailed view */}
      <ShowSpeciesDialog key={props.species.id} {...props.species} />
    </div>
  );
}
