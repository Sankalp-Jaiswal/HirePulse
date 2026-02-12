const RankingTable = ({ data }) => (
  <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 overflow-x-auto">
    <h2 className="text-xl font-semibold mb-4 text-white">
      Top Ranked Candidates
    </h2>

    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-800 text-white text-left">
          <th className="p-4 border-b border-gray-700 text-center">Rank</th>
          <th className="p-4 border-b border-gray-700 text-center">Name</th>
          <th className="p-4 border-b border-gray-700 text-center">Score</th>
          <th className="p-4 border-b border-gray-700 text-center">Reason</th>
          <th className="p-4 border-b border-gray-700 text-center">Resume</th>
        </tr>
      </thead>
      <tbody>
        {data.map((c, index) => (
          <tr key={c.rank} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/50'}`}>
            <td className="p-4 font-medium text-white">{c.rank}</td>
            <td className="p-4 text-white">{c.Name}</td>
            <td className="p-4 text-white">
              <span className="font-semibold">{c.score}</span>
            </td>
            <td className="p-4 text-sm text-gray-300">
              {c.reason}
            </td>
            <td className="p-4 text-white">
              <a href={c.Resume_Link} target="_blank" className="font-semibold">Resume</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RankingTable;
