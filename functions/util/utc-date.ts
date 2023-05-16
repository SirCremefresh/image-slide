function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export function getUtcDateTimeString(): string {
  const dateString = new Date().toLocaleString("en-US", { timeZone: "UTC" });
  const date = new Date(dateString);
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getHours()),
  ].join("-");
}
