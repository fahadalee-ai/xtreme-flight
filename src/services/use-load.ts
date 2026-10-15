import { useEffect, useState } from "react";

export function useLoad<T>(factory: () => Promise<T>, deps: unknown[] = []) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; data: T | null; error: string }>({
    status: "loading",
    data: null,
    error: "",
  });

  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, status: "loading", error: "" }));
    factory()
      .then((data) => {
        if (live) setState({ status: "ready", data, error: "" });
      })
      .catch((err: Error) => {
        if (live) setState({ status: "error", data: null, error: err.message || "Something went wrong." });
      });
    return () => {
      live = false;
    };
    // factory is recreated by the caller; reload when deps or retry change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  return {
    ...state,
    retry: () => setTick((n) => n + 1),
  };
}
