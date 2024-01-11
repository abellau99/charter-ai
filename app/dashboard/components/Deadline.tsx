"use client";

import { ContentFormContext } from "@/context/ContentformContext";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useEffect, useState } from "react";

export default function Deadline() {
  const { data: session, status: sessionStatus } = useSession();

  const { globalDeadline, setGlobalDeadline } = useContext(ContentFormContext);

  const [nextAt, setNextAt] = useState<DateTime | null>(null);

  const getTime = useCallback(() => {
    if (nextAt) {
      const dateTimeNow = DateTime.now();
      const diffDuration = nextAt!.diff(dateTimeNow);
      const h = Math.floor(diffDuration.as("hours"));
      const m = Math.floor(diffDuration.as("minutes")) % 60;
      const s = Math.floor(diffDuration.as("seconds")) % 60;
      setGlobalDeadline(`${padTime(h)}:${padTime(m)}:${padTime(s)}`);
    }
  }, [nextAt, setGlobalDeadline]);

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  }, [getTime]);

  const fetchNextAt = useCallback(async () => {
    const res = await fetch("/api/users/next-at");
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    if (data.nextAt) {
      setNextAt(DateTime.fromISO(data.nextAt));
    }
  }, []);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (!session?.user?.subscription?.isPro) {
      fetchNextAt();
    }
  }, [sessionStatus, session?.user?.subscription?.isPro, fetchNextAt]);
  return (
    <div className="mob-max:hidden">
      {globalDeadline && (
        <p>
          You can create new content in{" "}
          <span className="font-bold">{globalDeadline}</span>
        </p>
      )}
    </div>
  );
}

const padTime = (time: number) => {
  return time.toString().padStart(2, "0");
};
