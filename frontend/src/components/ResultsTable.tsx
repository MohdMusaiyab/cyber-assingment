import { LogEvent } from '../types';
import { formatEpochTime } from '../utils';

export default function ResultsTable({ results }: { results: LogEvent[] }) {
  return (
    <div className="mt-4 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Source IP</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Dest IP</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Ports</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Protocol</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Action</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Time Range</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">File</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {results.map((event, index) => (
            <tr key={`${event.serialno}-${index}`}>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">{event.srcaddr}</td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">{event.dstaddr}</td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                {event.srcport} → {event.dstport}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                {event.protocol}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.action === 'REJECT' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {event.action}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                {formatEpochTime(event.starttime)} - {formatEpochTime(event.endtime)}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 truncate max-w-xs">
                {event.file}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}