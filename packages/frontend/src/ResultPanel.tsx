import { useEffect, useState } from "react";
import { bind } from "@react-rxjs/core";
import {
  BehaviorSubject,
  from,
  repeat,
  Subject,
  switchMap,
  take,
  tap,
  map,
  filter,
  timer,
  concatMap,
  of,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
} from "rxjs";
import axios from "axios";
import { HOST } from "./config";
import { createSignal } from "@react-rxjs/utils";

export const jid$ = new Subject<number>();

interface LogItem {
  type: "strong" | "info" | "success" | "error";
  content: string;
}

const log$ = new Subject<LogItem>();
const [useLog] = bind<LogItem>(log$, {
  type: "info",
  content: "Waiting for judge...",
});

function createStatusObs() {
  return jid$.pipe(
    switchMap((id) =>
      of(`${HOST}/judgeStatus/${id}`).pipe(
        concatMap((url) => from(axios.get(url))),
        repeat({ delay: 500 }),
        map((v): [boolean, LogItem] => {
          if (v.status !== 200) {
            return [
              false,
              {
                type: "error",
                content: `Request failed: ${v.status}\n${JSON.stringify(
                  v.data
                )}`,
              },
            ];
          }
          const { data } = v;
          if ("status" in data) {
            if (data.status === "launching") {
              return [
                false,
                {
                  type: "strong",
                  content: "Launching...",
                },
              ];
            } else if (data.status === "judging") {
              return [
                false,
                {
                  type: "info",
                  content: `Judging case ${data.caseNo}`,
                },
              ];
            } else {
              return [
                true,
                {
                  type: data.result?.type === "Accepted" ? "success" : "error",
                  content: `${data.result?.type} ${data.result?.message ?? ""}`,
                },
              ];
            }
          } else {
            return [
              false,
              {
                type: "error",
                content: JSON.stringify(v.data),
              },
            ];
          }
        }),
        tap(([_, log]) => log$.next(log)),
        filter(([done]) => done),
        take(1)
      )
    )
  );
}

export default function ResultPanel() {
  const log = useLog();
  useEffect(() => {
    const sub = createStatusObs().subscribe();
    return () => sub.unsubscribe();
  }, []);
  return (
    <div
      className={`font-mono ${
        log.type === "strong"
          ? "font-bold"
          : log.type === "error"
          ? "text-red-500"
          : log.type === "success"
          ? "text-green-500"
          : "text-gray-600"
      }`}
    >
      {log.content}
    </div>
  );
}
