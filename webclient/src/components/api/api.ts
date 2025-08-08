import { useEffect, useState } from "react";
import { useAuth } from "../auth-provider.tsx";
import { Collection, Link, Resource } from "./links.ts";

interface ErrorResponse {
  error: string;
}

export function useAPIResource<T extends Resource>(
  initialLink: Link,
) {
  const [resource, setResource] = useState<T | undefined>(undefined);
  const [link, setLink] = useState<Link>(initialLink);
  const [fetching, setFetching] = useState<boolean>(false);
  const [errored, setErrored] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const auth = useAuth();

  const selectLink = function (
    name: string,
    templateParams?: Record<string, string[]>,
  ) {
    if (!resource) {
      return;
    }

    const link = resource._links[name];
    if (!link) {
      return;
    }

    if (link.templated && templateParams) {
      const regex = /\{\?([^}]*)\}/;
      const matches = link.href.match(regex);
      if (!matches) return;

      const availableParams = matches[1].split(",");

      const baseHref = link.href.replace(regex, "");
      const linkURL = new URL(baseHref, globalThis.location.origin);

      availableParams.forEach((key) => {
        const values = templateParams[key];
        if (!values) return;
        values.forEach((val) => {
          linkURL.searchParams.append(key, val);
        });
      });

      link.href = baseHref + linkURL.search;
    } else if (link.templated) {
      return;
    }

    setLink(link);
  };

  useEffect(() => {
    setFetching(true);
    setErrored(false);
    fetch(link.href, {
      headers: {
        "Authorization": `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((dat: T) => setResource(dat))
      .catch((e) => {
        console.log(e);
        setErrored(true);
        setErrorMessage(e);
        setResource(undefined);
      })
      .finally(() => setFetching(false));
  }, [link]);

  return {
    resource: resource,
    selectLink: selectLink,
    fetching: fetching,
    errored: errored,
    errorMessage: errorMessage,
  };
}

export function useAPICollection<T extends Resource>(
  initialLink: Link,
) {
  const [link, setLink] = useState<Link>(initialLink);
  const [collection, setCollection] = useState<Collection<T> | undefined>(
    undefined,
  );
  const [fetching, setFetching] = useState<boolean>(false);
  const [errored, setErrored] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const auth = useAuth();

  const selectLink = function (
    name: string,
    templateParams?: Record<string, string[]>,
  ) {
    if (!collection) {
      return;
    }

    const link = collection._links[name];
    if (!link) {
      return;
    }

    if (link.templated && templateParams) {
      const regex = /\{\?([^}]*)\}/;
      const matches = link.href.match(regex);
      if (!matches) return;

      const availableParams = matches[1].split(",");

      const baseHref = link.href.replace(regex, "");
      const linkURL = new URL(baseHref, globalThis.location.origin);

      availableParams.forEach((key) => {
        const values = templateParams[key];
        if (!values) return;
        values.forEach((val) => {
          linkURL.searchParams.append(key, val);
        });
      });

      link.href = baseHref + linkURL.search;
    } else if (link.templated) {
      return;
    }

    setLink(link);
  };

  const refetch = function () {
    if (!collection) return;
    setLink(collection._links["self"]);
  };

  useEffect(() => {
    setFetching(true);
    setErrored(false);
    fetch(link.href, {
      headers: {
        "Authorization": `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((dat: Collection<T>) => setCollection(dat))
      .catch((e) => {
        console.log(e);
        setErrored(true);
        setCollection(undefined);
        setErrorMessage;
      })
      .finally(() => setFetching(false));
  }, [link]);

  return {
    collection: collection,
    link: link,
    selectLink: selectLink,
    refetch: refetch,
    fetching: fetching,
    errored: errored,
    errorMessage: errorMessage,
  };
}

export interface MutateParams<T extends Resource> {
  updatedDat?: Partial<T>;
  callback?: () => void;
}

export function useAPIMutation<T extends Resource>(
  link?: Link,
) {
  const [mutating, setMutating] = useState<boolean>(false);
  const [errored, setErrored] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const auth = useAuth();

  const mutate = async function (
    { updatedDat, callback }: MutateParams<T>,
  ): Promise<T | undefined> {
    if (!link) throw Error("Invalid link");
    setErrored(false);
    setMutating(true);

    try {
      const res = await fetch(link.href, {
        method: link.method,
        headers: {
          "Authorization": `Bearer ${auth.accessToken}`,
          "Content-Type": "application/json",
        },
        body: updatedDat ? JSON.stringify(updatedDat) : undefined,
      });

      if (!res.ok) {
        const e: ErrorResponse = await res.json();
        setErrored(true);
        setErrorMessage(e.error);
        throw Error(e.error);
      }

      if (callback) callback();

      if (link.method === "DELETE") return;

      const dat: T = await res.json();
      return dat;
    } finally {
      setMutating(false);
    }
  };

  return {
    mutate: mutate,
    mutating: mutating,
    errored: errored,
    errorMessage: errorMessage,
  };
}
