import { useState } from "react";
import { Button, Input, Select } from "../../../components/ui/index.ts";
import {
  APIMutationCallbackFn,
  APIMutationFn,
} from "../../../components/api/api.ts";
import { PlanCategory } from "../../../components/api/plan-categories.ts";

interface Props {
  planID: string;
  mutationFn: APIMutationFn<PlanCategory>;
  callbacks: APIMutationCallbackFn[];
}

export function CategoryForm(
  { planID, mutationFn, callbacks }: Props,
) {
  const [newCategoryType, setNewCategoryType] = useState<string>("");

  const handleSubmitNewCategory = async function (
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const amount = Number(formData.get("amount") as string);

    await mutationFn({
      updatedDat: {
        name: name,
        plan_id: planID,
        deposit: newCategoryType === "deposit" ? amount : 0,
        withdrawal: newCategoryType === "withdrawal" ? amount : 0,
      },
      callback: callbacks,
    });
  };

  return (
    <form
      className="space-y-8"
      onSubmit={handleSubmitNewCategory}
    >
      <div>
        <label>Category Name</label>
        <Input name="name" type="text" placeholder="type text here..." />
      </div>
      <div>
        <label>Amount</label>
        <Input
          name="amount"
          type="number"
          placeholder="type text here..."
        />
      </div>
      <div>
        <label>Type</label>
        <div>
          <Select
            onChange={(newValue: string | number) =>
              setNewCategoryType(newValue as string)}
            value={newCategoryType}
            options={[
              { label: "Deposit", value: "deposit" },
              { label: "Withdrawal", value: "withdrawal" },
            ]}
          />
        </div>
      </div>
      <div className="mt-auto">
        <Button type="submit">Add Category</Button>
      </div>
    </form>
  );
}
