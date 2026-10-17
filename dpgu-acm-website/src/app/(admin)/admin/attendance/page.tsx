import * as React from "react";
import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { AttendanceClient } from "./AttendanceClient";

export const metadata: Metadata = {
  title: "Gate Attendance & QR Verification",
  description: "Check in attendees, verify digital tickets, and detect duplicate scans.",
};

export const revalidate = 0;

export default async function AdminAttendancePage() {
  const db = getDb();
  const events = await db.events.getAll();
  const attendance = await db.attendance.getAll();
  const stats = await db.attendance.getStats();

  return (
    <div className="space-y-6">
      <AttendanceClient
        events={events}
        initialRecords={attendance}
        initialStats={stats}
      />
    </div>
  );
}
