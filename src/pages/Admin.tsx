import React, { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { TutorRow, FounderRow, StatRow, TestimonialRow } from "../lib/dbTypes";
import { formatEventDateDisplay, type EventRow } from "../lib/eventMappers";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-surface-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-stem-500/50 focus:outline-none focus:ring-2 focus:ring-stem-500/30";
const labelClass = "block text-xs font-medium text-slate-400";

const eventColumns =
  "id, title, description, date, is_past, tutor_id, image_url, location_detailed, attendee_count, impact_summary";

export function Admin() {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState<TutorRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [tutorName, setTutorName] = useState("");
  const [tutorBio, setTutorBio] = useState("");
  const [tutorSchool, setTutorSchool] = useState("");
  const [tutorGrade, setTutorGrade] = useState("");
  const [tutorSubjects, setTutorSubjects] = useState("");

  const [evImageUrl, setEvImageUrl] = useState("");
  const [evImageUploadStatus, setEvImageUploadStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [evLocationDetailed, setEvLocationDetailed] = useState("");
  const [evAttendeeCount, setEvAttendeeCount] = useState("");
  const [evImpactSummary, setEvImpactSummary] = useState("");

  const [evTitle, setEvTitle] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evDescription, setEvDescription] = useState("");

  const [statLabel, setStatLabel] = useState("");
  const [statValue, setStatValue] = useState("");

  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialRole, setTestimonialRole] = useState("");
  const [testimonialContent, setTestimonialContent] = useState("");
  const [testimonialImageUrl, setTestimonialImageUrl] = useState("");
  const [testimonialImageUploadStatus, setTestimonialImageUploadStatus] = useState<"idle" | "uploading" | "error">("idle");

  const [founders, setFounders] = useState<FounderRow[]>([]);
  const [founderId, setFounderId] = useState("");
  const [founderName, setFounderName] = useState("");
  const [founderBio, setFounderBio] = useState("");
  const [founderSchool, setFounderSchool] = useState("");
  const [founderExpertise, setFounderExpertise] = useState("");
  const [founderPhotoUrl, setFounderPhotoUrl] = useState("");
  const [founderImageUploadStatus, setFounderImageUploadStatus] = useState<"idle" | "uploading" | "error">("idle");

  const refresh = useCallback(async () => {
    try {
      setError(null);
      console.log("[Admin] Refreshing data from database...");

      const [tRes, eRes, sRes, testRes, fRes] = await Promise.all([
        supabase.from("tutors").select("id, name, bio, school, grade, subjects").order("name"),
        supabase.from("events").select(eventColumns).order("date", { ascending: false }),
        supabase.from("stats").select("id, label, value").order("label"),
        supabase.from("testimonials").select("id, name, role, content, image_url").order("name"),
        supabase.from("founders").select("id, name, bio, school, expertise, photo_url").order("name"),
      ]);

      if (tRes.error) {
        console.error("[Admin] Failed to fetch tutors:", tRes.error);
        setTutors([]);
      } else {
        console.log("[Admin] Tutors fetched successfully:", tRes.data);
        setTutors((tRes.data as TutorRow[] | null) ?? []);
      }

      if (eRes.error) {
        console.error("[Admin] Failed to fetch events:", eRes.error);
        setEvents([]);
      } else {
        console.log("[Admin] Events fetched successfully:", eRes.data);
        const rows = (eRes.data as EventRow[] | null) ?? [];
        setEvents(rows.filter((r) => typeof r.id === "string" && r.id.length > 0));
      }

      if (sRes.error) {
        console.error("[Admin] Failed to fetch stats:", sRes.error);
        setStats([]);
      } else {
        console.log("[Admin] Stats fetched successfully:", sRes.data);
        setStats((sRes.data as StatRow[] | null) ?? []);
      }

      if (testRes.error) {
        console.error("[Admin] Failed to fetch testimonials:", testRes.error);
        setTestimonials([]);
      } else {
        console.log("[Admin] Testimonials fetched successfully:", testRes.data);
        setTestimonials((testRes.data as TestimonialRow[] | null) ?? []);
      }

      if (fRes.error) {
        console.error("[Admin] Failed to fetch founders:", fRes.error);
        setFounders([]);
      } else {
        const founderRows = (fRes.data as FounderRow[] | null) ?? [];
        console.log("[Admin] Founders fetched successfully:", founderRows);
        setFounders(founderRows);
        if (founderRows.length > 0 && !founderId) {
          const firstFounder = founderRows[0];
          setFounderId(firstFounder.id);
          setFounderName(firstFounder.name || "");
          setFounderBio(firstFounder.bio || "");
          setFounderSchool(firstFounder.school ?? "");
          setFounderExpertise(firstFounder.expertise ?? "");
          setFounderPhotoUrl(firstFounder.photo_url ?? "");
        }
      }

      const errParts = [tRes.error?.message, eRes.error?.message, sRes.error?.message, testRes.error?.message, fRes.error?.message].filter(Boolean);
      setError(errParts.length ? errParts.join(" · ") : null);
      setLoading(false);
    } catch (err) {
      console.error("[Admin] Refresh exception:", err);
      setError("Failed to refresh data. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onCreateTutor(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Auth check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("[Admin] Create tutor: User not authenticated");
      setError("You must be logged in to create tutors.");
      return;
    }

    const name = tutorName.trim();
    const bio = tutorBio.trim();
    if (!name || !bio) {
      setError("Name and bio are required.");
      return;
    }

    try {
      console.log("[Admin] Creating tutor:", { name, school: tutorSchool || "(none)" });
      const { data, error: insErr } = await supabase.from("tutors").insert({
        name,
        bio,
        school: tutorSchool.trim() || null,
        grade: tutorGrade.trim() || null,
        subjects: tutorSubjects.trim() || null,
      });

      if (insErr) {
        console.error("[Admin] Create tutor failed:", insErr);
        setError(`Failed to create tutor: ${insErr.message}`);
        return;
      }

      console.log("[Admin] Tutor created successfully:", data);
      setTutorName("");
      setTutorBio("");
      setTutorSchool("");
      setTutorGrade("");
      setTutorSubjects("");
      setMessage("Tutor created successfully.");
      await refresh();
    } catch (err) {
      console.error("[Admin] Create tutor exception:", err);
      setError("An unexpected error occurred while creating tutor.");
    }
  }

  async function onCreateEvent(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      // Auth check
      console.log("[Admin] onCreateEvent: Starting...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("[Admin] onCreateEvent: User not authenticated");
        setError("You must be logged in to create events.");
        return;
      }

      const title = evTitle.trim();
      const description = evDescription.trim();
      const date = evDate.trim();
      if (!title || !description || !date) {
        console.warn("[Admin] onCreateEvent: Missing required fields");
        setError("Title, description, and date are required.");
        return;
      }

      console.log("[Admin] onCreateEvent: Form data validated. Title:", title, "Date:", date);

      const image_url = evImageUrl.trim() || null;
      const location_detailed = evLocationDetailed.trim() || null;
      const attendee_count = evAttendeeCount.trim() ? parseInt(evAttendeeCount, 10) : null;
      const impact_summary = evImpactSummary.trim() || null;

      console.log("[Admin] onCreateEvent: Inserting event with data:", {
        title,
        description,
        date,
        image_url,
        location_detailed,
        attendee_count,
        impact_summary,
      });

      const { data, error: insErr } = await supabase.from("events").insert({
        title,
        description,
        date,
        is_past: false,
        image_url,
        location_detailed,
        attendee_count,
        impact_summary,
      });

      if (insErr) {
        console.error("[Admin] onCreateEvent: Insert failed:", insErr);
        setError(`Failed to create event: ${insErr.message}`);
        return;
      }

      console.log("[Admin] onCreateEvent: Event created successfully:", data);
      setEvTitle("");
      setEvDate("");
      setEvDescription("");
      setEvImageUrl("");
      setEvLocationDetailed("");
      setEvAttendeeCount("");
      setEvImpactSummary("");
      setMessage("Event created successfully.");
      await refresh();
    } catch (err) {
      console.error("[Admin] onCreateEvent: Exception:", err);
      setError("An unexpected error occurred while creating the event.");
    }
  }

  async function onCreateStat(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      // Auth check
      console.log("[Admin] onCreateStat: Starting...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("[Admin] onCreateStat: User not authenticated");
        setError("You must be logged in to create stats.");
        return;
      }

      const label = statLabel.trim();
      const value = parseInt(statValue.trim(), 10);
      if (!label || isNaN(value)) {
        console.warn("[Admin] onCreateStat: Missing or invalid fields");
        setError("Label and valid numeric value are required.");
        return;
      }

      console.log("[Admin] onCreateStat: Form data validated. Label:", label, "Value:", value);

      const { data, error: insErr } = await supabase.from("stats").insert({
        label,
        value,
      });

      if (insErr) {
        console.error("[Admin] onCreateStat: Insert failed:", insErr);
        setError(`Failed to create stat: ${insErr.message}`);
        return;
      }

      console.log("[Admin] onCreateStat: Stat created successfully:", data);
      setStatLabel("");
      setStatValue("");
      setMessage("Stat created successfully.");
      await refresh();
    } catch (err) {
      console.error("[Admin] onCreateStat: Exception:", err);
      setError("An unexpected error occurred while creating the stat.");
    }
  }

  async function onCreateTestimonial(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      // Auth check
      console.log("[Admin] onCreateTestimonial: Starting...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("[Admin] onCreateTestimonial: User not authenticated");
        setError("You must be logged in to create testimonials.");
        return;
      }

      const name = testimonialName.trim();
      const role = testimonialRole.trim();
      const content = testimonialContent.trim();
      if (!name || !role || !content) {
        console.warn("[Admin] onCreateTestimonial: Missing required fields");
        setError("Name, role, and content are required.");
        return;
      }

      console.log("[Admin] onCreateTestimonial: Form data validated. Name:", name, "Role:", role);

      const image_url = testimonialImageUrl.trim() || null;

      const { data, error: insErr } = await supabase.from("testimonials").insert({
        name,
        role,
        content,
        image_url,
      });

      if (insErr) {
        console.error("[Admin] onCreateTestimonial: Insert failed:", insErr);
        setError(`Failed to create testimonial: ${insErr.message}`);
        return;
      }

      console.log("[Admin] onCreateTestimonial: Testimonial created successfully:", data);
      setTestimonialName("");
      setTestimonialRole("");
      setTestimonialContent("");
      setTestimonialImageUrl("");
      setMessage("Testimonial created successfully.");
      await refresh();
    } catch (err) {
      console.error("[Admin] onCreateTestimonial: Exception:", err);
      setError("An unexpected error occurred while creating the testimonial.");
    }
  }

  async function onDeleteStat(id: string) {
    setMessage(null);
    setError(null);

    // Auth check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("[Admin] Delete stat: User not authenticated");
      setError("You must be logged in to delete stats.");
      return;
    }

    if (!confirm("Delete this stat?")) return;

    try {
      console.log("[Admin] Deleting stat with ID:", id);
      const { data, error } = await supabase
        .from("stats")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[Admin] Delete stat failed:", error);
        setError(`Failed to delete stat: ${error.message}`);
        return;
      }

      console.log("[Admin] Stat deleted successfully:", data);
      setMessage("Stat deleted successfully.");
      await refresh();
    } catch (err) {
      console.error("[Admin] Delete stat exception:", err);
      setError("An unexpected error occurred while deleting the stat.");
    }
  }

  async function onDeleteTestimonial(id: string) {
    setMessage(null);
    setError(null);

    // Auth check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("[Admin] Delete testimonial: User not authenticated");
      setError("You must be logged in to delete testimonials.");
      return;
    }

    if (!confirm("Delete this testimonial?")) return;

    try {
      console.log("[Admin] Deleting testimonial with ID:", id);
      const { data, error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[Admin] Delete testimonial failed:", error);
        setError(`Failed to delete testimonial: ${error.message}`);
        return;
      }

      console.log("[Admin] Testimonial deleted successfully:", data);
      setMessage("Testimonial deleted successfully.");
      await refresh();
    } catch (err) {
      console.error("[Admin] Delete testimonial exception:", err);
      setError("An unexpected error occurred while deleting the testimonial.");
    }
  }

  async function onImageSelectedTestimonial(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("[Admin] Testimonial image selected:", file.name);
    setTestimonialImageUploadStatus("uploading");
    setError(null);

    try {
      const url = await uploadImage(file, setTestimonialImageUploadStatus);
      console.log("[Admin] Testimonial image uploaded successfully:", url);
      if (url) {
        setTestimonialImageUrl(url);
        setTestimonialImageUploadStatus("idle");
      } else {
        console.error("[Admin] Failed to get public URL from testimonial upload");
        setTestimonialImageUploadStatus("error");
        setError("Failed to upload image.");
      }
    } catch (err) {
      console.error("[Admin] Testimonial image upload failed:", err);
      setTestimonialImageUploadStatus("error");
      setError("Failed to upload image.");
    }
  }

  async function onDeleteEvent(id: string) {
    setMessage(null);
    setError(null);

    // Auth check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("[Admin] Delete event: User not authenticated");
      setError("You must be logged in to delete events.");
      return;
    }

    if (!confirm("Delete this event?")) return;

    try {
      console.log(`[Admin] Deleting event with id: ${id}`);
      const { data, error: delErr } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (delErr) {
        console.error("[Admin] Delete event failed:", delErr);
        setError(`Delete failed: ${delErr.message}`);
        return;
      }

      console.log("[Admin] Event deleted successfully, refreshing data...", data);
      setMessage("Event deleted successfully.");
      await refresh();
    } catch (err) {
      console.error("[Admin] Delete event exception:", err);
      setError("An unexpected error occurred while deleting.");
    }
  }

  async function onDeleteTutor(id: string) {
    setMessage(null);
    setError(null);

    // Auth check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("[Admin] Delete tutor: User not authenticated");
      setError("You must be logged in to delete tutors.");
      return;
    }

    if (!confirm("Delete this tutor?")) return;

    try {
      console.log(`[Admin] Deleting tutor with id: ${id}`);
      const { data, error: delErr } = await supabase
        .from("tutors")
        .delete()
        .eq("id", id);

      if (delErr) {
        console.error("[Admin] Delete tutor failed:", delErr);
        setError(`Delete failed: ${delErr.message}`);
        return;
      }

      console.log("[Admin] Tutor deleted successfully, refreshing data...", data);
      setMessage("Tutor deleted successfully.");
      await refresh();
    } catch (err) {
      console.error("[Admin] Delete tutor exception:", err);
      setError("An unexpected error occurred while deleting.");
    }
  }

  async function onTogglePast(row: EventRow) {
    setMessage(null);
    setError(null);

    // Auth check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("[Admin] Toggle past: User not authenticated");
      setError("You must be logged in to update events.");
      return;
    }

    try {
      const currentStatus = Boolean(row.is_past);
      const newStatus = !currentStatus;
      console.log(`[Admin] Toggling event ${row.id} is_past from ${currentStatus} to ${newStatus}`);

      const { data, error: upErr } = await supabase
        .from("events")
        .update({ is_past: newStatus })
        .eq("id", row.id);

      if (upErr) {
        console.error("[Admin] Toggle is_past failed:", upErr);
        setError(`Update failed: ${upErr.message}`);
        return;
      }

      console.log("[Admin] Event past status toggled successfully, refreshing data...", data);
      setMessage(`Event moved to ${newStatus ? "past" : "upcoming"} events.`);
      await refresh();
    } catch (err) {
      console.error("[Admin] Toggle is_past exception:", err);
      setError("An unexpected error occurred while updating.");
    }
  }

  async function onSignOut() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  async function uploadImage(
    file: File,
    setStatus: React.Dispatch<React.SetStateAction<"idle" | "uploading" | "error">>,
  ): Promise<string | null> {
    try {
      // Auth check
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("[Admin] Image upload: User not authenticated");
        setError("You must be logged in to upload images.");
        setStatus("error");
        return null;
      }

      setStatus("uploading");
      const timestamp = Date.now();
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `event-${timestamp}.${ext}`;

      console.log(`[Admin] Uploading image: ${fileName}`);

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("event-images")
        .upload(fileName, file);

      if (uploadErr) {
        console.error("[Admin] Image upload failed:", uploadErr);
        setStatus("error");
        setError(`Upload failed: ${uploadErr.message}`);
        return null;
      }

      console.log("[Admin] Image uploaded successfully:", uploadData);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData?.publicUrl;
      console.log("[Admin] Public URL generated:", publicUrl);

      if (!publicUrl) {
        console.error("[Admin] Failed to generate public URL");
        setStatus("error");
        setError("Failed to generate public URL for image.");
        return null;
      }

      setStatus("idle");
      setMessage("Image uploaded successfully.");
      return publicUrl;
    } catch (err) {
      console.error("[Admin] Image upload exception:", err);
      setEvImageUploadStatus("error");
      setError("Image upload failed. Please try again.");
      return null;
    }
  }

  async function onImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) {
      console.warn("[Admin] No file selected");
      return;
    }

    console.log("[Admin] Image file selected:", file.name);
    const publicUrl = await uploadImage(file, setEvImageUploadStatus);
    if (publicUrl) {
      console.log("[Admin] Setting image URL in form state");
      setEvImageUrl(publicUrl);
    } else {
      console.error("[Admin] Failed to get public URL from upload");
    }
  }

  async function onFounderImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) {
      console.warn("[Admin] No founder file selected");
      return;
    }

    console.log("[Admin] Founder image file selected:", file.name);
    setFounderImageUploadStatus("uploading");
    setError(null);

    try {
      const publicUrl = await uploadImage(file, setFounderImageUploadStatus);
      if (publicUrl) {
        console.log("[Admin] Founder image uploaded successfully:", publicUrl);
        setFounderPhotoUrl(publicUrl);
        setFounderImageUploadStatus("idle");
      } else {
        console.error("[Admin] Failed to get public URL from founder image upload");
        setFounderImageUploadStatus("error");
      }
    } catch (err) {
      console.error("[Admin] Founder image upload failed:", err);
      setFounderImageUploadStatus("error");
      setError("Failed to upload founder image.");
    }
  }

  async function onCreateOrUpdateFounder(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("[Admin] Create/update founder: User not authenticated");
      setError("You must be logged in to update founder information.");
      return;
    }

    if (!founderName.trim() || !founderBio.trim()) {
      setError("Founder name and bio are required.");
      return;
    }

    const payload = {
      name: founderName.trim(),
      bio: founderBio.trim(),
      school: founderSchool.trim() || null,
      expertise: founderExpertise.trim() || null,
      photo_url: founderPhotoUrl || null,
    };

    try {
      let response;
      if (founderId) {
        response = await supabase.from("founders").update(payload).eq("id", founderId).select().single();
      } else {
        response = await supabase.from("founders").insert(payload).select().single();
      }

      if (response.error) {
        console.error("[Admin] Founder save failed:", response.error);
        setError(`Failed to save founder: ${response.error.message}`);
        return;
      }

      const savedFounder = response.data as FounderRow;
      if (!founderId && savedFounder?.id) {
        setFounderId(savedFounder.id);
      }

      setMessage(founderId ? "Founder updated successfully." : "Founder created successfully.");
      await refresh();
    } catch (err) {
      console.error("[Admin] Founder save exception:", err);
      setError("An unexpected error occurred while saving founder information.");
    }
  }

  function tutorLabel(id: string | null | undefined): string {
    if (!id) return "—";
    return tutors.find((t) => t.id === id)?.name ?? "Unknown tutor";
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Admin
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void onSignOut()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            <LogOut size={18} aria-hidden />
            Sign out
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} aria-hidden />
            Back to site
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-slate-500">Loading…</p>
      ) : null}

      {message ? (
        <p
          className="mt-6 rounded-xl border border-stem-500/30 bg-stem-500/10 px-4 py-3 text-sm text-stem-100"
          role="status"
        >
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}

      <section className="mt-10 rounded-2xl border border-white/10 bg-surface-850/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Add tutor</h2>
        <form onSubmit={onCreateTutor} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-tutor-name" className={labelClass}>
              Name
            </label>
            <input
              id="admin-tutor-name"
              value={tutorName}
              onChange={(e) => setTutorName(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-tutor-school" className={labelClass}>
              School (optional)
            </label>
            <input
              id="admin-tutor-school"
              value={tutorSchool}
              onChange={(e) => setTutorSchool(e.target.value)}
              className={inputClass}
              placeholder="e.g., Coppell High School"
            />
          </div>
          <div>
            <label htmlFor="admin-tutor-grade" className={labelClass}>
              Grade / Level (optional)
            </label>
            <input
              id="admin-tutor-grade"
              value={tutorGrade}
              onChange={(e) => setTutorGrade(e.target.value)}
              className={inputClass}
              placeholder="e.g., 12th grade, College"
            />
          </div>
          <div>
            <label htmlFor="admin-tutor-subjects" className={labelClass}>
              Subjects of Expertise (optional)
            </label>
            <input
              id="admin-tutor-subjects"
              value={tutorSubjects}
              onChange={(e) => setTutorSubjects(e.target.value)}
              className={inputClass}
              placeholder="e.g., Physics, Computer Science"
            />
          </div>
          <div>
            <label htmlFor="admin-tutor-bio" className={labelClass}>
              Bio
            </label>
            <textarea
              id="admin-tutor-bio"
              value={tutorBio}
              onChange={(e) => setTutorBio(e.target.value)}
              rows={4}
              className={inputClass}
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-stem-500 px-4 py-2.5 text-sm font-semibold text-surface-950 hover:bg-stem-400"
          >
            <Plus size={18} aria-hidden />
            Create tutor
          </button>
        </form>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-surface-850/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">All tutors</h2>
        {tutors.length === 0 && !loading ? (
          <p className="mt-6 text-sm text-slate-500">No tutors yet. Create one above.</p>
        ) : null}
        <ul className="mt-6 space-y-4">
          {tutors.map((tutor) => (
            <li
              key={tutor.id}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-surface-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{tutor.name}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{tutor.bio}</p>
              </div>
              <button
                type="button"
                onClick={() => void onDeleteTutor(tutor.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/10 sm:shrink-0"
              >
                <Trash2 size={14} aria-hidden />
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-surface-850/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Founder profile</h2>
        <form onSubmit={onCreateOrUpdateFounder} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-founder-name" className={labelClass}>
              Name
            </label>
            <input
              id="admin-founder-name"
              value={founderName}
              onChange={(e) => setFounderName(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-founder-school" className={labelClass}>
              School (optional)
            </label>
            <input
              id="admin-founder-school"
              value={founderSchool}
              onChange={(e) => setFounderSchool(e.target.value)}
              className={inputClass}
              placeholder="e.g., University of Texas"
            />
          </div>
          <div>
            <label htmlFor="admin-founder-expertise" className={labelClass}>
              Expertise (optional)
            </label>
            <input
              id="admin-founder-expertise"
              value={founderExpertise}
              onChange={(e) => setFounderExpertise(e.target.value)}
              className={inputClass}
              placeholder="e.g., Robotics, STEM access"
            />
          </div>
          <div>
            <label htmlFor="admin-founder-bio" className={labelClass}>
              Bio
            </label>
            <textarea
              id="admin-founder-bio"
              value={founderBio}
              onChange={(e) => setFounderBio(e.target.value)}
              rows={4}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-founder-photo" className={labelClass}>
              Founder photo (optional)
            </label>
            <input
              id="admin-founder-photo"
              type="file"
              accept="image/*"
              onChange={(e) => void onFounderImageSelected(e)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-surface-950/80 px-3 py-2.5 text-sm text-slate-300 file:mr-3 file:px-3 file:py-1.5 file:bg-stem-500 file:text-surface-950 file:border-0 file:rounded-lg file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-stem-400"
            />
            {founderImageUploadStatus === "uploading" && (
              <p className="mt-2 text-xs text-stem-300">Uploading founder photo...</p>
            )}
            {founderPhotoUrl && (
              <p className="mt-2 text-xs text-stem-100">✓ Photo ready: {founderPhotoUrl.split("/").pop()}</p>
            )}
            {founderImageUploadStatus === "error" && (
              <p className="mt-2 text-xs text-red-300">Upload failed. Try again.</p>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-stem-500 px-4 py-2.5 text-sm font-semibold text-surface-950 hover:bg-stem-400"
          >
            <Plus size={18} aria-hidden />
            Save founder profile
          </button>
        </form>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-surface-850/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Founder profile</h2>
        {founders.length === 0 && !loading ? (
          <p className="mt-6 text-sm text-slate-500">No founder profile yet. Use the form above to create one.</p>
        ) : null}
        <ul className="mt-6 space-y-4">
          {founders.map((founder) => (
            <li
              key={founder.id}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-surface-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{founder.name}</p>
                <p className="mt-1 text-sm text-slate-400">{founder.school || ""} {founder.expertise ? `· ${founder.expertise}` : ""}</p>
              </div>
              <div className="flex items-center gap-3">
                {founder.photo_url ? (
                  <img
                    src={founder.photo_url}
                    alt={`${founder.name} photo`}
                    className="h-12 w-12 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stem-500 text-sm font-semibold text-surface-950">
                    No photo
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-surface-850/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Add event</h2>
        <form onSubmit={onCreateEvent} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-ev-title" className={labelClass}>
              Title
            </label>
            <input
              id="admin-ev-title"
              value={evTitle}
              onChange={(e) => setEvTitle(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-ev-date" className={labelClass}>
              Date
            </label>
            <input
              id="admin-ev-date"
              type="date"
              value={evDate}
              onChange={(e) => setEvDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-ev-desc" className={labelClass}>
              Description
            </label>
            <textarea
              id="admin-ev-desc"
              value={evDescription}
              onChange={(e) => setEvDescription(e.target.value)}
              rows={4}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-ev-location" className={labelClass}>
              Location Details (optional)
            </label>
            <input
              id="admin-ev-location"
              value={evLocationDetailed}
              onChange={(e) => setEvLocationDetailed(e.target.value)}
              className={inputClass}
              placeholder="e.g., Room 101, Science Building"
            />
          </div>
          <div>
            <label htmlFor="admin-ev-image" className={labelClass}>
              Event Image (optional)
            </label>
            <input
              id="admin-ev-image"
              type="file"
              accept="image/*"
              onChange={(e) => void onImageSelected(e)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-surface-950/80 px-3 py-2.5 text-sm text-slate-300 file:mr-3 file:px-3 file:py-1.5 file:bg-stem-500 file:text-surface-950 file:border-0 file:rounded-lg file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-stem-400"
            />
            {evImageUploadStatus === "uploading" && (
              <p className="mt-2 text-xs text-stem-300">Uploading image...</p>
            )}
            {evImageUrl && (
              <p className="mt-2 text-xs text-stem-100">✓ Image uploaded: {evImageUrl.split("/").pop()}</p>
            )}
            {evImageUploadStatus === "error" && (
              <p className="mt-2 text-xs text-red-300">Upload failed. Try again.</p>
            )}
          </div>
          <div>
            <label htmlFor="admin-ev-attendees" className={labelClass}>
              Attendee Count (optional)
            </label>
            <input
              id="admin-ev-attendees"
              type="number"
              value={evAttendeeCount}
              onChange={(e) => setEvAttendeeCount(e.target.value)}
              className={inputClass}
              placeholder="e.g., 45"
            />
          </div>
          <div>
            <label htmlFor="admin-ev-impact" className={labelClass}>
              Impact Summary (optional)
            </label>
            <textarea
              id="admin-ev-impact"
              value={evImpactSummary}
              onChange={(e) => setEvImpactSummary(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="What impact or key outcomes from this event?"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-stem-500 px-4 py-2.5 text-sm font-semibold text-surface-950 hover:bg-stem-400"
          >
            <Plus size={18} aria-hidden />
            Create event
          </button>
        </form>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-surface-850/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">All events</h2>
        {events.length === 0 && !loading ? (
          <p className="mt-6 text-sm text-slate-500">No events yet. Create one above.</p>
        ) : null}
        <ul className="mt-6 space-y-4">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-surface-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">
                  {(ev.title ?? "").trim() || "Untitled"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatEventDateDisplay(ev.date)}{ev.tutor_id ? " · Lead: " + tutorLabel(ev.tutor_id) : ""}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                  {(ev.description ?? "").trim() || "—"}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-surface-900 text-stem-500 focus:ring-stem-500/30"
                    checked={Boolean(ev.is_past)}
                    onChange={() => void onTogglePast(ev)}
                  />
                  Past event
                </label>
                <button
                  type="button"
                  onClick={() => void onDeleteEvent(ev.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/10"
                >
                  <Trash2 size={14} aria-hidden />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-surface-850/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Add stat</h2>
        <form onSubmit={onCreateStat} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-stat-label" className={labelClass}>
              Label
            </label>
            <input
              id="admin-stat-label"
              value={statLabel}
              onChange={(e) => setStatLabel(e.target.value)}
              className={inputClass}
              placeholder="e.g., Students Helped"
              required
            />
          </div>
          <div>
            <label htmlFor="admin-stat-value" className={labelClass}>
              Value
            </label>
            <input
              id="admin-stat-value"
              type="number"
              value={statValue}
              onChange={(e) => setStatValue(e.target.value)}
              className={inputClass}
              placeholder="e.g., 1000"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-stem-500 px-4 py-2.5 text-sm font-semibold text-surface-950 hover:bg-stem-400"
          >
            <Plus size={18} aria-hidden />
            Create stat
          </button>
        </form>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-surface-850/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">All stats</h2>
        {stats.length === 0 && !loading ? (
          <p className="mt-6 text-sm text-slate-500">No stats yet. Create one above.</p>
        ) : null}
        <ul className="mt-6 space-y-4">
          {stats.map((stat) => (
            <li
              key={stat.id}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-surface-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{stat.label}</p>
                <p className="mt-1 text-sm text-stem-300">{stat.value.toLocaleString()}</p>
              </div>
              <button
                type="button"
                onClick={() => void onDeleteStat(stat.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/10 sm:shrink-0"
              >
                <Trash2 size={14} aria-hidden />
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-surface-850/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Add testimonial</h2>
        <form onSubmit={onCreateTestimonial} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-testimonial-name" className={labelClass}>
              Name
            </label>
            <input
              id="admin-testimonial-name"
              value={testimonialName}
              onChange={(e) => setTestimonialName(e.target.value)}
              className={inputClass}
              placeholder="e.g., Sarah Johnson"
              required
            />
          </div>
          <div>
            <label htmlFor="admin-testimonial-role" className={labelClass}>
              Role
            </label>
            <input
              id="admin-testimonial-role"
              value={testimonialRole}
              onChange={(e) => setTestimonialRole(e.target.value)}
              className={inputClass}
              placeholder="e.g., High School Student"
              required
            />
          </div>
          <div>
            <label htmlFor="admin-testimonial-content" className={labelClass}>
              Content
            </label>
            <textarea
              id="admin-testimonial-content"
              value={testimonialContent}
              onChange={(e) => setTestimonialContent(e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="The testimonial content..."
              required
            />
          </div>
          <div>
            <label htmlFor="admin-testimonial-image" className={labelClass}>
              Profile Image (optional)
            </label>
            <input
              id="admin-testimonial-image"
              type="file"
              accept="image/*"
              onChange={(e) => void onImageSelectedTestimonial(e)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-surface-950/80 px-3 py-2.5 text-sm text-slate-300 file:mr-3 file:px-3 file:py-1.5 file:bg-stem-500 file:text-surface-950 file:border-0 file:rounded-lg file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-stem-400"
            />
            {testimonialImageUploadStatus === "uploading" && (
              <p className="mt-2 text-xs text-stem-300">Uploading image...</p>
            )}
            {testimonialImageUrl && (
              <p className="mt-2 text-xs text-stem-100">✓ Image uploaded: {testimonialImageUrl.split("/").pop()}</p>
            )}
            {testimonialImageUploadStatus === "error" && (
              <p className="mt-2 text-xs text-red-300">Upload failed. Try again.</p>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-stem-500 px-4 py-2.5 text-sm font-semibold text-surface-950 hover:bg-stem-400"
          >
            <Plus size={18} aria-hidden />
            Create testimonial
          </button>
        </form>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-surface-850/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">All testimonials</h2>
        {testimonials.length === 0 && !loading ? (
          <p className="mt-6 text-sm text-slate-500">No testimonials yet. Create one above.</p>
        ) : null}
        <ul className="mt-6 space-y-4">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.id}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-surface-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{testimonial.name}</p>
                <p className="mt-1 text-xs text-slate-500">{testimonial.role}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{testimonial.content}</p>
                {testimonial.image_url && (
                  <p className="mt-1 text-xs text-stem-300">Has profile image</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => void onDeleteTestimonial(testimonial.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/10 sm:shrink-0"
              >
                <Trash2 size={14} aria-hidden />
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
