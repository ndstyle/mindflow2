export default function MindMapDisplay({ mindMap }: { mindMap: any }) {
    return (
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap">
        {JSON.stringify(mindMap, null, 2)}
      </pre>
    );
  }
