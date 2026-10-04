export default function formatDate(date) {
  if (!date) return "none";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "none";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
