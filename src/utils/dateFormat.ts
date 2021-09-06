import dateFormat from "dateformat";

dateFormat.i18n = {
  dayNames: [
    "Nd",
    "Pon",
    "Wt",
    "Śr",
    "Czw",
    "Pt",
    "Sob",
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ],
  monthNames: [
    "Sty",
    "Lut",
    "Mar",
    "Kwi",
    "Maj",
    "Cze",
    "Lip",
    "Sie",
    "Wrz",
    "Paź",
    "Lis",
    "Gru",
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ],
  timeNames: ["a", "p", "am", "pm", "A", "P", "AM", "PM"],
};
export default dateFormat;

export const checkIfString = (str: any) => {
  if (typeof str === "string" || str instanceof String) return true;
  return false;
};

export const checkIfDate = (str: any) => {
  if (!str) return false;
  const date = Date.parse(str);
  return !isNaN(date);
};

export const getMonday = (d: Date, format?: string) => {
  d = new Date(d);
  const day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return dateFormat(d.setDate(diff), format ? format : "isoDate");
};
export const getSunday = (d: Date, format?: string) => {
  d = new Date(d);
  const day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? 0 : +7);
  return dateFormat(d.setDate(diff), format ? format : "isoDate");
};
