export default function Dashboard() {
  return (
    <div className="overflow-hidden" style={{ height: "calc(100vh - 70px)" }}>
      <div className="flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          This is admin only dashboard
        </h1>
        <p className="text-gray-500 text-sm md:text-lg">
          This can be edited
        </p>
      </div>
    </div>
  );
}
