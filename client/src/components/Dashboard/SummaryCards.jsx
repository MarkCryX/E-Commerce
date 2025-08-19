export default function SummaryCards({ icon, title, value, unit }) {
  return (
    <div className="gap-10 rounded-md bg-white p-5 shadow-md">
      <div className="flex items-center gap-5">
        {icon}
        <h3 className="text-start text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-5 text-end text-xl font-bold">
        {value.toLocaleString()} {unit}
      </p>
    </div>
  );
}
