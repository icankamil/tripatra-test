import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface SearchField {
  id: string; // Unique identifier for the input
  placeholder: string; // Placeholder text for the input
  type: string; // Type of the input (text, email, etc.)
}

export interface SearchProps {
  fields: SearchField[]; // Array of search fields
  setSearch: (searchValues: { [key: string]: string }) => void; // Function to set search values
  search: Record<string, unknown>;
}

export default function SearchInput(props: SearchProps) {
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );

  const handleChange = (id: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSearch = () => {
    props.setSearch(searchValues);
  };

  const handleReset = () => {
    setSearchValues({});
    props.setSearch({});
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="search">Cari berdasarkan</Label>
      <div className="flex flex-wrap">
        {props.fields.map((field) => (
          <div key={field.id} className="w-full sm:w-1/2 px-3">
            <Input
              type={field.type}
              id={field.id}
              placeholder={field.placeholder}
              className="w-full"
              onChange={(e) => handleChange(field.id, e.target.value)}
              value={searchValues[field.id] || ""}
            />
          </div>
        ))}
      </div>
      <Button onClick={handleSearch}>Cari</Button>
      {Object.values(props.search).some((value) => value.length > 1) && (
        <Button onClick={handleReset}>Reset</Button>
      )}
    </div>
  );
}
