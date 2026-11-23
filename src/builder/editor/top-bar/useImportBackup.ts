"use client";

import { isValidProject, reIdTheme, useBuilder, withUlidIds } from "../../store";
import { pickFile } from "../../lib/download";

/** Open a backup: a full project (replaces everything) or a single theme.json from a ZIP export (added). */
export function useImportBackup(): () => void {
  const { dispatch } = useBuilder();
  return () =>
    pickFile("application/json,.json", async (file) => {
      try {
        const data = JSON.parse(await file.text());
        if (isValidProject(data)) dispatch({ type: "LOAD", project: withUlidIds(data) });
        else if (data && Array.isArray(data.pages) && Array.isArray(data.header)) dispatch({ type: "ADD_THEME", theme: reIdTheme(data) });
        else alert("This file is not a Theme Builder backup.");
      } catch {
        alert("Could not read this file.");
      }
    });
}
