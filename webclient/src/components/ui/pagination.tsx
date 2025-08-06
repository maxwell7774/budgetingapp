import { Collection, Link, Resource } from "../api/links.ts";
import { ChevronRightIcon } from "./icons/chevron-right.tsx";
import { DoubleChevronRightIcon } from "./icons/double-chevron-right.tsx";
import { ChevronLeftIcon, DoubleChevronLeftIcon } from "./icons/index.ts";
import { Button } from "./index.ts";

interface Props<T extends Resource> {
  collection: Collection<T>;
  setLink: (newLink: Link) => void;
}
export function Pagination<T extends Resource>(
  { collection, setLink }: Props<T>,
) {
  return (
    <div className="flex items-center gap-1">
      {collection.page_size < collection.total_items
        ? (
          <>
            <Button
              variant="outline"
              className="w-11 !px-0"
              onClick={() => setLink(collection._links["first"])}
              disabled={!collection._links["first"]}
            >
              <DoubleChevronLeftIcon className="size-5" />
            </Button>
            <Button
              variant="outline"
              className="w-11 !px-0"
              onClick={() => setLink(collection._links["prev"])}
              disabled={!collection._links["prev"]}
            >
              <ChevronLeftIcon className="size-5" />
            </Button>
            <Button
              variant="outline"
              className="w-11 !px-0"
              onClick={() => setLink(collection._links["next"])}
              disabled={!collection._links["next"]}
            >
              <ChevronRightIcon className="size-5" />
            </Button>
            <Button
              variant="outline"
              className="w-11 !px-0"
              onClick={() => setLink(collection._links["last"])}
              disabled={!collection._links["last"]}
            >
              <DoubleChevronRightIcon className="size-5" />
            </Button>
          </>
        )
        : null}
    </div>
  );
}
