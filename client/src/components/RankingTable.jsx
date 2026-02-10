const RankingTable = ({ data }) => (
  <div className="bg-white p-4 rounded shadow overflow-x-auto">
    <h2 className="text-xl font-semibold mb-4">
      Top Ranked Candidates
    </h2>

    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-2">Rank</th>
          <th className="p-2">Name</th>
          <th className="p-2">Score</th>
          <th className="p-2">Reason</th>
        </tr>
      </thead>
      <tbody>
        {data.map((c) => (
          <tr key={c.rank} className="border-t">
            <td className="p-2 font-medium">{c.rank}</td>
            <td className="p-2">{c.Name}</td>
            <td className="p-2">
              <span className="font-semibold">{c.score}</span>/100
            </td>
            <td className="p-2 text-sm text-gray-700">
              {c.reason}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RankingTable;
