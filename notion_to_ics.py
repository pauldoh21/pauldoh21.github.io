#!/usr/bin/env python3
"""
notion_to_ics.py
Fetch events from a Notion database and write calendar.ics.
Expects environment variables:
  NOTION_TOKEN
  NOTION_DATABASE_ID
"""

import os
import requests
from ics import Calendar, Event
from datetime import datetime
import pytz

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

if not NOTION_TOKEN or not DATABASE_ID:
    raise SystemExit("Missing NOTION_TOKEN or NOTION_DATABASE_ID environment variables.")

NOTION_VERSION = "2022-06-28"
NOTION_BASE = "https://api.notion.com/v1"

HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
}

def query_database(database_id):
    url = f"{NOTION_BASE}/databases/{database_id}/query"
    has_more = True
    start_cursor = None
    results = []
    while True:
        body = {}
        if start_cursor:
            body["start_cursor"] = start_cursor
        r = requests.post(url, headers=HEADERS, json=body, timeout=30)
        r.raise_for_status()
        data = r.json()
        results.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        start_cursor = data.get("next_cursor")
    return results

def find_title_prop(properties):
    # Find the title property (Notion type "title")
    for prop_name, prop in properties.items():
        if prop.get("type") == "title":
            return prop_name
    # Fallback: try common names
    for candidate in ("Name", "Title", "name", "title"):
        if candidate in properties:
            return candidate
    return None

def get_plain_title(page, title_prop_name):
    prop = page["properties"].get(title_prop_name, {})
    # title is a list of rich_text objects
    title_list = prop.get("title", [])
    if title_list:
        return "".join([t.get("plain_text", "") for t in title_list]).strip()
    return "Untitled"

def parse_notion_date(date_obj):
    # date_obj is like: {"start": "...", "end": "...", "time_zone": None}
    if not date_obj:
        return None, None
    start = date_obj.get("start")
    end = date_obj.get("end")
    # Notion may return date-only "YYYY-MM-DD" or full ISO datetime.
    return start, end

def iso_to_dt(iso_str):
    # Return a datetime or date-string acceptable to ics.Event.begin
    # ics library accepts ISO strings fine. We'll return string unchanged.
    return iso_str

def main():
    pages = query_database(DATABASE_ID)
    cal = Calendar()
    for p in pages:
        props = p.get("properties", {})
        title_prop_name = find_title_prop(props)
        title = get_plain_title(p, title_prop_name) if title_prop_name else "Untitled"
        # Access the 'date' property as user specified
        date_prop = props.get("date")
        if not date_prop:
            # skip pages with no 'date' property
            continue
        # Notion stores the actual date in date_prop['date']
        date_val = date_prop.get("date")
        if not date_val:
            continue
        start, end = parse_notion_date(date_val)
        if not start:
            continue

        e = Event()
        e.name = title
        # add Notion page URL to description if available
        page_url = p.get("url")
        if page_url:
            e.description = f"Notion page: {page_url}"

        # Use page id as UID (safe for ics)
        page_id = p.get("id", "").replace("-", "")
        e.uid = page_id

        # The ics library can accept ISO strings with or without timezone.
        # If end is set, use it; otherwise rely on start only.
        if end:
            e.begin = iso_to_dt(start)
            e.end = iso_to_dt(end)
        else:
            e.begin = iso_to_dt(start)
            # If this is a date-only (no time) you may want it to be an all-day event.
            # The ics library will set that automatically if string has only 'YYYY-MM-DD'.

        cal.events.add(e)

    out_path = "calendar.ics"
    with open(out_path, "w", encoding="utf-8") as f:
        f.writelines(cal.serialize_iter())
    print(f"Wrote {out_path} with {len(cal.events)} events.")

if __name__ == "__main__":
    main()
