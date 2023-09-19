"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { type Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
type Species = Database["public"]["Tables"]["species"]["Row"];

const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

const speciesSchema = z.object({
  common_name: z
    .string()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  description: z
    .string()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  kingdom: kingdoms,
  scientific_name: z
    .string()
    .trim()
    .min(1)
    .transform((val) => val?.trim()),
  total_population: z.number().int().positive().min(1).optional(),
  image: z
    .string()
    .url()
    .nullable()
    .transform((val) => val?.trim()),
});

type FormData = z.infer<typeof speciesSchema>;

export default function EditSpeciesDialog(props: { user: string; species: Species }) {
  const defaultValues: Partial<FormData> = {
    scientific_name: props.species.scientific_name,
    common_name: props.species.common_name,
    total_population: props.species.total_population ?? 1,
    kingdom: props.species.kingdom,
    description: props.species.description,
    author: props.species.author,
    image: props.species.image ?? "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png?20091205084734",
  };
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (input: FormData) => {
    // The `input` prop contains data that has already been processed by zod. We can now use it in a supabase query
    const supabase = createClientComponentClient<Database>();
    const { error } = await supabase
      .from("species")
      .update({
        author: props.user,
        common_name: input.common_name,
        description: input.description,
        kingdom: input.kingdom,
        scientific_name: input.scientific_name,
        total_population: input.total_population,
        image: input.image,
      })
      .eq("id", props.species.id);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }
    // Reset form values to the data values that have been processed by zod.
    // This way the user sees any changes that have occurred during transformation
    form.reset(input);

    setOpen(false);

    // Refresh all server components in the current route. This helps display the newly created species because species are fetched in a server component, species/page.tsx.
    // Refreshing that server component will display the new species from Supabase
    router.refresh();
  };

  return (
    <div className="absolute">
      <Dialog open={open}>
        <DialogTrigger>
          <Button
            className="absolute ml-40 w-10 items-center rounded-full object-right-top"
            onClick={() => setOpen(true)}
            variant={"secondary"}
          >
            ✏️
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <Form {...form}>
              <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
                <div className="grid w-full items-center gap-4">
                  <FormField
                    control={form.control}
                    name="scientific_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scientific Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Cavia porcellus" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="common_name"
                    render={({ field }) => {
                      // We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                      const { value, ...rest } = field;
                      return (
                        <FormItem>
                          <FormLabel>Common Name</FormLabel>
                          <FormControl>
                            <Input value={value ?? ""} placeholder="Guinea pig" {...rest} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="kingdom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kingdom</FormLabel>
                        {/* Using shadcn/ui form with enum: https://github.com/shadcn-ui/ui/issues/772 */}
                        <Select
                          onValueChange={(value) => field.onChange(kingdoms.parse(value))}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a kingdom" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {kingdoms.options.map((kingdom, index) => (
                                <SelectItem key={index} value={kingdom}>
                                  {kingdom}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_population"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total population</FormLabel>
                        <FormControl>
                          {/* Using shadcn/ui form with number: https://github.com/shadcn-ui/ui/issues/421 */}
                          <Input
                            type="number"
                            placeholder="300000"
                            {...field}
                            onChange={(event) => field.onChange(+event.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/George_the_amazing_guinea_pig.jpg/440px-George_the_amazing_guinea_pig.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                      // We must extract value from field and convert a potential defaultValue of `null` to "" because textareas can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                      const { value, ...rest } = field;
                      return (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              value={value ?? ""}
                              placeholder="The guinea pig or domestic guinea pig, also known as the cavy or domestic cavy, is a species of rodent belonging to the genus Cavia in the family Caviidae."
                              {...rest}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <div className="flex">
                    <Button type="submit" className="ml-1 mr-1 flex-auto">
                      Update Species
                    </Button>
                    <Button
                      type="button"
                      className="ml-1 mr-1 flex-auto"
                      variant="secondary"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
